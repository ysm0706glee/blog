const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

export default defineEventHandler(async (event) => {
  const WORKER_NAME =
    process.env.NITRO_ENVIRONMENT === "production"
      ? WORKER_NAME_PRODUCTION
      : WORKER_NAME_DEVELOP;
  const xCustomAuthKey = useRuntimeConfig(event).xCustomAuthKey;
  const { key }: { key: string } = getQuery(event);
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: "Key Not Found",
    });
  }
  const response = await fetch(
    `https://${WORKER_NAME}.ysm0706glee.workers.dev/${key}`,
    {
      method: "delete",
      headers: {
        "X-Custom-Auth-Key": xCustomAuthKey,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data = await response.text();
    return {
      message: data,
    };
  } catch (error) {
    console.error("Error reading response: ", error);
  }
});
