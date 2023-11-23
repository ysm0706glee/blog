<script setup lang="ts">
import type { Tag } from "@/types/tag";

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
  <div class="flex flex-wrap">
    <UBadge
      v-for="tag in tagState"
      class="cursor-pointer py-1 px-3 rounded-full text-sm mr-2 mb-2"
      :key="tag.id"
      :label="tag.name"
      :color="
        selectedTags.some((selectedTag) => selectedTag.id === tag.id)
          ? 'primary'
          : 'gray'
      "
      @click="onToggleTag(tag.id)"
    />
  </div>
</template>
