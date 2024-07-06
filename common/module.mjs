import { resolve } from "path";
import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addImportsDir,
  addComponentsDir,
  addPlugin,
} from "@nuxt/kit";

const module = defineNuxtModule({
  meta: {
    name: "common",
    configKey: "commonModule",
  },
  defaults: {},
  async setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    addImportsDir([
      resolve(runtimeDir, "composables"),
      resolve(runtimeDir, "stores"),
      resolve(runtimeDir, "utils/**/*"),
      resolve(runtimeDir, "api/*"),
    ]);

    await addComponentsDir({
      path: resolve(runtimeDir, "components/fields"),
    });
    await addComponentsDir({
      path: resolve(runtimeDir, "components/the"),
    });

    addPlugin(resolve(runtimeDir, "plugins/VueI18nPlugin"));
  },
});

export { module as default };
