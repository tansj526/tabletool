"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FocusEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  getLocaleFromPathname,
  getLocalizedPath,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage
} from "../../locales/locales";

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
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = i18n.language.split("-")[0] ?? DEFAULT_LANGUAGE;
  const activeLanguage =
    getLocaleFromPathname(pathname) ??
    (isSupportedLanguage(currentLanguage) ? currentLanguage : DEFAULT_LANGUAGE);
  const activeLanguageLabel =
    LANGUAGES.find((language) => language.value === activeLanguage)?.label ?? "English";

  function changeLanguage(language: SupportedLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    void i18n.changeLanguage(language);
    setIsOpen(false);
    router.push(getLocalizedPath(pathname, language));
  }

  function closeWhenFocusLeaves(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <div
      className="group relative inline-flex text-sm text-slate-700"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={closeWhenFocusLeaves}
    >
      <button
        type="button"
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary/30"
        onClick={() => setIsOpen((value) => !value)}
      >
        <Languages className="h-4 w-4" aria-hidden="true" />
        <span>{activeLanguageLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className="absolute right-0 top-full z-30 min-w-40 pt-2"
        style={{
          display: isOpen ? "block" : "none"
        }}
        role="menu"
      >
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {LANGUAGES.map((language) => (
            <button
              key={language.value}
              type="button"
              role="menuitem"
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              onClick={() => changeLanguage(language.value as SupportedLanguage)}
            >
              <span>{language.label}</span>
              {language.value === activeLanguage ? (
                <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
