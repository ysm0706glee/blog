<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { Blog } from "~/types/blog";

type Props = {
  blogData: Pick<Blog, "url" | "title" | "description" | "image">;
};

const props = defineProps<Props>();

const { postBlog } = useBlog();

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

const onPost = handleSubmit(async ({ url, title, description, image }) => {
  const response = await postBlog({
    url,
    title,
    description,
    image,
  });
  response
    ? useNuxtApp().$toast.success("success")
    : useNuxtApp().$toast.error("error");
});
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
    <UButton @click="onPost">Post</UButton>
  </form>
</template>
