<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import type { Blog } from "~/types/blog";

const { blogsState, isFetching, hasMoreData, getBlogsWithInfiniteScroll } =
  inject(blogInjectionKey)!;

const scrollContainerRef = ref<HTMLElement | null>(null);

type Emits = {
  (emit: "on-delete-blog", blogId: Blog["id"]): Promise<void>;
};

const emits = defineEmits<Emits>();

const isOpen = ref(false);
const selectedBlogId = ref<Blog["id"] | null>(null);

const onDeleteBlog = async () => {
  if (!selectedBlogId.value) return;
  await emits("on-delete-blog", selectedBlogId.value);
};

useInfiniteScroll(
  scrollContainerRef,
  async () => {
    if (hasMoreData.value && !isFetching.value) {
      await getBlogsWithInfiniteScroll();
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
          class="p-4 border-b border-gray-700 cursor-pointer"
          @click="
            () => {
              isOpen = true;
              selectedBlogId = blog.id;
            }
          "
        >
          <OAdminBlog :blog="blog" />
        </li>
      </ul>
    </template>

    <template v-if="isFetching">
      <div class="h-24 mt-4 flex justify-center items-center">
        <ALoading />
      </div>
    </template>

    <template v-if="!blogsState.length && !isFetching">
      <p class="mt-4 text-lg text-gray-500">No blogs</p>
    </template>
  </div>
  <UModal v-model="isOpen">
    <div class="p-4 flex flex-col gap-1">
      <p>Are you sure you want to delete?</p>
      <UButton
        color="red"
        @click="
          () => {
            onDeleteBlog();
            isOpen = false;
          }
        "
        >delete
      </UButton>
    </div>
  </UModal>
</template>
