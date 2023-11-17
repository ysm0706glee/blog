const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

export default defineEventHandler(async (event) => {
  const WORKER_NAME =
    process.env.NITRO_ENVIRONMENT === "production"
      ? WORKER_NAME_PRODUCTION
      : WORKER_NAME_DEVELOP;
  // TODO: type
  const { key } = getQuery(event);
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: "Key Not Found",
    });
  }
  await fetch(`https://${WORKER_NAME}.ysm0706glee.workers.dev/${key}`, {
    method: "delete",
    headers: {
      // TODO: type
      "X-Custom-Auth-Key": process.env.X_CUSTOM_AUTH_KEY!,
    },
  });
  return {
    message: "success",
  };
});
