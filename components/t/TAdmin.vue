<script setup lang="ts">
import type { Blog } from "@/types/blog";

const { blogsState } = inject(blogInjectionKey)!;
console.log(blogsState);

type Props = {
  isAfterGettingOgp: boolean;
};

const props = defineProps<Props>();

type Emits = {
  (emit: "on-get-ogp", url: Blog["url"]): Promise<Blog | null>;
  (emit: "update-image", file: File): void;
  (emit: "on-delete-image"): Promise<void>;
  (
    emit: "on-post-blog",
    blog: Pick<Blog, "url" | "title" | "description" | "image">
  ): Promise<Blog | null>;
  (emit: "on-delete-blog", blogId: Blog["id"]): Promise<void>;
};

const emits = defineEmits<Emits>();

const onGetOgp = (url: Blog["url"]) => {
  emits("on-get-ogp", url);
};

const updateImage = (file: File) => {
  emits("update-image", file);
};

const onDeleteImage = () => {
  emits("on-delete-image");
};

const onPostBlog = (
  blog: Pick<Blog, "url" | "title" | "description" | "image">
) => {
  emits("on-post-blog", blog);
};

const onDeleteBlog = (blogId: Blog["id"]) => {
  emits("on-delete-blog", blogId);
};
</script>

<template>
  <div>
    <h2>Add new blog</h2>
    <OOgpForm class="mb-8" @on-get-ogp="onGetOgp" />
    <template v-if="isAfterGettingOgp">
      <OBlogForm
        @update-image="updateImage"
        @on-delete-image="onDeleteImage"
        @on-post-blog="onPostBlog"
      />
    </template>
    <h2>Your blogs</h2>
    <OAdminBlogList @on-delete-blog="onDeleteBlog" />
  </div>
</template>
