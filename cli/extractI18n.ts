import VueI18NExtract from "vue-i18n-extract";

let dir = process.argv[2];
const doRemove = process.argv[3];

const isCommon = dir === "common";
if (isCommon) {
  dir = `${dir}/runtime`;
}

const vueFiles = `./${dir}/**/*.?(js|vue|ts)`;
const languageFiles = `./${dir}/locales/*.?(json|yml|yaml)`;

VueI18NExtract.createI18NReport({
  add: !doRemove,
  remove: !!doRemove,
  vueFiles,
  languageFiles,
  noEmptyTranslation: "ru",
  separator: "!@#$*",
});
