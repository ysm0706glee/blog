<script setup lang="ts">
const _useBlog = useBlog();

const _useTag = useTag();

provide(blogInjectionKey, _useBlog);

provide(tagInjectionKey, _useTag);

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
