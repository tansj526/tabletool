import type { SeoLocale } from "../../seo";
import { getBlogPosts } from "../../lib/blog";

interface BlogListProps {
  locale: SeoLocale;
}

function getBlogPath(locale: SeoLocale, slug: string) {
  return locale === "zh" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

export function BlogList({ locale }: BlogListProps) {
  const posts = getBlogPosts(locale);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">Blog</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Markdown articles generated from the local blog directory.
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
