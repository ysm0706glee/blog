import { blogSchema, type Blog } from "@/types/blog";
import { z } from "zod";

const getBlogsResponseSchema = z.object({ blogs: z.array(blogSchema) });

type GetBlogsResponse = z.infer<typeof getBlogsResponseSchema>;

const postBlogResponseSchema = z.object({ status: z.string() });

type PostBlogResponse = z.infer<typeof postBlogResponseSchema>;

const deleteBlogResponseSchema = z.object({ status: z.string() });

export const useBlog = () => {
  const runtimeConfig = useRuntimeConfig();
  const d1ApiUrl = runtimeConfig.public.d1ApiUrl;

  const blogsState = ref<Blog[]>([]);
  const blogDataState = ref<
    Pick<Blog, "url" | "title" | "description" | "image">
  >({
    url: "",
    title: "",
    description: "",
    image: "",
  });
  const offsetState = ref(0);
  const limitState = ref(10);
  const isFetching = ref(false);
  const hasMoreData = ref(true);

  const setIsFetching = (value: boolean) => {
    isFetching.value = value;
  };

  const setHasMoreData = (value: boolean) => {
    hasMoreData.value = value;
  };

  const getBlogs = async (
    offset: number,
    limit: number
  ): Promise<Blog[] | null> => {
    setIsFetching(true);
    const { data, error } = await useFetch<GetBlogsResponse>(
      `${d1ApiUrl}/blogs?offset=${offset}&limit=${limit}`
    );
    setIsFetching(false);
    if (error.value) {
      console.error(error);
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return null;
    }
    if (!data.value?.blogs) {
      return null;
    }
    blogsState.value.push(...data.value.blogs);
    offsetState.value += limitState.value;
    return data.value.blogs;
  };

  const getBlogsWithInfiniteScroll = async () => {
    if (!hasMoreData.value) return;
    const blogs = await getBlogs(offsetState.value, limitState.value);
    if (!blogs?.length) {
      setHasMoreData(false);
    }
  };
  const setBlogData = (
    url: Blog["url"],
    blog: Pick<Blog, "title" | "description" | "image">
  ) => {
    blogDataState.value = {
      url,
      ...blog,
    };
  };

  const postBlog = async () => {
    const response = await useFetch<PostBlogResponse>(`${d1ApiUrl}/blogs`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: blogDataState.value,
    });
    postBlogResponseSchema.parse(response.data.value);
  };

  const deleteBlog = async (blogId: Blog["id"]) => {
    const response = await useFetch(`${d1ApiUrl}/blogs/${blogId}`, {
      method: "delete",
    });
    deleteBlogResponseSchema.parse(response.data.value);
  };

  return {
    blogsState,
    blogDataState,
    offsetState,
    limitState,
    isFetching,
    hasMoreData,
    setIsFetching,
    setHasMoreData,
    getBlogs,
    getBlogsWithInfiniteScroll,
    setBlogData,
    postBlog,
    deleteBlog,
  };
};

export type UseBlog = ReturnType<typeof useBlog>;

export const blogInjectionKey: InjectionKey<UseBlog> = Symbol("use-blog");
