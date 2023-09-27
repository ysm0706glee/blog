import cheerio from "cheerio";
import { Blog } from "~/types/blog";

export default defineEventHandler(
  async (event): Promise<Pick<Blog, "title" | "description" | "image">> => {
    try {
      const { url } = await readBody(event);
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const title = $("meta[property='og:title']").attr("content") || "";
      const image = $("meta[property='og:image']").attr("content") || "";
      const description =
        $("meta[property='og:description']").attr("content") || "";
      return {
        title,
        image,
        description,
      };
    } catch (e) {
      console.error(e);
      return {
        title: "",
        image: "",
        description: "",
      };
    }
  }
);
