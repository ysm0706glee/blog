import { blogSchema, type Blog } from "@/types/blog";
import type { Tag } from "@/types/tag";
import { z } from "zod";

const getBlogsResponseSchema = z.object({ blogs: z.array(blogSchema) });

type GetBlogsResponse = z.infer<typeof getBlogsResponseSchema>;

const postBlogResponseSchema = z.object({ blog: blogSchema });

type PostBlogResponse = z.infer<typeof postBlogResponseSchema>;

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

  const getBlogsByTags = async (
    tags: Tag[],
    offset: number,
    limit: number
  ): Promise<Blog[] | null> => {
    setIsFetching(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data, error } = await useFetch<GetBlogsResponse>(
      `${d1ApiUrl}/blogs-with-tags?offset=${offset}&limit=${limit}&tags=${tags
        .map((tag) => tag.id)
        .join(",")}`
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

  const getBlogsWithInfiniteScrollByTags = async (tags: Tag[]) => {
    if (!hasMoreData.value) return;
    const blogs = await getBlogsByTags(
      tags,
      offsetState.value,
      limitState.value
    );
    if (!blogs?.length) {
      setHasMoreData(false);
    }
  };

  const postBlogTags = async (
    blogId: number,
    tags: Tag[]
  ): Promise<boolean> => {
    const { data, error } = await useFetch(`${d1ApiUrl}/blog-tags`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        blogId,
        tagIds: tags.map((tag) => tag.id),
      }),
    });
    if (error.value) {
      console.error("Error posting blog tags:", error);
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return false;
    }
    return true;
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

  const postBlog = async (tags: Tag[]): Promise<Blog | null> => {
    const { data, error } = await useFetch<PostBlogResponse>(
      `${d1ApiUrl}/blog`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(blogDataState.value),
      }
    );
    if (error.value) {
      console.error(error);
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return null;
    }
    if (!data.value?.blog) {
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
      return null;
    }
    const newBlog = data.value.blog;
    if (tags.length) {
      const success = await postBlogTags(newBlog.id, tags);
      if (!success) {
        console.error(
          "Failed to post blog tags. Consider rolling back blog insertion."
        );
        createError({
          statusCode: 500,
          statusMessage: "Internal Server Error",
        });
        return null;
      }
    }
    blogsState.value = [newBlog, ...blogsState.value];
    return newBlog;
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
    getBlogsByTags,
    getBlogsWithInfiniteScrollByTags,
    setBlogData,
    postBlog,
  };
};

export type UseBlog = ReturnType<typeof useBlog>;

export const blogInjectionKey: InjectionKey<UseBlog> = Symbol("use-blog");
