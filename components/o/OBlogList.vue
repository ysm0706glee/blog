<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import type { Tag } from "@/types/tag";

const {
  blogsState,
  isFetching,
  hasMoreData,
  getBlogsWithInfiniteScroll,
  getBlogsWithInfiniteScrollByTags,
} = inject(blogInjectionKey)!;

// TODO: ! is not safe
const { selectedTags } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "on-get-blogs-with-infinite-by-tags", tags: Tag[]): void;
};

const emits = defineEmits<Emits>();

const scrollContainerRef = ref<HTMLElement | null>(null);

const isFilteringByTags = computed(() => selectedTags.value.length > 0);

useInfiniteScroll(
  scrollContainerRef,
  async () => {
    if (hasMoreData.value && !isFetching.value) {
      isFilteringByTags.value
        ? await getBlogsWithInfiniteScrollByTags(selectedTags.value)
        : await getBlogsWithInfiniteScroll();
    }
  },
  {
    distance: 100,
  }
);
</script>

<template>
  <div class="p-4 text-center">
    <template v-if="blogsState.length">
      <ul
        ref="scrollContainerRef"
        class="w-full max-w-2xl mx-auto h-96 overflow-y-scroll"
      >
        <li
          v-for="blog in blogsState"
          :key="blog.id"
          class="p-4 border-b border-gray-700"
        >
          <OBlog :blog="blog" />
        </li>
      </ul>
    </template>

    <template v-if="isFetching">
      <div class="h-24 mt-4 flex justify-center items-center">
        <ALoading />
      </div>
    </template>

    <template v-if="!blogsState.length && !isFetching">
      <p class="mt-4 text-lg text-gray-500">No data available</p>
    </template>
  </div>
</template>
