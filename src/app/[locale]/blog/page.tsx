import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogList } from "../../../views/Blog/BlogList";
import { isSeoLocale, SUPPORTED_LOCALES, type SeoLocale } from "../../../seo";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isSeoLocale(locale)) {
    return {};
  }

  return {
    title: locale === "zh" ? "博客 - 表格工具箱" : "Blog - TableTool",
    description:
      locale === "zh"
        ? "表格工具箱博客，分享表格格式转换、数据清洗和在线工具使用技巧。"
        : "TableTool blog articles about table conversion, data cleaning, and online productivity tools.",
    keywords:
      locale === "zh"
        ? "表格工具箱博客, 表格转换教程, 数据清洗, Markdown博客"
        : "TableTool blog, table conversion tutorial, data cleaning, Markdown blog",
    alternates: {
      canonical: locale === "zh" ? "/blog" : `/${locale}/blog`
    }
  };
}

export default async function LocaleBlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSeoLocale(locale)) {
    notFound();
  }

  return <BlogList locale={locale as SeoLocale} />;
}
