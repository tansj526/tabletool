import type {
  ConversionData,
  ConversionInput,
  ServiceResult,
  TableFormat,
  TableRows
} from "../types/tool";

const SAMPLE_ROWS: TableRows = [
  ["Name", "Email", "Plan"],
  ["Ada Lovelace", "ada@example.com", "Pro"],
  ["Grace Hopper", "grace@example.com", "Team"]
];

const DELIMITED_FORMATS: Partial<Record<TableFormat, string>> = {
  csv: ",",
  tsv: "\t",
  clipboard: "\t",
  googlesheets: "\t",
  excel: "\t",
  ods: "\t",
  lotus123: "\t"
};

const TEXT_EXPORT_FORMATS = new Set<TableFormat>([
  "parquet",
  "feather",
  "stata",
  "spss",
  "sas",
  "hdf5",
  "biff"
]);

function normalizeRows(rows: TableRows): TableRows {
  const width = Math.max(0, ...rows.map((row) => row.length));
  return rows.map((row) =>
    Array.from({ length: width }, (_, index) => String(row[index] ?? ""))
  );
}

function splitDelimitedLine(line: string, separator: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === separator && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseDelimited(input: string, separator: string): TableRows {
  return normalizeRows(
    input
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.length > 0)
      .map((line) => splitDelimitedLine(line, separator))
  );
}

function parseJson(input: string): TableRows {
  const parsed = JSON.parse(input) as unknown;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("JSON must be a non-empty array.");
  }

  if (parsed.every((row) => Array.isArray(row))) {
    return normalizeRows(
      (parsed as unknown[][]).map((row) => row.map((cell) => String(cell ?? "")))
    );
  }

  if (parsed.every((row) => row && typeof row === "object" && !Array.isArray(row))) {
    const objects = parsed as Array<Record<string, unknown>>;
    const headers = Array.from(new Set(objects.flatMap((row) => Object.keys(row))));
    return normalizeRows([
      headers,
      ...objects.map((row) => headers.map((header) => String(row[header] ?? "")))
    ]);
  }

  throw new Error("JSON rows must be arrays or objects.");
}

function parseHtml(input: string): TableRows {
  const documentHtml = new DOMParser().parseFromString(input, "text/html");
  const rows = Array.from(documentHtml.querySelectorAll("tr"));

  if (rows.length === 0) {
    throw new Error("HTML must contain table rows.");
  }

  return normalizeRows(
    rows.map((row) =>
      Array.from(row.querySelectorAll("th,td")).map((cell) =>
        (cell.textContent ?? "").trim()
      )
    )
  );
}

function parseMarkdown(input: string): TableRows {
  const lines = input
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.includes("|"))
    .filter((line) => !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line));

  return normalizeRows(
    lines.map((line) =>
      line
        .replace(/^\s*\|/, "")
        .replace(/\|\s*$/, "")
        .split("|")
        .map((cell) => cell.trim())
    )
  );
}

function parseXml(input: string): TableRows {
  const xml = new DOMParser().parseFromString(input, "application/xml");
  const rows = Array.from(xml.querySelectorAll("row"));

  if (rows.length === 0) {
    throw new Error("XML must contain row elements.");
  }

  const firstRowChildren = Array.from(rows[0].children).map((child) => child.tagName);
  return normalizeRows([
    firstRowChildren,
    ...rows.map((row) =>
      firstRowChildren.map((name) => row.querySelector(name)?.textContent ?? "")
    )
  ]);
}

export function parseRows(input: string, format: TableFormat): ServiceResult<TableRows> {
  try {
    if (!input.trim()) {
      return { success: false, data: null, message: "emptyInput" };
    }

    if (format === "json" || format === "jsonlines") {
      const jsonInput =
        format === "jsonlines"
          ? `[${input
              .trim()
              .split(/\r?\n/)
              .filter(Boolean)
              .join(",")}]`
          : input;
      return { success: true, data: parseJson(jsonInput), message: "parsed" };
    }

    if (format === "html") {
      return { success: true, data: parseHtml(input), message: "parsed" };
    }

    if (format === "markdown") {
      return { success: true, data: parseMarkdown(input), message: "parsed" };
    }

    if (format === "xml" || format === "rdf" || format === "xmlss") {
      return { success: true, data: parseXml(input), message: "parsed" };
    }

    const separator = DELIMITED_FORMATS[format] ?? guessSeparator(input);
    return { success: true, data: parseDelimited(input, separator), message: "parsed" };
  } catch {
    return { success: false, data: null, message: "invalidFormat" };
  }
}

function guessSeparator(input: string): string {
  const firstLine = input.trim().split(/\r?\n/)[0] ?? "";
  const candidates = [
    { separator: "\t", count: firstLine.split("\t").length },
    { separator: ",", count: firstLine.split(",").length },
    { separator: "|", count: firstLine.split("|").length },
    { separator: ";", count: firstLine.split(";").length }
  ];
  return candidates.sort((a, b) => b.count - a.count)[0].separator;
}

function getHeaders(rows: TableRows): string[] {
  const width = Math.max(0, ...rows.map((row) => row.length));
  const first = rows[0] ?? [];
  return Array.from({ length: width }, (_, index) => {
    const header = first[index]?.trim();
    return header || `column_${index + 1}`;
  });
}

function getBody(rows: TableRows): TableRows {
  return rows.length > 1 ? rows.slice(1) : rows;
}

function escapeDelimited(value: string, separator: string): string {
  const mustQuote =
    value.includes(separator) || value.includes('"') || value.includes("\n");
  const escaped = value.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

function toDelimited(rows: TableRows, separator: string): string {
  return rows
    .map((row) => row.map((cell) => escapeDelimited(cell, separator)).join(separator))
    .join("\n");
}

function rowsToObjects(rows: TableRows): Array<Record<string, string>> {
  const headers = getHeaders(rows);
  return getBody(rows).map((row) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {})
  );
}

function toJson(rows: TableRows): string {
  return JSON.stringify(rowsToObjects(rows), null, 2);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toHtml(rows: TableRows): string {
  const [headers, ...body] = rows;
  const head = headers
    ? `  <thead>\n    <tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr>\n  </thead>`
    : "";
  const tableBody = body
    .map((row) => `    <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("\n");

  return `<table>\n${head}\n  <tbody>\n${tableBody}\n  </tbody>\n</table>`;
}

function toMarkdown(rows: TableRows): string {
  const normalized = normalizeRows(rows);
  const headers = normalized[0] ?? [];
  const divider = headers.map(() => "---");
  return [headers, divider, ...normalized.slice(1)]
    .map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`)
    .join("\n");
}

function toXml(rows: TableRows): string {
  const headers = getHeaders(rows);
  const body = getBody(rows);
  const rowXml = body
    .map(
      (row) =>
        `  <row>\n${headers
          .map((header, index) => `    <${safeName(header)}>${escapeHtml(row[index] ?? "")}</${safeName(header)}>`)
          .join("\n")}\n  </row>`
    )
    .join("\n");
  return `<rows>\n${rowXml}\n</rows>`;
}

function toYaml(rows: TableRows): string {
  return rowsToObjects(rows)
    .map((row) =>
      `- ${Object.entries(row)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join("\n  ")}`
    )
    .join("\n");
}

function toSqlInsert(rows: TableRows, tableName = "tabletool_data"): string {
  const headers = getHeaders(rows).map(safeName);
  const values = getBody(rows)
    .map(
      (row) =>
        `(${row
          .map((cell) => `'${cell.replace(/'/g, "''")}'`)
          .join(", ")})`
    )
    .join(",\n");
  return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES\n${values};`;
}

function toSqlDump(rows: TableRows, dialect: "mysql" | "pg" | "sqlite"): string {
  const tableName = dialect === "pg" ? "public.tabletool_data" : "tabletool_data";
  const headers = getHeaders(rows).map(safeName);
  const createColumns = headers.map((header) => `  ${header} TEXT`).join(",\n");
  return `CREATE TABLE ${tableName} (\n${createColumns}\n);\n\n${toSqlInsert(rows, tableName)}`;
}

function toIni(rows: TableRows): string {
  return rowsToObjects(rows)
    .map((row, index) => {
      const lines = Object.entries(row).map(([key, value]) => `${safeName(key)}=${value}`);
      return `[row_${index + 1}]\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

function toToml(rows: TableRows): string {
  return rowsToObjects(rows)
    .map((row) => {
      const lines = Object.entries(row).map(
        ([key, value]) => `${safeName(key)} = ${JSON.stringify(value)}`
      );
      return `[[rows]]\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

function toPhp(rows: TableRows): string {
  return `<?php\n$data = ${JSON.stringify(rowsToObjects(rows), null, 2).replace(/"([^"]+)":/g, '"$1" =>')};\n?>`;
}

function toJsArray(rows: TableRows): string {
  return `const rows = ${JSON.stringify(rowsToObjects(rows), null, 2)};`;
}

function toTsInterface(rows: TableRows): string {
  const fields = getHeaders(rows)
    .map((header) => `  ${safeName(header)}: string;`)
    .join("\n");
  return `interface TableToolRow {\n${fields}\n}\n\nconst rows: TableToolRow[] = ${JSON.stringify(rowsToObjects(rows), null, 2)};`;
}

function toCStruct(rows: TableRows): string {
  const fields = getHeaders(rows)
    .map((header) => `  char ${safeName(header)}[256];`)
    .join("\n");
  return `typedef struct {\n${fields}\n} TableToolRow;`;
}

function toJavaBean(rows: TableRows): string {
  const fields = getHeaders(rows)
    .map((header) => `  private String ${safeName(header)};`)
    .join("\n");
  return `public class TableToolRow {\n${fields}\n}`;
}

function toSwiftStruct(rows: TableRows): string {
  const fields = getHeaders(rows)
    .map((header) => `  let ${safeName(header)}: String`)
    .join("\n");
  return `struct TableToolRow: Codable {\n${fields}\n}`;
}

function toKotlinData(rows: TableRows): string {
  const fields = getHeaders(rows)
    .map((header) => `  val ${safeName(header)}: String`)
    .join(",\n");
  return `data class TableToolRow(\n${fields}\n)`;
}

function toAscii(rows: TableRows): string {
  const normalized = normalizeRows(rows);
  const widths = normalized[0]?.map((_, column) =>
    Math.max(...normalized.map((row) => row[column].length))
  ) ?? [];
  const border = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  const lines = normalized.map(
    (row) =>
      `|${row
        .map((cell, index) => ` ${cell.padEnd(widths[index])} `)
        .join("|")}|`
  );
  return [border, lines[0], border, ...lines.slice(1), border].filter(Boolean).join("\n");
}

function toWiki(rows: TableRows, format: "mediawiki" | "jira" | "tracwiki"): string {
  if (format === "mediawiki") {
    return `{| class="wikitable"\n${rows
      .map((row, rowIndex) => `${rowIndex === 0 ? "!" : "|"} ${row.join(rowIndex === 0 ? " !! " : " || ")}`)
      .join("\n|-\n")}\n|}`;
  }
  const marker = format === "jira" ? "||" : "||";
  return rows
    .map((row, rowIndex) => {
      const edge = rowIndex === 0 ? marker : "|";
      return `${edge}${row.join(edge)}${edge}`;
    })
    .join("\n");
}

function toRtf(rows: TableRows): string {
  const text = toDelimited(rows, "\t").replace(/\n/g, "\\line ");
  return `{\\rtf1\\ansi ${text}}`;
}

function toRdf(rows: TableRows): string {
  return rowsToObjects(rows)
    .map((row, rowIndex) =>
      Object.entries(row)
        .map(
          ([key, value]) =>
            `<urn:tabletool:row:${rowIndex + 1}> <urn:tabletool:${safeName(key)}> "${value.replace(/"/g, '\\"')}" .`
        )
        .join("\n")
    )
    .join("\n");
}

function toTemplate(format: TableFormat, rows: TableRows): string {
  const title = format.toUpperCase();
  if (TEXT_EXPORT_FORMATS.has(format)) {
    return `${title} is a binary/statistical export format. Copy this normalized JSON payload into a backend exporter:\n${toJson(rows)}`;
  }
  return `${title} representation\n\n${toJson(rows)}`;
}

function safeName(value: string): string {
  const normalized = value.trim().replace(/[^A-Za-z0-9_]/g, "_");
  const fallback = normalized || "field";
  return /^\d/.test(fallback) ? `_${fallback}` : fallback;
}

export function serializeRows(rows: TableRows, format: TableFormat): string {
  const normalized = normalizeRows(rows);

  if (format === "csv") return toDelimited(normalized, ",");
  if (format === "tsv" || format === "clipboard" || format === "googlesheets" || format === "excel" || format === "ods") return toDelimited(normalized, "\t");
  if (format === "json") return toJson(normalized);
  if (format === "jsonlines") return rowsToObjects(normalized).map((row) => JSON.stringify(row)).join("\n");
  if (format === "html") return toHtml(normalized);
  if (format === "markdown") return toMarkdown(normalized);
  if (format === "xml" || format === "xmlss") return toXml(normalized);
  if (format === "yaml") return toYaml(normalized);
  if (format === "sql") return toSqlInsert(normalized);
  if (format === "sqlite") return toSqlDump(normalized, "sqlite");
  if (format === "mysqldump") return toSqlDump(normalized, "mysql");
  if (format === "pgdump") return toSqlDump(normalized, "pg");
  if (format === "ini") return toIni(normalized);
  if (format === "toml") return toToml(normalized);
  if (format === "php") return toPhp(normalized);
  if (format === "jsarray") return toJsArray(normalized);
  if (format === "tsinterface") return toTsInterface(normalized);
  if (format === "cstruct") return toCStruct(normalized);
  if (format === "javabean") return toJavaBean(normalized);
  if (format === "swiftstruct") return toSwiftStruct(normalized);
  if (format === "kotlindata") return toKotlinData(normalized);
  if (format === "ascii") return toAscii(normalized);
  if (format === "asciidoc") return `[cols="${getHeaders(normalized).map(() => "1").join(",")}"]\n|===\n${normalized.map((row) => row.map((cell) => `|${cell}`).join("\n")).join("\n\n")}\n|===`;
  if (format === "bbcode") return `[table]\n${normalized.map((row) => `[tr]${row.map((cell) => `[td]${cell}[/td]`).join("")}[/tr]`).join("\n")}\n[/table]`;
  if (format === "jira" || format === "tracwiki" || format === "mediawiki") return toWiki(normalized, format);
  if (format === "textile") return normalized.map((row) => `| ${row.join(" | ")} |`).join("\n");
  if (format === "restructuredtext") return toAscii(normalized);
  if (format === "rtf") return toRtf(normalized);
  if (format === "pandasdataframe") return `import pandas as pd\n\ndf = pd.DataFrame(${JSON.stringify(rowsToObjects(normalized), null, 2)})`;
  if (format === "rdataframe") return `data.frame(\n${getHeaders(normalized).map((header, index) => `  ${safeName(header)} = c(${getBody(normalized).map((row) => JSON.stringify(row[index] ?? "")).join(", ")})`).join(",\n")}\n)`;
  if (format === "sqlalchemy") return `rows = ${JSON.stringify(rowsToObjects(normalized), null, 2)}`;
  if (format === "csdatatable") return `var rows = ${JSON.stringify(rowsToObjects(normalized), null, 2)};`;
  if (format === "avro" || format === "protobuf") return toTemplate(format, normalized);
  if (format === "rdf") return toRdf(normalized);
  if (format === "matlab") return `rows = ${JSON.stringify(normalized)};`;
  if (format === "firebase") return JSON.stringify({ rows: rowsToObjects(normalized) }, null, 2);
  if (format === "qlik") return toDelimited(normalized, "\t");
  if (format === "dax") return `DATATABLE(${getHeaders(normalized).map((header) => `"${header}", STRING`).join(", ")}, { ${getBody(normalized).map((row) => `{ ${row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(", ")} }`).join(", ")} })`;
  if (format === "asp") return `<%\nDim rows\nrows = ${JSON.stringify(rowsToObjects(normalized))}\n%>`;
  if (format === "ruby") return `rows = ${JSON.stringify(rowsToObjects(normalized), null, 2)}`;
  if (format === "magic") return toAscii(normalized);

  return toTemplate(format, normalized);
}

export function convertTableData(
  input: ConversionInput
): ServiceResult<ConversionData> {
  try {
    const parsed = parseRows(input.input, input.sourceFormat);

    if (!parsed.success || !parsed.data) {
      return { success: false, data: null, message: parsed.message };
    }

    const table = normalizeRows(parsed.data);
    const output = serializeRows(table, input.targetFormat);
    const columns = Math.max(0, ...table.map((row) => row.length));

    return {
      success: true,
      data: { output, table, rows: table.length, columns },
      message: "converted"
    };
  } catch {
    return { success: false, data: null, message: "invalidFormat" };
  }
}

export function getSample(format: TableFormat) {
  try {
    return serializeRows(SAMPLE_ROWS, format);
  } catch {
    return "";
  }
}

export function removeEmptyRows(rows: TableRows): TableRows {
  return normalizeRows(rows.filter((row) => row.some((cell) => cell.trim() !== "")));
}

export function removeEmptyColumns(rows: TableRows): TableRows {
  const normalized = normalizeRows(rows);
  const width = Math.max(0, ...normalized.map((row) => row.length));
  const keepIndexes = Array.from({ length: width }, (_, index) => index).filter((index) =>
    normalized.some((row) => row[index]?.trim() !== "")
  );
  return normalized.map((row) => keepIndexes.map((index) => row[index] ?? ""));
}

export function trimCells(rows: TableRows): TableRows {
  return rows.map((row) => row.map((cell) => cell.trim()));
}

export function transformCase(rows: TableRows, mode: "upper" | "lower"): TableRows {
  return rows.map((row) =>
    row.map((cell) => (mode === "upper" ? cell.toUpperCase() : cell.toLowerCase()))
  );
}

export function transposeRows(rows: TableRows): TableRows {
  const normalized = normalizeRows(rows);
  const width = Math.max(0, ...normalized.map((row) => row.length));
  return Array.from({ length: width }, (_, column) =>
    normalized.map((row) => row[column] ?? "")
  );
}
