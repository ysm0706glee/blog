<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { tagInjectionKey } from "~/composables/useTag";
import type { Blog } from "@/types/blog";
import type { Tag } from "~/types/tag";

// TODO: ! is not safe
const { blogDataState } = inject(blogInjectionKey)!;

// TODO: ! is not safe
const { imageUrl, previewImageUrl } = inject(imageInjectionKey)!;

// TODO: ! is not safe
const { tagState, selectedTags, toggleTag } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "update-image", file: File): void;
  (emit: "on-delete-image"): Promise<void>;
  (emit: "on-post-tag", name: Tag["name"]): Promise<Tag | null>;
  (
    emit: "on-post-blog",
    blog: Pick<Blog, "url" | "title" | "description" | "image">,
    tags: Tag[]
  ): Promise<Blog | null>;
};

const emits = defineEmits<Emits>();

const validationSchema = toTypedSchema(
  zod.object({
    url: zod
      .string()
      .min(1, "Field is required")
      .url({ message: "Must be a valid url" })
      .default(blogDataState.value.url),
    title: zod
      .string()
      .min(1, "Field is required")
      .default(blogDataState.value.title),
    description: zod
      .string()
      .min(1, "Field is required")
      .default(blogDataState.value.description),
    image: zod
      .string()
      .min(1, "Field is required")
      .default(blogDataState.value.image),
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

const isOpenAddTagModal = ref(false);

const updateImage = async (event: Event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    const files = target.files;
    if (files) {
      const file = files?.[0];
      previewImageUrl.value = URL.createObjectURL(file);
      emits("update-image", file);
    } else {
      console.error("Files is null");
    }
  } else {
    console.error("Event target is not an HTMLInputElement");
  }
};

const onDeleteImage = async () => {
  image.value.value = "";
  emits("on-delete-image");
};

const openAddTagModal = () => {
  isOpenAddTagModal.value = true;
};

const onPostBlog = handleSubmit(async ({ url, title, description, image }) => {
  emits("on-post-blog", { url, title, description, image }, selectedTags.value);
});

const onPostTag = (name: Tag["name"]) => {
  emits("on-post-tag", name);
};

watch(imageUrl, (newImageUrl) => {
  console.log("imageUrl", newImageUrl);
  image.value.value = newImageUrl;
});
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onPostBlog">
    <div>
      <label for="title">Title(Required)</label>
      <UInput id="title" v-model="title.value.value" />
      <span class="block min-h-[2rem]">{{ errors.title }}</span>
    </div>
    <div>
      <label for="description">Description(Required)</label>
      <UTextarea id="description" v-model="description.value.value" />
      <span class="block min-h-[2rem]">{{ errors.description }}</span>
    </div>
    <div>
      <label for="image">Image</label>
      <UInput type="file" @change="updateImage" />
      <span class="block min-h-[2rem]">{{ errors.image }}</span>
      <div class="relative w-60 h-60">
        <template v-if="previewImageUrl">
          <img
            class="w-full h-full object-cover rounded"
            :src="previewImageUrl"
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
        </template>
      </div>
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
          @post-tag="onPostTag"
        />
      </div>
    </div>
    <div>
      <UButton @click="onPostBlog">Post</UButton>
    </div>
  </form>
</template>
