// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],
  devtools: {
    enabled: true
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      }
    }
  },
  routeRules: {
    "/chats": {ssr: false},
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:3000",
    },
  },
  css: ["~/assets/css/main.css"],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-11-27",
});
