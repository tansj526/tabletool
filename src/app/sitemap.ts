import type { MetadataRoute } from "next";
import { getBlogSlugs } from "../lib/blog";
import { DEFAULT_LANGUAGE } from "../locales/locales";
import { SUPPORTED_LOCALES, type SeoLocale } from "../seo";

const SITE_URL = "https://tabletool.cn";

export const dynamic = "force-static";

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

function localePath(locale: SeoLocale, path = "") {
  if (locale === DEFAULT_LANGUAGE) {
    return path || "/";
  }

  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/tool", "/privacy", "/blog"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of staticPaths) {
      sitemapEntries.push({
        url: absoluteUrl(localePath(locale, path)),
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: locale === DEFAULT_LANGUAGE && path === "" ? 1 : 0.7
      });
    }

    for (const slug of getBlogSlugs(locale)) {
      sitemapEntries.push({
        url: absoluteUrl(localePath(locale, `/blog/${slug}`)),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6
      });
    }
  }

  return sitemapEntries;
}
