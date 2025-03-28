// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@vueuse/nuxt"],
  ssr: false,
  devtools: {
    enabled: true,
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:3000",
      websocketHost: process.env.WEBSOCKET_HOST || "ws://localhost:3000/cable",
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-11-27",
  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: "double",
        commaDangle: "always-multiline",
        jsx: false,
        braceStyle: "1tbs",
      },
    },
  },
});
