import type { Metadata } from "next";
import { BlogList } from "../../views/Blog/BlogList";

export const metadata: Metadata = {
  title: "博客 - 表格工具箱",
  description: "表格工具箱博客，分享表格格式转换、数据清洗和在线工具使用技巧。",
  keywords: "表格工具箱博客, 表格转换教程, 数据清洗, Markdown博客",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  return <BlogList locale="zh" />;
}
