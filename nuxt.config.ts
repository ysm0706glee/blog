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
    ENVIRONMENT: process.env.NODE_ENV,
    CLOUDFLARE_API_SECRET: process.env.CLOUDFLARE_API_SECRET,
    CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});
