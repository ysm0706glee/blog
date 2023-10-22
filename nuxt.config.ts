declare var SUPABASE_URL: string | undefined;
declare var SUPABASE_KEY: string | undefined;

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxt/ui"],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL ?? SUPABASE_URL,
    key: process.env.SUPABASE_KEY ?? SUPABASE_KEY,
  },
  build: {
    transpile: ["trpc-nuxt"],
  },
});
