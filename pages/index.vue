<script setup lang="ts">
import { blogInjectionKey } from "@/composables/useBlog";
import type { Tag } from "@/types/tag";

const _useBlog = useBlog();

const _useTag = useTag();

provide(blogInjectionKey, _useBlog);

provide(tagInjectionKey, _useTag);

const {
  blogsState,
  offsetState,
  limitState,
  hasMoreData,
  getBlogs,
  getBlogsByTags,
} = _useBlog;

const { getTags } = _useTag;

const onGetBlogsWithInfiniteByTags = async (tags: Tag[]) => {
  blogsState.value = [];
  offsetState.value = 0;
  if (tags.length === 0) {
    hasMoreData.value = true;
    await getBlogs(offsetState.value, limitState.value);
    return;
  }
  await getBlogsByTags(tags, offsetState.value, limitState.value);
};

try {
  await getTags();
  await getBlogs(offsetState.value, limitState.value);
} catch (error) {
  console.error(error);
}
</script>

<template>
  <TTop @on-get-blogs-with-infinite-by-tags="onGetBlogsWithInfiniteByTags" />
</template>
