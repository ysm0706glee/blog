<script setup lang="ts">
import { useGtm } from "@gtm-support/vue-gtm";
import type { Tag } from "@/types/tag";

const gtm = useGtm();

const { tagState, selectedTags } = inject(tagInjectionKey)!;

type Emits = {
  (emit: "on-toggle-tag", tagId: Tag["id"]): void;
};

const emits = defineEmits<Emits>();

const isSelected = (tagId: Tag["id"]): boolean =>
  selectedTags.value.some((selectedTag) => selectedTag.id === tagId);

const onToggleTag = (tagId: Tag["id"]) => {
  // Only fire the event if the tag is being added
  const isAddingTag = !isSelected(tagId);
  if (isAddingTag) {
    const tag = tagState.value.find((tag) => tag.id === tagId);
    gtm?.trackEvent({
      event: "tag",
      category: "tag",
      label: `clicked on ${tag?.name}`,
      value: "user clicked on a tag",
    });
  }
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
