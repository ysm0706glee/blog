<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { Blog } from "~/types/blog";
import { Tag } from "~/types/tag";
import { tagInjectionKey } from "~/composables/useTag";

type Props = {
  blogData: Pick<Blog, "url" | "title" | "description" | "image">;
};

const props = defineProps<Props>();

const { postBlog } = useBlog();

// TODO: ! is not safe
const { tagState, selectedTags, getTags } = inject(tagInjectionKey)!;

const validationSchema = toTypedSchema(
  zod.object({
    url: zod
      .string()
      .nonempty("Field is required")
      .url({ message: "Must be a valid url" })
      .default(props.blogData.url),
    title: zod
      .string()
      .nonempty("Field is required")
      .default(props.blogData.title),
    description: zod
      .string()
      .nonempty("Field is required")
      .default(props.blogData.description),
    image: zod
      .string()
      .nonempty("Field is required")
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

const toggleTag = (tagId: Tag["id"]) => {
  const tag = tagState.value.find((tag) => tag.id === tagId);
  if (!tag) return;
  if (selectedTags.value.some((selectedTag) => selectedTag.id === tagId)) {
    selectedTags.value = selectedTags.value.filter(
      (selectedTag) => selectedTag.id !== tagId
    );
  } else {
    selectedTags.value = [tag, ...selectedTags.value];
  }
};

const openAddTagModal = () => {
  isOpenAddTagModal.value = true;
};

try {
  await getTags();
} catch (error) {
  console.error(error);
  useNuxtApp().$toast.error("error");
}
</script>

<template>
  <form @submit="onPost">
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
      <UInput id="image" v-model="image.value.value" />
      <span>{{ errors.image }}</span>
    </div>
    <div>
      <label for="image">Tags</label>
      <template v-if="tagState.length">
        <UBadge
          v-for="tag in tagState"
          :key="tag.id"
          :label="tag.name"
          :color="
            selectedTags.some((selectedTag) => selectedTag.id === tag.id)
              ? 'primary'
              : 'gray'
          "
          class="cursor-pointer"
          @click="toggleTag(tag.id)"
        />
      </template>
      <div>
        <UButton label="Open" @click="openAddTagModal" />
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
