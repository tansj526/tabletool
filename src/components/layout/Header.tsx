"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getLocaleFromPathname } from "../../locales/locales";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const localePrefix = locale && locale !== "zh" ? `/${locale}` : "";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="inline-flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-9 w-9 place-items-center">
            <img src="/logo.png" className="h-9 w-9" aria-hidden="true" />
          </span>
          <span>{t("brand")}</span>
        </a>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <a className="rounded-md px-3 py-2 hover:bg-slate-100" href={`${localePrefix}/blog`}>
            {t("navBlog")}
          </a>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
