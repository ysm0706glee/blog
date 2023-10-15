<script setup lang="ts">
import { Tag } from "~/types/tag";

const { tagState, selectedTags } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "on-toggle-tag", tagId: Tag["id"]): void;
};

const emits = defineEmits<Emits>();

const onToggleTag = (tagId: Tag["id"]) => {
  emits("on-toggle-tag", tagId);
};
</script>

<template>
  <UBadge
    v-for="tag in tagState"
    :key="tag.id"
    :label="tag.name"
    :color="
      selectedTags.some((selectedTag) => selectedTag.id === tag.id)
        ? 'primary'
        : 'gray'
    "
    class="cursor-pointer"
    @click="onToggleTag(tag.id)"
  />
</template>
