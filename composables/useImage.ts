import { z } from "zod";

const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

const WORKER_NAME =
  process.env.NODE_ENV === "production"
    ? WORKER_NAME_PRODUCTION
    : WORKER_NAME_DEVELOP;

const postImageResponseSchema = z.object({
  url: z.string().url(),
});

const deleteImageResponseSchema = z.object({
  status: z.string(),
});

export const useImage = () => {
  const authKey = useRuntimeConfig().public.AUTH_KEY;

  const imageUrl = ref("");
  const previewImageUrl = ref("");
  const temporaryImageKey = ref("");

  const postImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const key = `${Date.now()}-${file.name}`;
    const response = await useFetch(
      `https://${WORKER_NAME}.ysm0706glee.workers.dev/api/images/${key}`,
      {
        method: "put",
        headers: {
          auth_key: authKey,
        },
        body: formData,
      }
    );
    const result = postImageResponseSchema.parse(response.data.value);
    return { url: result.url, key };
  };

  const deleteImage = async (key: string) => {
    const response = await useFetch(
      `https://${WORKER_NAME}.ysm0706glee.workers.dev/api/images/${key}`,
      {
        method: "delete",
        headers: {
          auth_key: authKey,
        },
      }
    );
    deleteImageResponseSchema.parse(response.data.value);
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
