<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import type { Blog } from "@/types/blog";

const { $client } = useNuxtApp();

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
  const ogp = await $client.ogpRouter.getOgp.useQuery({
    url,
  });
  if (!ogp.data.value) {
    useNuxtApp().$toast.error("error");
    return;
  }
  emits("after-getting-ogp");
  emits("set-blog-data", url, ogp.data.value);
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
  <form @submit.prevent="onGetOgp">
    <div>
      <label for="url">A blog url</label>
      <UInput id="url" v-model="url" name="url" />
      <!-- TODO:  -->
      <span>{{ errors.url }}</span>
    </div>
    <UButton type="submit">Get OGP</UButton>
  </form>
</template>
