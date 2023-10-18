<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { Tag } from "~/types/tag";

type Props = {
  isOpenAddTagModal: boolean;
};

type Emits = {
  (emit: "update:is-open-add-tag-modal", payload: boolean): void;
  (emit: "toggle-tag", tagId: Tag["id"]): void;
};

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

// TODO: ! is not safe
const { tagState, getTags, postTag } = inject(tagInjectionKey)!;

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

const onPost = handleSubmit(async ({ name }) => {
  const response = await postTag(name);
  if (response) {
    useNuxtApp().$toast.success("success");
    console.log(tagState);
    await getTags();
    console.log("LOOK: ", tagState);
    onToggleTag(response.id);
  } else {
    useNuxtApp().$toast.error("error");
  }
});

const onClose = () => {
  emits("update:is-open-add-tag-modal", false);
};

const onToggleTag = (tagId: Tag["id"]) => {
  emits("toggle-tag", tagId);
};
</script>

<template>
  <UModal :model-value="isOpenAddTagModal" @update:model-value="onClose">
    <form @submit="onPost">
      <div>
        <label for="name">Name</label>
        <UInput id="name" v-model="name.value.value" />
        <span>{{ errors.name }}</span>
      </div>
      <UButton @click="onPost">Post</UButton>
    </form>
  </UModal>
</template>
