<script setup lang="ts">
import { useImage } from "@/composables/useImage";
import type { Blog } from "@/types/blog";

const _useBlog = useBlog();

const _useOgp = useOgp();

const _useImage = useImage();

provide(ogpInjectionKey, _useOgp);

provide(blogInjectionKey, _useBlog);

provide(imageInjectionKey, _useImage);

const { getOgp } = _useOgp;

const {
  offsetState,
  limitState,
  getBlogs,
  setBlogData,
  postBlog,
  deleteBlog,
  getBlogsWithInfiniteScroll,
} = _useBlog;

const { imageUrl, previewImageUrl, temporaryImageKey, postImage, deleteImage } =
  _useImage;

const isAfterGettingOgp = ref(false);

const onGetOgp = async (url: Blog["url"]) => {
  if (!url.length) isAfterGettingOgp.value = false;
  const ogp = await getOgp(url);
  if (!ogp) {
    useNuxtApp().$toast.error("error");
    return;
  }
  if (ogp.image) {
    previewImageUrl.value = ogp.image;
  }
  setBlogData(url, ogp);
  isAfterGettingOgp.value = true;
};

const updateImage = async (file: File) => {
  try {
    const response = await postImage(file);
    if (!response) {
      previewImageUrl.value = "";
      throw createError("failed to upload image");
    }
    imageUrl.value = response.url;
    temporaryImageKey.value = response.key;
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onDeleteImage = async () => {
  try {
    const response = await deleteImage(temporaryImageKey.value);
    if (!response) {
      throw createError("failed to delete image");
    }
    previewImageUrl.value = "";
    temporaryImageKey.value = "";
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onPostBlog = async (
  blog: Pick<Blog, "url" | "title" | "description" | "image">
) => {
  setBlogData(blog.url, {
    title: blog.title,
    description: blog.description,
    image: blog.image,
  });
  const response = await postBlog();
  response
    ? useNuxtApp().$toast.success("success")
    : useNuxtApp().$toast.error("error");
};

const onDeleteBlog = async (blogId: Blog["id"]) => {
  console.log(blogId);
  await deleteBlog(blogId);
  await getBlogsWithInfiniteScroll();
};

try {
  await getBlogs(offsetState.value, limitState.value);
} catch (error) {
  console.error(error);
  useNuxtApp().$toast.error("error");
}
</script>

<template>
  <TAdmin
    :is-after-getting-ogp="isAfterGettingOgp"
    @on-get-ogp="onGetOgp"
    @update-image="updateImage"
    @on-delete-image="onDeleteImage"
    @on-post-blog="onPostBlog"
    @on-delete-blog="onDeleteBlog"
  />
</template>
