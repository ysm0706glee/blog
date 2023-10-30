import { Database } from "~/types/supabase";
import { Blog } from "~/types/blog";
import { Tag } from "~/types/tag";

export const useBlog = () => {
  const supabase = useSupabaseClient<Database>();

  const blogsState = ref<Blog[]>([]);
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
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .range(offset, offset + limit - 1);
    offsetState.value += limitState.value;
    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value.push(...data);
    setIsFetching(false);
    return data;
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
    const { data, error } = await supabase
      .from("blogs")
      .select(` *, tags!inner (*)`)
      .in(
        "tags.id",
        tags.map((tag) => tag.id)
      )
      .range(offset, offset + limit - 1);
    offsetState.value += limitState.value;
    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value.push(...data);
    setIsFetching(false);
    return data;
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
    const { error } = await supabase.from("blog_tags").insert(
      tags.map((tag) => ({
        blog_id: blogId,
        tag_id: tag.id,
      }))
    );
    if (error) {
      console.error("Error posting blog tags:", error);
      return false;
    }
    return true;
  };

  const postBlog = async (
    blog: Pick<Blog, "url" | "title" | "description" | "image">,
    tags: Tag[]
  ): Promise<Blog | null> => {
    const { data, error } = await supabase.from("blogs").insert(blog).select();
    if (error) {
      console.error("Error posting blog:", error);
      return null;
    }
    const newBlog = data[0];
    if (tags.length) {
      const success = await postBlogTags(newBlog.id, tags);
      if (!success) {
        console.error(
          "Failed to post blog tags. Consider rolling back blog insertion."
        );
        return null;
      }
    }
    blogsState.value = [newBlog, ...blogsState.value];
    return newBlog;
  };

  return {
    blogsState,
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
    postBlog,
  };
};

export type UseBlog = ReturnType<typeof useBlog>;

export const blogInjectionKey: InjectionKey<UseBlog> = Symbol("use-blog");
