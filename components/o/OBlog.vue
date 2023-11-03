<script setup lang="ts">
import type { Blog } from "@/types/blog";

type Props = {
  blog: Blog;
};

const props = defineProps<Props>();
</script>

<template>
  <a :href="blog.url" class="flex items-center space-x-4 hover:text-gray-400">
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
</template>
