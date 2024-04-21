<script setup lang="ts">
import type { Blog } from "@/types/blog";

const { gtag } = useGtag();

type Props = {
  blog: Blog;
};

const props = defineProps<Props>();

const handleClick = () => {
  gtag("event", "blog", {
    event_category: "blog",
    event_label: `clicked on ${props.blog.title}`,
    value: "user clicked on a blog",
  });
  return navigateTo(props.blog.url, {
    open: {
      target: "_blank",
    },
    external: true,
  });
};
</script>

<template>
  <div
    class="flex items-center space-x-4 cursor-pointer hover:text-gray-400"
    :onclick="handleClick"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold">{{ blog.title }}</h2>
      <p class="text-sm">{{ blog.description }}</p>
      <p class="text-xs">{{ formatDate(blog.created_at) }}</p>
    </div>
    <template v-if="blog.image">
      <NuxtImg
        :src="blog.image"
        :alt="`${blog.title}'s picture`"
        class="w-20 h-20 object-cover rounded"
      />
    </template>
  </div>
</template>
