<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import type { Blog } from "@/types/blog";

const { getOgp } = inject(ogpInjectionKey)!;

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
  const ogp = await getOgp(url);
  if (!ogp) {
    useNuxtApp().$toast.error("error");
    return;
  }
  emits("after-getting-ogp");
  emits("set-blog-data", url, ogp);
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
  <form
    class="flex justify-center items-center gap-4"
    @submit.prevent="onGetOgp"
  >
    <div>
      <UInput v-model="url" placeholder="A blog url" />
      <span>{{ errors.url }}</span>
    </div>
    <UButton type="submit">Get OGP</UButton>
  </form>
</template>
