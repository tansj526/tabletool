import fs from "node:fs";
import path from "node:path";
import { SUPPORTED_LOCALES, type SeoLocale } from "../seo";

export interface BlogPostMeta {
  slug: string;
  locale: SeoLocale;
  title: string;
  description: string;
  date: string;
  keywords: string;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

const BLOG_ROOT = path.join(process.cwd(), "blog");

function parseFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);

  if (!match) {
    return { data: new Map<string, string>(), content: source };
  }

  const data = new Map<string, string>();
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    data.set(key, value);
  }

  return { data, content: match[2] };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderTable(lines: string[]) {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => inlineMarkdown(cell.trim()))
  );
  const [headers, , ...body] = rows;
  const head = `<thead><tr>${headers.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
  const tableBody = `<tbody>${body
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<table>${head}${tableBody}</table>`;
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      index += 1;
      continue;
    }

    if (/^\|.+\|$/.test(trimmed) && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[index + 1]?.trim() ?? "")) {
      const tableLines = [lines[index], lines[index + 1]];
      index += 2;
      while (index < lines.length && /^\|.+\|$/.test(lines[index].trim())) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(renderTable(tableLines));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(`<li>${inlineMarkdown(lines[index].trim().slice(2))}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const paragraph: string[] = [trimmed];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#|##|###|- |\||```)/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function getPostPath(locale: SeoLocale, slug: string) {
  return path.join(BLOG_ROOT, locale, `${slug}.md`);
}

export function getBlogSlugs(locale: SeoLocale) {
  const localeDir = path.join(BLOG_ROOT, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  return fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getBlogPost(locale: SeoLocale, slug: string): BlogPost | null {
  const filePath = getPostPath(locale, slug);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  const title = data.get("title") ?? slug;
  const description = data.get("description") ?? "";

  return {
    slug,
    locale,
    title,
    description,
    date: data.get("date") ?? "",
    keywords: data.get("keywords") ?? "",
    html: markdownToHtml(content)
  };
}

export function getBlogPosts(locale: SeoLocale) {
  return getBlogSlugs(locale)
    .map((slug) => getBlogPost(locale, slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllBlogStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    getBlogSlugs(locale).map((slug) => ({ locale, slug }))
  );
}
