import { Blog } from "~/types/blog";
import { Database } from "~/types/supabase";

const useBlog = () => {
  const supabase = useSupabaseClient<Database>();

  const blogsState = ref<Blog[]>([]);
  const offset = ref(0);
  const limit = 10;

  const getBlogs = async (
    offset: number,
    limit: number
  ): Promise<Blog[] | null> => {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .range(offset, offset + limit - 1);
    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value.push(...blogs);
    return blogs;
  };

  const postBlog = async (
    blog: Pick<Blog, "url" | "title" | "description" | "image">
  ): Promise<Blog | null> => {
    const { data: newBlog, error } = await supabase
      .from("blogs")
      .insert({
        url: blog.url,
        title: blog.title,
        description: blog.description,
        image: blog.image,
      })
      .select();
    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value = [newBlog[0], ...blogsState.value];
    return newBlog[0];
  };

  return {
    blogsState,
    offset,
    limit,
    getBlogs,
    postBlog,
  };
};

export default useBlog;
