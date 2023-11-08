declare var SUPABASE_URL: string | undefined;
declare var SUPABASE_KEY: string | undefined;
declare var ENVIRONMENT: string | undefined;
declare var CLOUDFLARE_API_SECRET: string | undefined;
declare var CLOUDFLARE_ACCESS_KEY_ID: string | undefined;
declare var CLOUDFLARE_SECRET_ACCESS_KEY: string | undefined;

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxt/ui"],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL ?? SUPABASE_URL,
    key: process.env.SUPABASE_KEY ?? SUPABASE_KEY,
  },
  ui: {
    icons: ["bxl"],
  },
  build: {
    transpile: ["trpc-nuxt"],
  },
  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.NODE_ENV ?? ENVIRONMENT,
      CLOUDFLARE_API_SECRET:
        process.env.CLOUDFLARE_API_SECRET ?? CLOUDFLARE_API_SECRET,
      CLOUDFLARE_ACCESS_KEY_ID:
        process.env.CLOUDFLARE_ACCESS_KEY_ID ?? CLOUDFLARE_ACCESS_KEY_ID,
      CLOUDFLARE_SECRET_ACCESS_KEY:
        process.env.CLOUDFLARE_SECRET_ACCESS_KEY ??
        CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  },
});
