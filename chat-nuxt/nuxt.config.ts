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
      apiBase: "https://chat-server.udin.web.id",
      websocketHost: "ws://chat-server.udin.web.id/cable",
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
