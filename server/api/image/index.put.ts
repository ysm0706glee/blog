const WORKER_NAME_DEVELOP = "blog-development-r2";
const WORKER_NAME_PRODUCTION = "blog-production-r2";

export default defineEventHandler(async (event) => {
  const test1 = useRuntimeConfig(event);
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
  await fetch(`https://${WORKER_NAME}.ysm0706glee.workers.dev/${key}`, {
    method: "put",
    headers: {
      // TODO: type
      "X-Custom-Auth-Key": xCustomAuthKey,
    },
    body: files[0].data,
  });
  // TODO: api
  const url =
    process.env.NODE_ENV === "production"
      ? `https://takumaaa.dev/${key}`
      : `https://pub-d3708211c39144ae993289f07732706f.r2.dev/${key}`;

  return {
    url,
    key,
    test1,
    test2: xCustomAuthKey,
  };
});
