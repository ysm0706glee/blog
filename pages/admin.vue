<script setup lang="ts">
const _useBlog = useBlog();

const _useTag = useTag();

const _useImage = useImage();

provide(blogInjectionKey, _useBlog);

provide(tagInjectionKey, _useTag);

provide(imageInjectionKey, _useImage);

const { getTags } = _useTag;

try {
  await getTags();
} catch (error) {
  console.error(error);
  useNuxtApp().$toast.error("error");
}
</script>

<template>
  <TAdmin />
</template>
