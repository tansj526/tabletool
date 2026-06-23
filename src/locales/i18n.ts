import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { de } from "./resources/de";
import { en } from "./resources/en";
import { es } from "./resources/es";
import { fr } from "./resources/fr";
import { ja } from "./resources/ja";
import { pt } from "./resources/pt";
import { zh } from "./resources/zh";
import {
  getLocaleFromPathname,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES
} from "./locales";

const pathLanguage =
  typeof window === "undefined" ? null : getLocaleFromPathname(window.location.pathname);
const storedLanguage =
  typeof window === "undefined"
    ? "zh"
    : localStorage.getItem("tabletool-language") ?? "zh";
const initialLanguage =
  pathLanguage ?? (isSupportedLanguage(storedLanguage) ? storedLanguage : "zh");

void i18n.use(initReactI18next).init({
  resources: { zh, en, fr, es, pt, de, ja },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "languageOnly",
  interpolation: {
    escapeValue: false
  }
});

export { i18n };
