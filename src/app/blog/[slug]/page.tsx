import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogSlugs } from "../../../lib/blog";
import { BlogPost } from "../../../views/Blog/BlogPost";

export function generateStaticParams() {
  return getBlogSlugs("zh").map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost("zh", slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - 表格工具箱`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article"
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost("zh", slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
