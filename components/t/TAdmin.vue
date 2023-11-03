<script setup lang="ts">
import type { Blog } from "@/types/blog";

const blogData = ref<Pick<Blog, "url" | "title" | "description" | "image">>({
  url: "",
  title: "",
  description: "",
  image: "",
});

const isAfterGettingOgp = ref(false);

const setBlogData = (
  url: Blog["url"],
  blog: Pick<Blog, "title" | "description" | "image">
) => {
  if (!url.length) {
    isAfterGettingOgp.value = false;
  }
  blogData.value = {
    url,
    ...blog,
  };
};

const afterGettingOgp = () => {
  isAfterGettingOgp.value = true;
};
</script>

<template>
  <div>
    <OOgpForm
      @set-blog-data="setBlogData"
      @after-getting-ogp="afterGettingOgp"
    />
    <template v-if="isAfterGettingOgp">
      <OBlogForm :blog-data="blogData" />
    </template>
  </div>
</template>
