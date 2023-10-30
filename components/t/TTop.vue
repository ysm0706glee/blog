<script setup lang="ts">
import { Tag } from "~/types/tag";

// TODO: ! is not safe
const { tagState, selectedTags, toggleTag } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "on-get-blogs-with-infinite-by-tags", tags: Tag[]): void;
};

const emits = defineEmits<Emits>();

const onToggleTag = (tagId: Tag["id"]) => {
  toggleTag(tagId);
  emits("on-get-blogs-with-infinite-by-tags", selectedTags.value);
};

const onGetBlogsWithInfiniteByTags = (selectedTags: Tag[]) => {
  emits("on-get-blogs-with-infinite-by-tags", selectedTags);
};
</script>

<template>
  <OAbout />
  <section class="h-[70vh]">
    <template v-if="tagState.length">
      <OTagList @on-toggle-tag="onToggleTag" />
    </template>
    <OBlogList
      @on-get-blogs-with-infinite-by-tags="onGetBlogsWithInfiniteByTags"
    />
  </section>
</template>
