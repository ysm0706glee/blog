<script setup lang="ts">
const { blogsState, getBlogs } = useBlog();

try {
  await getBlogs();
} catch (error) {
  console.error(error);
}
</script>

<template>
  <ul>
    <li v-for="blog in blogsState" :key="blog.id">
      <a :href="blog.url">
        {{ blog.title }}
        {{ blog.description }}
        <template v-if="blog.picture">
          <img :src="blog.picture" :alt="`${blog.title}'s picture'`" />
        </template>
      </a>
    </li>
  </ul>
</template>
