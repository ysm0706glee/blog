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
    test: process.env.NITRO_X_CUSTOM_AUTH_KEY,
  },
});
