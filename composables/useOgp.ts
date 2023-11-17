export const useOgp = () => {
  const getOgp = async (url: string) => {
    const response = await useFetch(`/api/ogp?url=${url}`);
    return response.data.value;
  };

  return { getOgp };
};

export type UseOgp = ReturnType<typeof useOgp>;

export const ogpInjectionKey: InjectionKey<UseOgp> = Symbol("use-ogp");
