<script setup lang="ts">
const _useTag = useTag();

provide(tagInjectionKey, _useTag);
</script>

<template>
  <TAdmin />
</template>
