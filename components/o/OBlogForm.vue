<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { Blog } from "@/types/blog";

// TODO: ! is not safe
const { blogDataState } = inject(blogInjectionKey)!;

// TODO: ! is not safe
const { previewImageUrl } = inject(imageInjectionKey)!;

type Emits = {
  (emit: "on-get-ogp", url: Blog["url"]): Promise<Blog | null>;
  (emit: "on-update-image", file: File): void;
  (emit: "on-delete-image"): Promise<void>;
  (
    emit: "on-post-blog",
    blog: Pick<Blog, "url" | "title" | "description" | "image">
  ): Promise<Blog | null>;
};

const emits = defineEmits<Emits>();

const validationSchema = toTypedSchema(
  z.object({
    url: z
      .string()
      .min(1, "Field is required")
      .url({ message: "Must be a valid url" }),
    title: z.string().min(1, "Field is required"),
    description: z.string().min(1, "Field is required"),
    image: z.string().min(1, "Field is required"),
  })
);

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: validationSchema,
});

const fields = {
  url: useField<Blog["url"]>("url"),
  title: useField<Blog["title"]>("title"),
  description: useField<Blog["description"]>("description"),
  image: useField<Blog["image"]>("image"),
};

const { url, title, description, image } = fields;

const onGetOgp = async () => {
  emits("on-get-ogp", url.value.value);
};

const onUpdateImage = async (event: Event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    const files = target.files;
    if (files) {
      const file = files?.[0];
      emits("on-update-image", file);
    } else {
      console.error("Files is null");
    }
  } else {
    console.error("Event target is not an HTMLInputElement");
  }
};

const onDeleteImage = async () => {
  image.value.value = "";
  emits("on-delete-image");
};

const onPostBlog = handleSubmit(async ({ url, title, description, image }) => {
  emits("on-post-blog", { url, title, description, image });
});

watch(blogDataState, (newState) => {
  setFieldValue("url", newState.url);
  setFieldValue("title", newState.title);
  setFieldValue("description", newState.description);
  setFieldValue("image", newState.image);
});
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onPostBlog">
    <div>
      <UInput v-model="url.value.value" placeholder="blog url" />
      <span class="block min-h-[2rem]">{{ errors.url }}</span>
    </div>
    <UButton @click="onGetOgp">Get the blog data by the blog url</UButton>
    <div>
      <label for="title">Title(Required)</label>
      <UInput id="title" v-model="title.value.value" />
      <span class="block min-h-[2rem]">{{ errors.title }}</span>
    </div>
    <div>
      <label for="description">Description(Required)</label>
      <UTextarea id="description" v-model="description.value.value" />
      <span class="block min-h-[2rem]">{{ errors.description }}</span>
    </div>
    <div>
      <label for="image">Image</label>
      <UInput type="file" @change="onUpdateImage" />
      <span class="block min-h-[2rem]">{{ errors.image }}</span>
      <div class="relative w-60 h-60">
        <template v-if="previewImageUrl">
          <NuxtImg
            class="w-full h-full object-cover rounded"
            :src="previewImageUrl"
            alt="image-url"
          />
          <UButton
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            class="absolute top-0 right-0"
            @click="onDeleteImage"
          />
        </template>
      </div>
    </div>
    <div>
      <UButton @click="onPostBlog">Post</UButton>
    </div>
  </form>
</template>
