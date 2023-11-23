export const useImage = () => {
  const imageUrl = ref("");
  const previewImageUrl = ref("");
  const temporaryImageKey = ref("");

  const postImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await useFetch("/api/image", {
      method: "put",
      body: formData,
    });
    return response.data.value;
  };

  const deleteImage = async (key: string) => {
    const response = await useFetch(`/api/image?key=${key}`, {
      method: "delete",
    });
    return response.data.value;
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
