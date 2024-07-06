import { useLocales } from "../composables/useLocales";
import { i18n } from "../utils/i18n";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n);
  useLocales().init();
});
