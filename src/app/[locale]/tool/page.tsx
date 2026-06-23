import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Index } from "../../../views/Tool";
import { getMetadata, isSeoLocale, SUPPORTED_LOCALES, type SeoLocale } from "../../../seo";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!isSeoLocale(resolvedParams.locale)) {
    return {};
  }

  return getMetadata(resolvedParams.locale as SeoLocale, "/tool");
}

export default async function LocaleToolPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;

  if (!isSeoLocale(resolvedParams.locale)) {
    notFound();
  }

  return <Index />;
}
