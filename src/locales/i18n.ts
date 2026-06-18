import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { de } from "./resources/de";
import { en } from "./resources/en";
import { es } from "./resources/es";
import { fr } from "./resources/fr";
import { ja } from "./resources/ja";
import { zh } from "./resources/zh";

const SUPPORTED_LANGUAGES = ["zh", "en", "ja", "de", "fr", "es"] as const;
const storedLanguage = localStorage.getItem("tabletool-language") ?? "zh";
const initialLanguage = SUPPORTED_LANGUAGES.some(
  (language) => language === storedLanguage
)
  ? storedLanguage
  : "zh";

void i18n.use(initReactI18next).init({
  resources: { zh, en, ja, de, fr, es },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "languageOnly",
  interpolation: {
    escapeValue: false
  }
});

export { i18n };
