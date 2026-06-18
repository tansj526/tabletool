import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownUp,
  Check,
  Copy,
  Download,
  Eraser,
  FileInput,
  Grid2X2,
  Play,
  Rows3,
  Sparkles,
  TextCursorInput,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { useCopy } from "../../hooks/useCopy";
import {
  convertTableData,
  getSample,
  removeEmptyColumns,
  removeEmptyRows,
  serializeRows,
  transformCase,
  transposeRows,
  trimCells
} from "../../services/tableConverter";
import { useToolStore } from "../../stores/toolStore";
import { TABLE_FORMATS, type TableFormat, type TableRows } from "../../types/tool";
import { downloadTextFile } from "../../utils/download";

const FORMAT_OPTIONS = TABLE_FORMATS.map((format) => ({
  label: format.toUpperCase(),
  value: format
}));

const schema = z.object({
  input: z.string().trim().min(1, "emptyInput")
});

type FormValues = z.infer<typeof schema>;

type EditingCell = {
  rowIndex: number;
  columnIndex: number;
} | null;

export function Tool() {
  const { t, i18n } = useTranslation();
  const { copied, copy } = useCopy();
  const store = useToolStore();
  const setOutput = store.setOutput;
  const languageKey = i18n.resolvedLanguage ?? i18n.language;
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { input: store.input }
  });

  const output = useMemo(() => {
    if (store.table.length === 0) {
      return "";
    }
    return serializeRows(store.table, store.targetFormat);
  }, [store.table, store.targetFormat]);

  useEffect(() => {
    setOutput(output);
  }, [output, setOutput]);

  function handleParse(values: FormValues) {
    const result = convertTableData({
      sourceFormat: store.sourceFormat,
      targetFormat: store.targetFormat,
      input: values.input
    });

    if (result.success && result.data) {
      store.setResult({
        output: result.data.output,
        table: result.data.table,
        message: t(result.message),
        rows: result.data.rows,
        columns: result.data.columns
      });
      return;
    }

    store.setError(t(result.message));
  }

  function handleLoadSample() {
    const sample = getSample(store.sourceFormat);
    form.setValue("input", sample, { shouldValidate: true });
    store.setInput(sample);
  }

  function replaceTable(table: TableRows, messageKey: string) {
    store.setTable(table);
    store.setResult({
      output: serializeRows(table, store.targetFormat),
      table,
      message: t(messageKey),
      rows: table.length,
      columns: Math.max(0, ...table.map((row) => row.length))
    });
  }

  function handleClear() {
    form.setValue("input", "");
    store.clear();
  }

  function updateCell(rowIndex: number, columnIndex: number, value: string) {
    store.setCell(rowIndex, columnIndex, value);
  }

  const tableActions = useMemo(
    () => [
      {
        key: "removeEmptyRows",
        label: t("removeEmptyRows"),
        icon: Rows3,
        action: () => replaceTable(removeEmptyRows(store.table), "tableUpdated")
      },
      {
        key: "removeEmptyColumns",
        label: t("removeEmptyColumns"),
        icon: Grid2X2,
        action: () => replaceTable(removeEmptyColumns(store.table), "tableUpdated")
      },
      {
        key: "trimSpaces",
        label: t("trimSpaces"),
        icon: Eraser,
        action: () => replaceTable(trimCells(store.table), "tableUpdated")
      },
      {
        key: "upperCase",
        label: t("upperCase"),
        icon: TextCursorInput,
        action: () => replaceTable(transformCase(store.table, "upper"), "tableUpdated")
      },
      {
        key: "lowerCase",
        label: t("lowerCase"),
        icon: TextCursorInput,
        action: () => replaceTable(transformCase(store.table, "lower"), "tableUpdated")
      },
      {
        key: "transpose",
        label: t("transpose"),
        icon: ArrowDownUp,
        action: () => replaceTable(transposeRows(store.table), "tableUpdated")
      }
    ],
    [languageKey, store.table, store.targetFormat]
  );

  return (
    <>
      <Seo
        title={t("heroTitle")}
        description={t("heroText")}
        keywords="table converter,csv,json,excel,sql,markdown,yaml,html table converter"
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t("brand")}
            </div>
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {t("editableHeroText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="converter" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{t("toolTitle")}</h2>
            <p className="mt-2 text-sm text-slate-600">{t("editableHint")}</p>
          </div>
          {store.status !== "idle" && (
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
              {store.status === "success" ? (
                <Check className="h-4 w-4 text-success" aria-hidden="true" />
              ) : (
                <FileInput className="h-4 w-4 text-danger" aria-hidden="true" />
              )}
              <span className={store.status === "success" ? "text-success" : "text-danger"}>
                {store.message}
              </span>
            </div>
          )}
        </div>

        <form
          className="rounded-md border border-slate-200 bg-white p-4 shadow-panel sm:p-5"
          onSubmit={form.handleSubmit(handleParse)}
        >
          <div className="grid gap-4 lg:grid-cols-[220px_220px_1fr]">
            <Select
              label={t("inputFormat")}
              options={FORMAT_OPTIONS}
              value={store.sourceFormat}
              onChange={(event) => store.setSourceFormat(event.target.value as TableFormat)}
            />
            <Select
              label={t("outputFormat")}
              options={FORMAT_OPTIONS}
              value={store.targetFormat}
              onChange={(event) => store.setTargetFormat(event.target.value as TableFormat)}
            />
            <Textarea
              label={t("inputLabel")}
              placeholder={t("inputPlaceholder")}
              className="min-h-40"
              {...form.register("input", {
                onChange: (event) => store.setInput(event.target.value)
              })}
            />
          </div>
          {form.formState.errors.input?.message && (
            <p className="mt-2 text-sm font-medium text-danger">
              {t(form.formState.errors.input.message)}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleLoadSample}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t("loadSample")}
            </Button>
            <Button type="submit">
              <Play className="h-4 w-4" aria-hidden="true" />
              {t("parseTable")}
            </Button>
            <Button type="button" variant="secondary" onClick={handleClear}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t("clear")}
            </Button>
          </div>
        </form>

        <section
          key={`editable-table-tools-${languageKey}`}
          className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-panel sm:p-5"
        >
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{t("editableTable")}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {store.rows} {t("rows")} · {store.columns} {t("columns")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tableActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant="secondary"
                    disabled={store.table.length === 0}
                    onClick={item.action}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="overflow-auto rounded-md border border-slate-200">
            {store.table.length === 0 ? (
              <div className="grid min-h-44 place-items-center bg-slate-50 p-6 text-center text-sm text-slate-500">
                {t("emptyTable")}
              </div>
            ) : (
              <table className="min-w-full border-collapse text-sm">
                <tbody>
                  {store.table.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`} className={rowIndex === 0 ? "bg-slate-100 font-semibold" : "bg-white"}>
                      {row.map((cell, columnIndex) => {
                        const isEditing =
                          editingCell?.rowIndex === rowIndex &&
                          editingCell.columnIndex === columnIndex;
                        return (
                          <td
                            key={`cell-${rowIndex}-${columnIndex}`}
                            className="min-w-32 border border-slate-200 p-0 align-top"
                            onDoubleClick={() => setEditingCell({ rowIndex, columnIndex })}
                          >
                            {isEditing ? (
                              <input
                                className="h-10 w-full bg-blue-50 px-3 outline-none ring-2 ring-primary"
                                value={cell}
                                autoFocus
                                onChange={(event) =>
                                  updateCell(rowIndex, columnIndex, event.target.value)
                                }
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === "Escape") {
                                    setEditingCell(null);
                                  }
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                className="min-h-10 w-full px-3 py-2 text-left text-slate-800 hover:bg-blue-50"
                                onClick={() => undefined}
                              >
                                {cell || <span className="text-slate-300">&nbsp;</span>}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{t("result")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("exportHint")}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={!output}
                onClick={() => void copy(output)}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? t("copied") : t("copy")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={!output}
                onClick={() => downloadTextFile(output, store.targetFormat)}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("download")}
              </Button>
            </div>
          </div>
          <pre className="min-h-64 overflow-auto rounded-md border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            {output}
          </pre>
        </section>
      </section>
    </>
  );
}
