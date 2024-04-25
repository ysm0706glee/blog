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

const onGetOgp = async (url: Blog["url"]) => {
  try {
    const ogp = await getOgp(url);
    if (ogp.image !== "") {
      previewImageUrl.value = ogp.image;
    }
    setBlogData(url, ogp);
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onUpdateImage = async (file: File) => {
  try {
    previewImageUrl.value = URL.createObjectURL(file);
    const response = await postImage(file);
    imageUrl.value = response.url;
    temporaryImageKey.value = response.key;
  } catch (error) {
    previewImageUrl.value = "";
    imageUrl.value = "";
    temporaryImageKey.value = "";
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onDeleteImage = async () => {
  try {
    await deleteImage(temporaryImageKey.value);
    previewImageUrl.value = "";
    imageUrl.value = "";
    temporaryImageKey.value = "";
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onPostBlog = async (
  blog: Pick<Blog, "url" | "title" | "description" | "image">
) => {
  try {
    setBlogData(blog.url, {
      title: blog.title,
      description: blog.description,
      image: blog.image,
    });
    await postBlog();
    useNuxtApp().$toast.success("success");
    // TODO: close modal
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onDeleteBlog = async (blogId: Blog["id"]) => {
  try {
    await deleteBlog(blogId);
    // TODO: Implement infinite scroll
    await getBlogsWithInfiniteScroll();
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
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
    @on-get-ogp="onGetOgp"
    @on-update-image="onUpdateImage"
    @on-delete-image="onDeleteImage"
    @on-post-blog="onPostBlog"
    @on-delete-blog="onDeleteBlog"
  />
</template>
