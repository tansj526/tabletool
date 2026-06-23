import type { Metadata } from "next";
import { DEFAULT_LANGUAGE } from "./locales/locales";

export const SUPPORTED_LOCALES = ["zh", "en", "fr", "es", "pt", "de", "ja"] as const;

export type SeoLocale = (typeof SUPPORTED_LOCALES)[number];

const SEO_BY_LOCALE: Record<
  SeoLocale,
  {
    title: string;
    keywords: string;
    description: string;
    htmlLang: string;
  }
> = {
  zh: {
    title: "表格工具箱 - 专业的表格格式转换与处理工具箱",
    keywords:
      "表格工具, JSON转表格, 表格转JSON, Excel转HTML, CSV转换工具, Markdown表格, 表格格式转换, 在线表格工具, 表格清洗, 表格美化",
    description:
      "表格工具箱是一个专业的表格处理工具平台，支持 JSON、CSV、Excel、HTML、Markdown 等多种格式的互转，轻松实现表格格式转换、数据清洗、美化与导出，简单易用、无需注册、数据隐私友好。",
    htmlLang: "zh-CN"
  },
  en: {
    title: "TableTool - Professional Table Format Conversion and Processing Toolbox",
    keywords:
      "table tool, JSON to table, table to JSON, Excel to HTML, CSV converter, Markdown table, table format conversion, online table tool, table cleaning, table formatting",
    description:
      "TableTool is a professional table processing platform that supports conversion between JSON, CSV, Excel, HTML, Markdown and more, with easy table conversion, cleaning, formatting and export without registration.",
    htmlLang: "en"
  },
  fr: {
    title: "TableTool - Boîte à outils professionnelle de conversion de tableaux",
    keywords:
      "outil tableau, JSON vers tableau, tableau vers JSON, Excel vers HTML, convertisseur CSV, tableau Markdown, conversion de format tableau, outil tableau en ligne, nettoyage tableau",
    description:
      "TableTool est une plateforme professionnelle de traitement de tableaux qui convertit JSON, CSV, Excel, HTML, Markdown et d'autres formats, avec nettoyage, mise en forme et export faciles.",
    htmlLang: "fr"
  },
  es: {
    title: "TableTool - Herramientas profesionales para convertir y procesar tablas",
    keywords:
      "herramienta de tablas, JSON a tabla, tabla a JSON, Excel a HTML, convertidor CSV, tabla Markdown, conversión de tablas, herramienta de tablas online, limpieza de tablas",
    description:
      "TableTool es una plataforma profesional para procesar tablas que convierte JSON, CSV, Excel, HTML, Markdown y más, con limpieza, formato y exportación sencillos.",
    htmlLang: "es"
  },
  pt: {
    title: "TableTool - Caixa de ferramentas profissional para conversão de tabelas",
    keywords:
      "ferramenta de tabela, JSON para tabela, tabela para JSON, Excel para HTML, conversor CSV, tabela Markdown, conversão de tabela, ferramenta online de tabela, limpeza de tabela",
    description:
      "TableTool é uma plataforma profissional de processamento de tabelas que converte JSON, CSV, Excel, HTML, Markdown e outros formatos, com limpeza, formatação e exportação fáceis.",
    htmlLang: "pt"
  },
  de: {
    title: "TableTool - Professionelle Toolbox für Tabellenkonvertierung",
    keywords:
      "Tabellentool, JSON zu Tabelle, Tabelle zu JSON, Excel zu HTML, CSV Konverter, Markdown Tabelle, Tabellenformat konvertieren, Online Tabellentool, Tabellen bereinigen",
    description:
      "TableTool ist eine professionelle Plattform zur Tabellenverarbeitung und konvertiert JSON, CSV, Excel, HTML, Markdown und mehr mit einfacher Bereinigung, Formatierung und Export.",
    htmlLang: "de"
  },
  ja: {
    title: "TableTool - プロ向け表形式変換・処理ツールボックス",
    keywords:
      "表ツール, JSONから表, 表からJSON, ExcelからHTML, CSV変換, Markdown表, 表形式変換, オンライン表ツール, 表データ整理",
    description:
      "TableTool は JSON、CSV、Excel、HTML、Markdown などの形式変換、表データの整理、整形、エクスポートを簡単に行えるプロ向け表処理ツールです。",
    htmlLang: "ja"
  }
};

const LANGUAGE_ALTERNATES: Record<string, string> = {
  en: "/",
  "zh-CN": "/zh",
  fr: "/fr",
  es: "/es",
  pt: "/pt",
  de: "/de",
  ja: "/ja"
};

export function isSeoLocale(locale: string): locale is SeoLocale {
  return SUPPORTED_LOCALES.some((item) => item === locale);
}

export function getSeo(locale: SeoLocale) {
  return SEO_BY_LOCALE[locale];
}

export function getMetadata(locale: SeoLocale, path = ""): Metadata {
  const seo = getSeo(locale);
  const canonical = locale === DEFAULT_LANGUAGE ? path || "/" : `/${locale}${path}`;

  return {
    metadataBase: new URL("https://tabletool.cn"),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: ["/og-image.svg"],
      type: "website",
      locale: seo.htmlLang
    },
    alternates: {
      canonical,
      languages: LANGUAGE_ALTERNATES
    }
  };
}
