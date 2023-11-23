<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import type { Tag } from "@/types/tag";

type Props = {
  isOpenAddTagModal: boolean;
};

type Emits = {
  (emit: "update:is-open-add-tag-modal", payload: boolean): void;
  (emit: "toggle-tag", tagId: Tag["id"]): void;
  (emit: "on-post-tag", name: Tag["name"]): Promise<Tag | null>;
};

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string().nonempty("Field is required"),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
});

const fields = {
  name: useField<Tag["name"]>("name"),
};

const { name } = fields;

const onPostBlog = handleSubmit(async ({ name }) => {
  emits("on-post-tag", name);
});

const onClose = () => {
  emits("update:is-open-add-tag-modal", false);
};
</script>

<template>
  <UModal :model-value="isOpenAddTagModal" @update:model-value="onClose">
    <form class="m-4 flex flex-col gap-4" @submit="onPostBlog">
      <div>
        <label for="name">Name</label>
        <UInput id="name" v-model="name.value.value" />
        <span>{{ errors.name }}</span>
      </div>
      <div>
        <UButton @click="onPostBlog">Post</UButton>
      </div>
    </form>
  </UModal>
</template>
