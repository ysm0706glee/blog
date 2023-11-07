import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = "blog-develop";

export const useImage = () => {
  const runtimeConfig = useRuntimeConfig();

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${runtimeConfig.public.CLOUDFLARE_API_SECRET}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: runtimeConfig.public.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: runtimeConfig.public.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  });

  const postImage = async (file: File) => {
    const key = `${Date.now()}-${file.name}`;
    await S3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
      })
    );
    const url =
      runtimeConfig.public.NUXT_NODE_ENV === "production"
        ? `https://takumaaa.dev/${key}`
        : `https://pub-cee5b3218211426eb6dfde5132bc4685.r2.dev/${key}`;
    return { url, key };
  };

  const deleteImage = async (key: string) => {
    await S3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  };

  return {
    postImage,
    deleteImage,
  };
};

export type UseImage = ReturnType<typeof useImage>;

export const imageInjectionKey: InjectionKey<UseImage> = Symbol("use-image");
