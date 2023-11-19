const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

export default defineEventHandler(async (event) => {
  const xCustomAuthKey = useRuntimeConfig(event).xCustomAuthKey;
  const WORKER_NAME =
    process.env.NODE_ENV === "production"
      ? WORKER_NAME_PRODUCTION
      : WORKER_NAME_DEVELOP;
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
        "X-Custom-Auth-Key": xCustomAuthKey,
      },
      body: files[0].data,
    }
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}` + process.env.NODE_ENV
    );
  }
  try {
    const data = await response.json();
    const fileUrl = data.url;
    return {
      url: fileUrl,
      key,
    };
  } catch (error) {
    console.error("Error reading response: ", error);
  }
});
