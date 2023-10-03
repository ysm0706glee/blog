<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const { blogsState, offset, limit, getBlogs } = useBlog();

const scrollContainerRef = ref<HTMLElement | null>(null);
const isFetching = ref(false);
const hasMoreData = ref(true);

const loadMoreBlogs = async () => {
  if (!hasMoreData.value) return;
  isFetching.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const newBlogs = await getBlogs(offset.value, limit);
  if (newBlogs?.length) {
    offset.value += limit;
  } else {
    hasMoreData.value = false;
  }
  isFetching.value = false;
};

useInfiniteScroll(
  scrollContainerRef,
  async () => {
    if (hasMoreData.value) {
      await loadMoreBlogs();
    }
  },
  {
    distance: 10,
  }
);

try {
  await loadMoreBlogs();
} catch (error) {
  console.error(error);
}
</script>

<template>
  <div>
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
