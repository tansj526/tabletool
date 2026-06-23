import type { Metadata } from "next";
import { DEFAULT_LANGUAGE } from "../../locales/locales";
import { BlogList } from "../../views/Blog/BlogList";

export const metadata: Metadata = {
  title: "Blog - TableTool",
  description:
    "TableTool blog articles about table conversion, data cleaning, and online productivity tools.",
  keywords: "TableTool blog, table conversion tutorial, data cleaning, Markdown blog",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  return <BlogList locale={DEFAULT_LANGUAGE} />;
}
