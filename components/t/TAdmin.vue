<script setup lang="ts">
import type { Blog } from "@/types/blog";
import type { Tag } from "@/types/tag";

type Props = {
  isAfterGettingOgp: boolean;
};

const props = defineProps<Props>();

type Emits = {
  (emit: "on-get-ogp", url: Blog["url"]): Promise<Blog | null>;
  (emit: "update-image", file: File): void;
  (emit: "on-delete-image"): Promise<void>;
  (emit: "on-post-tag", name: Tag["name"]): Promise<Tag | null>;
  (
    emit: "on-post-blog",
    blog: Pick<Blog, "url" | "title" | "description" | "image">,
    tags: Tag[]
  ): Promise<Blog | null>;
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

const onPostTag = (name: Tag["name"]) => {
  emits("on-post-tag", name);
};

const onPostBlog = (
  blog: Pick<Blog, "url" | "title" | "description" | "image">,
  tags: Tag[]
) => {
  emits("on-post-blog", blog, tags);
};
</script>

<template>
  <div>
    <OOgpForm class="mb-8" @on-get-ogp="onGetOgp" />
    <template v-if="isAfterGettingOgp">
      <OBlogForm
        @update-image="updateImage"
        @on-delete-image="onDeleteImage"
        @on-post-tag="onPostTag"
        @on-post-blog="onPostBlog"
      />
    </template>
  </div>
</template>
