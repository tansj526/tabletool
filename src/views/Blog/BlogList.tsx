import type { SeoLocale } from "../../seo";
import { getBlogPosts } from "../../lib/blog";
import { DEFAULT_LANGUAGE } from "../../locales/locales";

interface BlogListProps {
  locale: SeoLocale;
}

function getBlogPath(locale: SeoLocale, slug: string) {
  return locale === DEFAULT_LANGUAGE ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

const BLOG_COPY: Record<SeoLocale, { title: string; description: string }> = {
  zh: {
    title: "博客",
    description: "分享表格格式转换、数据清洗和在线工具使用技巧。"
  },
  en: {
    title: "Blog",
    description: "Markdown articles generated from the local blog directory."
  },
  fr: {
    title: "Blog",
    description: "Articles Markdown generes depuis le dossier blog local."
  },
  es: {
    title: "Blog",
    description: "Articulos Markdown generados desde el directorio local del blog."
  },
  pt: {
    title: "Blog",
    description: "Artigos Markdown gerados a partir do diretorio local do blog."
  },
  de: {
    title: "Blog",
    description: "Markdown-Artikel aus dem lokalen Blog-Verzeichnis."
  },
  ja: {
    title: "ブログ",
    description: "ローカルの blog ディレクトリから生成された Markdown 記事。"
  }
};

export function BlogList({ locale }: BlogListProps) {
  const posts = getBlogPosts(locale);
  const copy = BLOG_COPY[locale];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {copy.description}
        </p>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <time className="text-xs font-semibold uppercase text-slate-500">{post.date}</time>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              <a className="hover:text-primary" href={getBlogPath(locale, post.slug)}>
                {post.title}
              </a>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
