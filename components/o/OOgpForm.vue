<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { Blog } from "~/types/blog";

type Emits = {
  (emit: "after-getting-ogp"): void;
  (
    emit: "set-blog-data",
    url: Blog["url"],
    blog: Pick<Blog, "title" | "description" | "image">
  ): void;
};

const emits = defineEmits<Emits>();

const validationSchema = toTypedSchema(
  zod.object({
    url: zod
      .string()
      .nonempty("Field is required")
      .url({ message: "Must be a valid url" }),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: url } = useField<string>("url");

const onGetOgp = handleSubmit(async ({ url }) => {
  if (!url.length) return;
  const response = await $fetch("/api/ogp", {
    method: "POST",
    body: { url },
  });
  emits("after-getting-ogp");
  emits("set-blog-data", url, response);
});

watch(url, (newUrl) => {
  if (!newUrl.length) {
    emits("set-blog-data", newUrl, {
      title: "",
      description: "",
      image: "",
    });
  }
});
</script>

<template>
  <form @submit="onGetOgp">
    <div>
      <label for="url">A blog url</label>
      <UInput id="url" v-model="url" name="url" />
      <!-- TODO:  -->
      <span>{{ errors.url }}</span>
    </div>
    <UButton type="submit">Get OGP</UButton>
  </form>
</template>
