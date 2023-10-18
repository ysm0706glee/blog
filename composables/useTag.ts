import { Tag } from "~/types/tag";
import { Database } from "~/types/supabase";

export const useTag = () => {
  const supabase = useSupabaseClient<Database>();

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
    const { data: tags, error } = await supabase.from("tags").select("*");
    if (error) {
      console.error(error);
      return null;
    }
    tagState.value = tags;
    return tags;
  };

  const postTag = async (name: string): Promise<Tag | null> => {
    const { data: tag, error } = await supabase
      .from("tags")
      .insert({ name })
      .select();
    if (error) {
      console.error(error);
      return null;
    }
    tagState.value = [tag[0], ...tagState.value];
    return tag[0];
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
