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
  modules: ["@nuxt/ui", "nuxt-gtag", "@nuxt/image"],
  ui: {
    icons: ["bxl"],
  },
  runtimeConfig: {
    authKey: process.env.AUTH_KEY,
    public: {
      d1ApiUrl,
    },
  },
  gtag: {
    id: process.env.GTAG_ID,
  },
});
