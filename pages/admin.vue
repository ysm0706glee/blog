<script setup lang="ts">
import type { Blog } from "@/types/blog";
import type { Tag } from "@/types/tag";

const _useBlog = useBlog();

const _useTag = useTag();

const _useOgp = useOgp();

const _useImage = useImage();

provide(ogpInjectionKey, _useOgp);

provide(blogInjectionKey, _useBlog);

provide(imageInjectionKey, _useImage);

provide(tagInjectionKey, _useTag);

const { getOgp } = _useOgp;

const { setBlogData, postBlog } = _useBlog;

const { imageUrl, previewImageUrl, temporaryImageKey, postImage, deleteImage } =
  _useImage;

const { getTags, postTag, toggleTag } = _useTag;

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

const onPostTag = async (name: Tag["name"]) => {
  const response = await postTag(name);
  if (response) {
    useNuxtApp().$toast.success("success");
    await getTags();
    toggleTag(response.id);
  } else {
    useNuxtApp().$toast.error("error");
  }
};

const onPostBlog = async (
  blog: Pick<Blog, "url" | "title" | "description" | "image">,
  tags: Tag[]
) => {
  setBlogData(blog.url, {
    title: blog.title,
    description: blog.description,
    image: blog.image,
  });
  const response = await postBlog(tags);
  response
    ? useNuxtApp().$toast.success("success")
    : useNuxtApp().$toast.error("error");
};

try {
  await getTags();
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
    @on-post-tag="onPostTag"
    @on-post-blog="onPostBlog"
  />
</template>
