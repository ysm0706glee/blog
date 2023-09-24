<script setup lang="ts">
import { Blog } from "~/types/blog";
const { postBlog } = useBlog();

const url = ref("");

const blog = ref<Pick<Blog, "url" | "title" | "description" | "image">>({
  url: "",
  title: "",
  description: "",
  image: "",
});

const onGetOgp = async () => {
  if (!url.value.length) return;
  const response = await $fetch("/api/ogp", {
    method: "POST",
    body: { url: url.value },
  });
  blog.value = { url: url.value, ...response };
};

const onPost = async () => {
  if (!blog.value.url.length) return;
  if (!blog.value.title.length) return;
  if (!blog.value.description.length) return;
  await postBlog(blog.value);
};
</script>

<template>
  <UInput v-model="url" />
  <UButton @click="onGetOgp">Get OGP</UButton>
  <UInput v-model="blog.title" />
  <UInput v-model="blog.description" />
  <!-- TODO: as -->
  <UInput v-model="(blog.image as string)" />
  <UButton @click="onPost">Post</UButton>
</template>
