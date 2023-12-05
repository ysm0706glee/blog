const API_URL = {
  d1: {
    development: "https://blog-development-d1.ysm0706glee.workers.dev/api",
    production: "https://blog-production-d1.ysm0706glee.workers.dev/api",
  },
} as const;

const d1ApiUrl =
  process.env.NODE_ENV === "production"
    ? API_URL.d1.production
    : API_URL.d1.development;

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxt/ui"],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  ui: {
    icons: ["bxl"],
  },
  runtimeConfig: {
    xCustomAuthKey: process.env.X_CUSTOM_AUTH_KEY,
    public: {
      d1ApiUrl,
    },
  },
});
