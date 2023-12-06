import { z } from "zod";

const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

const responseSchema = z.object({
  url: z.string().url(),
});

type Response = z.infer<typeof responseSchema>;

export default defineEventHandler(async (event) => {
  const WORKER_NAME =
    process.env.NODE_ENV === "production"
      ? WORKER_NAME_PRODUCTION
      : WORKER_NAME_DEVELOP;
  const authKey = useRuntimeConfig(event).authKey;
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }
  const key = `${Date.now()}-${files[0].filename}`;
  const response = await fetch(
    `https://${WORKER_NAME}.ysm0706glee.workers.dev/${key}`,
    {
      method: "put",
      headers: {
        "X-Custom-Auth-Key": authKey,
      },
      body: files[0].data,
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data: Response = await response.json();
    const url = data.url;
    return {
      url,
      key,
    };
  } catch (error) {
    console.error("Error reading response: ", error);
  }
});
