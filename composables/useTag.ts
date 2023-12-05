import { z } from "zod";
import { tagSchema, type Tag } from "@/types/tag";

const getTagsResponseSchema = z.object({ tags: z.array(tagSchema) });

type GetTagsResponse = z.infer<typeof getTagsResponseSchema>;

const postTagResponseSchema = z.object({ tag: tagSchema });

type PostTagResponse = z.infer<typeof postTagResponseSchema>;

export const useTag = () => {
  const runtimeConfig = useRuntimeConfig();
  const d1ApiUrl = runtimeConfig.public.d1ApiUrl;

  const tagState = ref<Tag[]>([]);
  const selectedTags = ref<Tag[]>([]);

  const toggleTag = (tagId: Tag["id"]) => {
    const tag = tagState.value.find((tag) => tag.id === tagId);
    if (!tag) return;
    if (selectedTags.value.some((selectedTag) => selectedTag.id === tagId)) {
      selectedTags.value = selectedTags.value.filter(
        (selectedTag) => selectedTag.id !== tagId
      );
    } else {
      selectedTags.value = [tag, ...selectedTags.value];
    }
  };

  const getTags = async (): Promise<Tag[] | null> => {
    const { data, error } = await useFetch<GetTagsResponse>(`${d1ApiUrl}/tags`);
    if (error.value) {
      console.error(error);
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    }
    if (!data.value?.tags) {
      return null;
    }
    tagState.value = data.value.tags;
    return data.value.tags;
  };

  const postTag = async (name: string): Promise<Tag | null> => {
    const { data, error } = await useFetch<PostTagResponse>(`${d1ApiUrl}/tag`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (error.value) {
      console.error(error);
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return null;
    }
    if (!data.value?.tag) {
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return null;
    }
    tagState.value = [data.value.tag, ...tagState.value];
    return data.value.tag;
  };

  return {
    tagState,
    selectedTags,
    toggleTag,
    getTags,
    postTag,
  };
};

export type UseTag = ReturnType<typeof useTag>;

export const tagInjectionKey: InjectionKey<UseTag> = Symbol("use-tag");
