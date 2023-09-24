import { Blog } from "~/types/blog";
import { Database } from "~/types/supabase";

const useBlog = () => {
  const supabase = useSupabaseClient<Database>();

  const blogsState = useState<Blog[]>("blogsState", () => []);

  const getBlogs = async (): Promise<Blog[] | null> => {
    const { data: blogs, error } = await supabase.from("blogs").select("*");
    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value = blogs;
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

    console.log("newBlog: ", newBlog);

    if (error) {
      console.error(error);
      return null;
    }
    blogsState.value = [newBlog[0], ...blogsState.value];
    return newBlog[0];
  };

  return {
    blogsState,
    getBlogs,
    postBlog,
  };
};

export default useBlog;
