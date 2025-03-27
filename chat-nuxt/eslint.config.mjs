// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    rules: {
      "object-curly-spacing": [
        "error", "always",
      ],
      "eol-last": [
        "error", "always",
      ],
      "no-trailing-spaces": ["error"],
      "require-await": ["error"],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "never",
            component: "always",
          },
          svg: "never",
          math: "never",
        },
      ],
      "@stylistic/quotes": [
        "warn", "double", { avoidEscape: true },
      ],
    },
  });
