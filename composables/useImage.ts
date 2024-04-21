import { z } from "zod";

const postImageResponseSchema = z.object({
  url: z.string().url(),
  key: z.string(),
});

type PostImageResponse = z.infer<typeof postImageResponseSchema>;

const deleteImageResponseSchema = z.object({
  message: z.string(),
});

type DeleteImageResponse = z.infer<typeof deleteImageResponseSchema>;

export const useImage = () => {
  const imageUrl = ref("");
  const previewImageUrl = ref("");
  const temporaryImageKey = ref("");

  const postImage = async (file: File): Promise<PostImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await useFetch("/api/image", {
      method: "put",
      body: formData,
    });
    const result = postImageResponseSchema.parse(response.data.value);
    return result;
  };

  const deleteImage = async (key: string): Promise<DeleteImageResponse> => {
    const response = await useFetch(`/api/image?key=${key}`, {
      method: "delete",
    });
    const result = deleteImageResponseSchema.parse(response.data.value);
    return result;
  };

  return {
    imageUrl,
    previewImageUrl,
    temporaryImageKey,
    postImage,
    deleteImage,
  };
};

export type UseImage = ReturnType<typeof useImage>;

export const imageInjectionKey: InjectionKey<UseImage> = Symbol("use-image");
