import { z } from "zod";

const getOgpResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

type GetOgpResponse = z.infer<typeof getOgpResponseSchema>;

export const useOgp = () => {
  const getOgp = async (url: string): Promise<GetOgpResponse> => {
    const response = await useFetch(`/api/ogp?url=${url}`);
    const result = getOgpResponseSchema.parse(response.data.value);
    return result;
  };

  return { getOgp };
};

export type UseOgp = ReturnType<typeof useOgp>;

export const ogpInjectionKey: InjectionKey<UseOgp> = Symbol("use-ogp");
