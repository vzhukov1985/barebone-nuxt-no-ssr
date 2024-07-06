// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { readdirSync } from "fs";
import { config } from "dotenv";
import type { ObjectStringKeyAnyValue } from "./runtime/types";
import { devProxy } from "./devProxy";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

const isProd = process.env.NODE_ENV === "production";
config({
  path: `../../.env${isProd ? ".production" : ""}`,
});

const { BASENAME, TYPE_CHECK, REST_API_URL } = process.env;

let SUPPORT_LOCALES: string[] = [];
if (BASENAME) {
  try {
    SUPPORT_LOCALES = readdirSync(`../${BASENAME}/locales`)
      .filter((f) => f.includes(".json"))
      .map((file) => file.replace(".json", ""));
  } catch (e) {
    console.log(e);
  }
}

const script: ObjectStringKeyAnyValue[] = [];
const link: ObjectStringKeyAnyValue[] = [];
const noscript: ObjectStringKeyAnyValue[] = [];

export default defineNuxtConfig({
  app: {
    head: {
      script,
      noscript,
      link,
    },
  },
  alias: {
    "#runtime": fileURLToPath(new URL("./runtime", import.meta.url)),
  },
  ssr: false,
  telemetry: false,
  typescript: {
    shim: false,
    strict: true,
    typeCheck: !!TYPE_CHECK,
  },
  runtimeConfig: {
    public: {
      isProd,
      BASENAME,
      SUPPORT_LOCALES,
      REST_API_URL,
    },
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    plugins: [
      VueI18nVitePlugin({
        fullInstall: false,
        include: [
          resolve(
            dirname(fileURLToPath(import.meta.url)),
            "./runtime/locales/*.json",
          ),
          resolve(
            dirname(fileURLToPath(import.meta.url)),
            `../${BASENAME}/locales/*.json`,
          ),
        ],
      }),
    ],
  },
  nitro: {
    devProxy,
  },
  experimental: {
    // typedPages: true,
  },
  modules: ["@nuxt/eslint"],
});
