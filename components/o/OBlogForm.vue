<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import type { Blog } from "@/types/blog";
import { tagInjectionKey } from "~/composables/useTag";

type Props = {
  blogData: Pick<Blog, "url" | "title" | "description" | "image">;
};

const props = defineProps<Props>();

// TODO: ! is not safe
const { postBlog } = inject(blogInjectionKey)!;

// TODO: ! is not safe
const { tagState, selectedTags, toggleTag } = inject(tagInjectionKey)!;

// TODO: ! is not safe
const { postImage, deleteImage } = inject(imageInjectionKey)!;

const validationSchema = toTypedSchema(
  zod.object({
    url: zod
      .string()
      .min(1, "Field is required")
      .url({ message: "Must be a valid url" })
      .default(props.blogData.url),
    title: zod
      .string()
      .min(1, "Field is required")
      .default(props.blogData.title),
    description: zod
      .string()
      .min(1, "Field is required")
      .default(props.blogData.description),
    image: zod
      .string()
      .min(1, "Field is required")
      .default(props.blogData.image),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
});

const fields = {
  url: useField<Blog["url"]>("url"),
  title: useField<Blog["title"]>("title"),
  description: useField<Blog["description"]>("description"),
  image: useField<Blog["image"]>("image"),
};

const { title, description, image } = fields;

const temporaryImageKey = ref("");

const isOpenAddTagModal = ref(false);

const onPost = handleSubmit(async ({ url, title, description, image }) => {
  const response = await postBlog(
    {
      url,
      title,
      description,
      image,
    },
    selectedTags.value
  );
  response
    ? useNuxtApp().$toast.success("success")
    : useNuxtApp().$toast.error("error");
});

const updateImage = async (event: Event) => {
  try {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const files = target.files;
      if (files) {
        const response = await postImage(files[0]);
        // TODO: type
        image.value.value = response.url;
        temporaryImageKey.value = response.key;
      }
    } else {
      console.error("Event target is not an HTMLInputElement");
    }
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onDeleteImage = async () => {
  try {
    await deleteImage(temporaryImageKey.value);
    image.value.value = "";
    temporaryImageKey.value = "";
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const openAddTagModal = () => {
  isOpenAddTagModal.value = true;
};
</script>

<template>
  <form
    class="flex flex-col justify-center items-center gap-4"
    @submit="onPost"
  >
    <div>
      <label for="title">Title(Required)</label>
      <UInput id="title" v-model="title.value.value" />
      <span>{{ errors.title }}</span>
    </div>
    <div>
      <label for="description">Description(Required)</label>
      <UInput id="description" v-model="description.value.value" />
      <span>{{ errors.description }}</span>
    </div>
    <div>
      <label for="image">Image</label>
      <UInput type="file" @change="updateImage" />
      <span>{{ errors.image }}</span>
      <template v-if="image.value.value">
        <div class="relative w-60 h-60">
          <img
            class="w-full h-full object-cover rounded"
            :src="image.value.value"
            alt="image-url"
          />
          <UButton
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            class="absolute top-0 right-0"
            @click="onDeleteImage"
          />
        </div>
      </template>
    </div>
    <div class="flex flex-col">
      <label for="image">Tags</label>
      <template v-if="tagState.length">
        <OTagList @on-toggle-tag="toggleTag" />
      </template>
      <div>
        <UButton label="Add tag" @click="openAddTagModal" />
        <OAddTagModal
          :is-open-add-tag-modal="isOpenAddTagModal"
          @update:is-open-add-tag-modal="isOpenAddTagModal = $event"
          @toggle-tag="toggleTag"
        />
      </div>
    </div>
    <UButton @click="onPost">Post</UButton>
  </form>
</template>
