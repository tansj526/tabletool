import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>©2026 KeepMot All rights reserved</p>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-primary">
            {t("privacy")}
          </a>
          {/*<a href="/terms" className="hover:text-primary">*/}
          {/*  {t("terms")}*/}
          {/*</a>*/}
        </div>
      </div>
    </footer>
  );
}
