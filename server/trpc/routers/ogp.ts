import { z } from "zod";
import cheerio from "cheerio";
import { publicProcedure, router } from "../trpc";

export const ogpRouter = router({
  getOgp: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(input.url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const title = $("meta[property='og:title']").attr("content") || "";
        console.log("title: ", title);
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
    }),
});
