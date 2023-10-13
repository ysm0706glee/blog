<script setup lang="ts">
import { blogInjectionKey } from "~/composables/useBlog";
import { Tag } from "~/types/tag";

const _useBlog = useBlog();

const _useTag = useTag();

provide(blogInjectionKey, _useBlog);

provide(tagInjectionKey, _useTag);

const { blogsState, offset, getBlogsWithInfiniteScrollByTags } = _useBlog;

const { getTags } = _useTag;

const onGetBlogsWithInfiniteByTags = async (tags: Tag[]) => {
  blogsState.value = [];
  offset.value = 0;
  await getBlogsWithInfiniteScrollByTags(tags);
};

try {
  await getTags();
} catch (error) {
  console.error(error);
}
</script>

<template>
  <TTop @on-get-blogs-with-infinite-by-tags="onGetBlogsWithInfiniteByTags" />
</template>
