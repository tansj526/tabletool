import { Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="inline-flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
            <Table2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>{t("brand")}</span>
        </a>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          {/*<a className="rounded-md px-3 py-2 hover:bg-slate-100" href="/">*/}
          {/*  {t("navHome")}*/}
          {/*</a>*/}
          {/*<a className="rounded-md px-3 py-2 hover:bg-slate-100" href="/tool">*/}
          {/*  {t("navTool")}*/}
          {/*</a>*/}
          {/*<a className="rounded-md px-3 py-2 hover:bg-slate-100" href="/about">*/}
          {/*  {t("navAbout")}*/}
          {/*</a>*/}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
