<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { Tag } from "~/types/tag";

const {
  blogsState,
  isFetching,
  hasMoreData,
  getBlogsWithInfiniteScroll,
  getBlogsWithInfiniteScrollByTags,
} = inject(blogInjectionKey)!;

// TODO: ! is not safe
const { tagState, selectedTags, toggleTag } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "on-get-blogs-with-infinite-by-tags", tags: Tag[]): void;
};

const emits = defineEmits<Emits>();

const scrollContainerRef = ref<HTMLElement | null>(null);

const isFilteringByTags = computed(() => selectedTags.value.length > 0);

const onToggleTag = (tagId: Tag["id"]) => {
  toggleTag(tagId);
  emits("on-get-blogs-with-infinite-by-tags", selectedTags.value);
};

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
  <div class="h-screen">
    <div>
      <template v-if="tagState.length">
        <OTagList @on-toggle-tag="onToggleTag" />
      </template>
    </div>
    <ul class="h-full overflow-y-scroll" ref="scrollContainerRef">
      <li
        v-for="blog in blogsState"
        :key="blog.id"
        class="p-4 border-b border-gray-700"
      >
        <a
          :href="blog.url"
          class="flex items-center space-x-4 hover:text-gray-400"
        >
          <div class="flex-1">
            <h2 class="text-lg font-semibold">{{ blog.title }}</h2>
            <p class="text-sm">{{ blog.description }}</p>
          </div>
          <template v-if="blog.image">
            <img
              :src="blog.image"
              :alt="`${blog.title}'s picture`"
              class="w-20 h-20 object-cover rounded"
            />
          </template>
        </a>
      </li>
      <template v-if="isFetching">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
      </template>
    </ul>
  </div>
</template>
