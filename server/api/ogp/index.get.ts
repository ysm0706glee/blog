import cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  try {
    const { url } = getQuery(event);
    if (!url) {
      throw createError({
        status: 400,
        message: "url is required",
      });
    }
    if (typeof url !== "string") {
      throw createError({
        status: 400,
        message: "url must be a string",
      });
    }
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
});
