import type { TableFormat } from "../types/tool";

const EXTENSION_MAP: Partial<Record<TableFormat, string>> = {
  csv: "csv",
  tsv: "tsv",
  json: "json",
  jsonlines: "jsonl",
  html: "html",
  markdown: "md",
  xml: "xml",
  yaml: "yaml",
  sql: "sql",
  sqlite: "sql",
  mysqldump: "sql",
  pgdump: "sql",
  ini: "ini",
  toml: "toml",
  php: "php",
  jsarray: "js",
  tsinterface: "ts",
  cstruct: "h",
  javabean: "java",
  swiftstruct: "swift",
  kotlindata: "kt",
  rtf: "rtf",
  ruby: "rb",
  asp: "asp",
  rdf: "rdf"
};

export function downloadTextFile(content: string, format: TableFormat) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tabletool-result.${EXTENSION_MAP[format] ?? "txt"}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
