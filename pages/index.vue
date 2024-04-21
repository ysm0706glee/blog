<script setup lang="ts">
import { blogInjectionKey } from "@/composables/useBlog";

const _useBlog = useBlog();

provide(blogInjectionKey, _useBlog);

const { blogsState, offsetState, limitState, hasMoreData, getBlogs } = _useBlog;

try {
  await getBlogs(offsetState.value, limitState.value);
} catch (error) {
  console.error(error);
  useNuxtApp().$toast.error("error");
}
</script>

<template>
  <TTop />
</template>
