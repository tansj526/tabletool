import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  getSeo,
  isSeoLocale,
  SUPPORTED_LOCALES,
  type SeoLocale
} from "../../seo";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;

  if (!isSeoLocale(resolvedParams.locale)) {
    notFound();
  }

  const seo = getSeo(resolvedParams.locale as SeoLocale);

  return <div lang={seo.htmlLang}>{children}</div>;
}
