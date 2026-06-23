import type { BlogPost as BlogPostData } from "../../lib/blog";

interface BlogPostProps {
  post: BlogPostData;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <time className="text-xs font-semibold uppercase text-slate-500">{post.date}</time>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{post.description}</p>
      </header>
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
