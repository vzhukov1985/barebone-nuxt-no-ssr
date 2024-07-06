import withNuxt from "./common/.nuxt/eslint.config.mjs";
import unusedImports from "eslint-plugin-unused-imports";
import parser from "vue-eslint-parser";
import ts from "@typescript-eslint/eslint-plugin";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt(
  {
    languageOptions: {
      ecmaVersion: "latest",
      parser,
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.vue"],
    plugins: {
      ts,
      "@typescript-eslint": ts,
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "vue/no-setup-props-destructure": "off",
      "vue/no-v-html": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-multiple-template-root": "off",
      "vue/return-in-computed-property": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "**/.nuxt/**",
      "**/.output/**",
      "**/dist/**",
      "**/public/**",
      "**/node_modules/**",
      "*.local",
      ".history/**",
      "cli/tmp/**",
      ".vscode/**",
      ".wrangler/**",
      "workers/**",
    ],
  },
);
