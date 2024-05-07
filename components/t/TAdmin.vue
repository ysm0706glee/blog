<script setup lang="ts">
import type { Blog } from "@/types/blog";

type Props = {
  isGetOgpLoading: boolean;
  isPostBlogLoading: boolean;
};

const props = defineProps<Props>();

type Emits = {
  (emit: "on-get-ogp", url: Blog["url"]): Promise<Blog | null>;
  (emit: "on-update-image", file: File): void;
  (emit: "on-delete-image"): Promise<void>;
  (
    emit: "on-post-blog",
    blog: Pick<Blog, "url" | "title" | "description" | "image">
  ): Promise<void>;
  (emit: "on-delete-blog", blogId: Blog["id"]): Promise<void>;
};

const emits = defineEmits<Emits>();

const isOpenAddBlogModal = ref(false);

const onOpenAddBlogModal = () => {
  isOpenAddBlogModal.value = true;
};

const onCloseAddBlogModal = () => {
  isOpenAddBlogModal.value = false;
};

const onGetOgp = (url: Blog["url"]) => {
  emits("on-get-ogp", url);
};

const updateImage = (file: File) => {
  emits("on-update-image", file);
};

const onDeleteImage = () => {
  emits("on-delete-image");
};

const onPostBlog = async (
  blog: Pick<Blog, "url" | "title" | "description" | "image">
) => {
  await emits("on-post-blog", blog);
  onCloseAddBlogModal();
};

const onDeleteBlog = (blogId: Blog["id"]) => {
  emits("on-delete-blog", blogId);
};
</script>

<template>
  <div>
    <h1>Manage your blogs</h1>
    <span>Click to delete</span>
    <OAdminBlogList @on-delete-blog="onDeleteBlog" />
    <UButton @click="onOpenAddBlogModal">Add blog</UButton>
    <template v-if="isOpenAddBlogModal">
      <!-- TODO: component -->
      <UModal v-model="isOpenAddBlogModal">
        <div class="relative p-8">
          <UButton
            class="absolute top-0 right-0"
            icon="i-heroicons-x-mark"
            size="sm"
            :ui="{ rounded: 'rounded-full' }"
            @click="onCloseAddBlogModal"
          />
          <OBlogForm
            :is-get-ogp-loading="isGetOgpLoading"
            :is-post-blog-loading="isPostBlogLoading"
            @on-get-ogp="onGetOgp"
            @on-update-image="updateImage"
            @on-delete-image="onDeleteImage"
            @on-post-blog="onPostBlog"
          />
        </div>
      </UModal>
    </template>
  </div>
</template>
