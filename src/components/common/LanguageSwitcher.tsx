import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
  { label: "Español", value: "es" },
  { label: "português", value: "pt" },
  { label: "Deutsch", value: "de" },
  { label: "日本語", value: "ja" }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
      <Languages className="h-4 w-4" aria-hidden="true" />
      <select
        className="bg-transparent outline-none"
        value={i18n.language}
        aria-label="Language"
        onChange={(event) => {
          const language = event.target.value;
          localStorage.setItem("tabletool-language", language);
          void i18n.changeLanguage(language);
        }}
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
