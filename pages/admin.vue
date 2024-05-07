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
  blogsState,
  blogDataState,
  offsetState,
  limitState,
  getBlogs,
  setBlogData,
  postBlog,
  deleteBlog,
} = _useBlog;

const { previewImageUrl, temporaryImageKey, postImage, deleteImage } =
  _useImage;

const isGetOgpLoading = ref(false);
const isPostBlogLoading = ref(false);

const onGetOgp = async (url: Blog["url"]) => {
  try {
    isGetOgpLoading.value = true;
    const ogp = await getOgp(url);
    if (ogp.image !== "") {
      previewImageUrl.value = ogp.image;
    }
    setBlogData(url, ogp);
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  } finally {
    isGetOgpLoading.value = false;
  }
};

const onUpdateImage = async (file: File) => {
  try {
    previewImageUrl.value = URL.createObjectURL(file);
    const response = await postImage(file);
    blogDataState.value = {
      ...blogDataState.value,
      image: response.url,
    };
    temporaryImageKey.value = response.key;
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  }
};

const onDeleteImage = async () => {
  try {
    await deleteImage(temporaryImageKey.value);
    previewImageUrl.value = "";
    blogDataState.value = {
      ...blogDataState.value,
      image: "",
    };
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
    isPostBlogLoading.value = true;
    setBlogData(blog.url, {
      title: blog.title,
      description: blog.description,
      image: blog.image,
    });
    await postBlog();
    useNuxtApp().$toast.success("success");
    // get new blogs after posting
    offsetState.value = 0;
    blogsState.value = [];
    await getBlogs(offsetState.value, limitState.value);
  } catch (error) {
    console.error(error);
    useNuxtApp().$toast.error("error");
  } finally {
    isPostBlogLoading.value = false;
  }
};

const onDeleteBlog = async (blogId: Blog["id"]) => {
  try {
    await deleteBlog(blogId);
    useNuxtApp().$toast.success("success");
    // get new blogs after delete
    offsetState.value = 0;
    blogsState.value = [];
    await getBlogs(offsetState.value, limitState.value);
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
    :is-get-ogp-loading="isGetOgpLoading"
    :is-post-blog-loading="isPostBlogLoading"
    @on-get-ogp="onGetOgp"
    @on-update-image="onUpdateImage"
    @on-delete-image="onDeleteImage"
    @on-post-blog="onPostBlog"
    @on-delete-blog="onDeleteBlog"
  />
</template>
