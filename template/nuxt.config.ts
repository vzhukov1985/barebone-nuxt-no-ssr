// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { config } from "dotenv";
import { fileURLToPath } from "url";

const isProd = process.env.NODE_ENV === "production";
config({ path: `../.env${isProd ? ".production" : ""}` });

export default defineNuxtConfig({
  extends: ["../common"],
  modules: ["@nuxtjs/tailwindcss", "@barebone/common"],

  runtimeConfig: {
    public: {
      locales: ["ru", "en"],
      defaultPageLimit: 10,
    },
  },

  css: [],
  app: {
    head: {
      title: "Barebone Template",
      meta: [
        {
          name: "description",
          content: "Barebone description",
        },
      ],
    },
  },

  tailwindcss: { viewer: false },

  typescript: {
    shim: false,
    strict: true,
  },

  // ssr: false,
  telemetry: false,

  alias: {
    "#runtime": fileURLToPath(new URL("../common/runtime", import.meta.url)),
  },

  compatibilityDate: "2024-07-06",
});
