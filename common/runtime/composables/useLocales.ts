import { i18n } from "../utils/i18n";
import { createMapFromImportGlobe } from "../utils/createMapFromImportGlobe";
import { setLocale } from "yup";

export const useLocales = () => {
  const { SUPPORT_LOCALES } = useRuntimeConfig().public;

  const yupSetLocale = () => {
    const { t } = i18n.global;
    setLocale({
      // use constant translation keys for messages without values
      mixed: {
        required: t("Обязательное поле"),
      },
      string: {
        email: t("Корректный email адрес"),
        url: t("Корректный url адрес"),
        min: ({ min }) => t("Минимум {n} символов", min),
        max: ({ max }) => t("Максимум {n} символов", max),
      },
      number: {
        min: ({ min }) => t("Минимум {min}", { min }),
        max: ({ max }) => t("Максимум {max}", { max }),
        positive: t("Положительное число"),
        integer: t("Целое число"),
      },
      array: {
        min: ({ min }) => t("Минимум {n} элементов", min),
        max: ({ max }) => t("Максимум {n} элементов", max),
      },
    });
  };

  const localesData = [
    {
      code: "ru",
      locale: "ru-RU",
      name: "Русский",
    },
    {
      code: "en",
      locale: "en-US",
      name: "English",
    },
  ];

  const exceptCurrent = computed(() =>
    SUPPORT_LOCALES.filter((i: string) => i !== i18n.global.locale.value),
  );
  const currentLocale = computed(
    () => localesData.filter((i) => i?.code === i18n.global.locale.value)[0],
  );
  const locales = computed(() =>
    localesData.filter((l) => SUPPORT_LOCALES.includes(l?.code)),
  );
  const loadMessages = async (locale: string) => {
    try {
      const files = createMapFromImportGlobe(
        import.meta.glob("@/locales/*.json"),
        "json",
      );
      const commonFiles = createMapFromImportGlobe(
        import.meta.glob("@/../common/runtime/locales/*.json"),
        "json",
      );
      const file = files.get(locale);
      const messages = (await file?.loader())?.default || {};

      const commonFile = commonFiles.get(locale);
      const commonMessages = (await commonFile?.loader())?.default || {};

      i18n.global.setLocaleMessage(locale, {
        ...commonMessages,
        ...messages,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const set = async (locale: string) => {
    await loadMessages(locale);
    i18n.global.locale.value = locale;

    yupSetLocale();
  };

  const init = async () => {
    const localeFromBrowser = (
      navigator.language ||
      // @ts-expect-error
      navigator.userLanguage ||
      ""
    ).substr(0, 2);

    const locale = SUPPORT_LOCALES.includes(localeFromBrowser)
      ? localeFromBrowser
      : i18n.global.locale.value;

    await loadMessages(locale);
    i18n.global.locale.value = locale;
    yupSetLocale();
  };

  const localesOptions = localesData.map((l) => ({
    name: l.name,
    value: l.code,
  }));

  return {
    locales,
    localesData,
    localesOptions,
    exceptCurrent,
    currentLocale,
    set,
    init,
  };
};
