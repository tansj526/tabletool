export const TABLE_FORMATS = [
  "json",
  "csv",
  "excel",
  "sql",
  "html",
  "markdown",
  "tsv",
  "xml",
  "yaml",
  "pandasdataframe",
  "rdataframe",
  "clipboard",
  "googlesheets",
  "mediawiki",
  "ini",
  "toml",
  "php",
  "jsarray",
  "tsinterface",
  "cstruct",
  "javabean",
  "swiftstruct",
  "kotlindata",
  "ascii",
  "asciidoc",
  "bbcode",
  "jira",
  "tracwiki",
  "textile",
  "restructuredtext",
  "rtf",
  "ods",
  "lotus123",
  "parquet",
  "feather",
  "stata",
  "spss",
  "sas",
  "hdf5",
  "sqlite",
  "mysqldump",
  "pgdump",
  "xmlss",
  "biff",
  "sqlalchemy",
  "csdatatable",
  "avro",
  "protobuf",
  "rdf",
  "matlab",
  "magic",
  "firebase",
  "qlik",
  "dax",
  "jsonlines",
  "asp",
  "ruby"
] as const;

export type TableFormat = (typeof TABLE_FORMATS)[number];

export type TableRows = string[][];

export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface ConversionInput {
  sourceFormat: TableFormat;
  targetFormat: TableFormat;
  input: string;
}

export interface ConversionData {
  output: string;
  table: TableRows;
  rows: number;
  columns: number;
}
