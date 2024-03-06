<script setup lang="ts">
import { useGtm } from "@gtm-support/vue-gtm";
import type { Blog } from "@/types/blog";

const gtm = useGtm();

type Props = {
  blog: Blog;
};

const props = defineProps<Props>();

const handleClick = () => {
  gtm?.trackEvent({
    event: "blog_name",
    blog_name: `clicked on ${props.blog.title}`,
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
    class="flex items-center space-x-4 hover:text-gray-400"
    :onclick="handleClick"
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
  </div>
</template>
