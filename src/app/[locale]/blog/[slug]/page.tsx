import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogStaticParams, getBlogPost } from "../../../../lib/blog";
import { DEFAULT_LANGUAGE } from "../../../../locales/locales";
import { isSeoLocale, type SeoLocale } from "../../../../seo";
import { BlogPost } from "../../../../views/Blog/BlogPost";

export function generateStaticParams() {
  return getAllBlogStaticParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isSeoLocale(locale)) {
    return {};
  }

  const post = getBlogPost(locale as SeoLocale, slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - TableTool`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical:
        locale === DEFAULT_LANGUAGE ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article"
    }
  };
}

export default async function LocaleBlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isSeoLocale(locale)) {
    notFound();
  }

  const post = getBlogPost(locale as SeoLocale, slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
