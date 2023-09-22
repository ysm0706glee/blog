import { Blog } from "~/types/blog";

const useBlog = () => {
  const supabase = useSupabaseClient();

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

  return {
    blogsState,
    getBlogs,
  };
};

export default useBlog;
