"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../../locales/i18n";
import {
  DEFAULT_LANGUAGE,
  getBrowserLanguage,
  getLocaleFromPathname,
  getLocalizedPath,
  getStoredLanguage
} from "../../locales/locales";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathLanguage = getLocaleFromPathname(pathname);

    if (pathLanguage) {
      void i18n.changeLanguage(pathLanguage);
      return;
    }

    const preferredLanguage =
      getStoredLanguage() ?? getBrowserLanguage(window.navigator.language);
    void i18n.changeLanguage(preferredLanguage);

    if (preferredLanguage !== DEFAULT_LANGUAGE) {
      router.replace(getLocalizedPath(pathname, preferredLanguage));
    }
  }, [i18n, pathname, router]);

  return <>{children}</>;
}
