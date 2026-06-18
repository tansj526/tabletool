import { create } from "zustand";
import type { TableFormat, TableRows } from "../types/tool";

interface ToolState {
  sourceFormat: TableFormat;
  targetFormat: TableFormat;
  input: string;
  output: string;
  table: TableRows;
  status: "idle" | "success" | "error";
  message: string;
  rows: number;
  columns: number;
  setSourceFormat: (format: TableFormat) => void;
  setTargetFormat: (format: TableFormat) => void;
  setInput: (input: string) => void;
  setTable: (table: TableRows) => void;
  setCell: (rowIndex: number, columnIndex: number, value: string) => void;
  setResult: (payload: {
    output: string;
    table: TableRows;
    message: string;
    rows: number;
    columns: number;
  }) => void;
  setOutput: (output: string) => void;
  setError: (message: string) => void;
  clear: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
  sourceFormat: "csv",
  targetFormat: "json",
  input: "",
  output: "",
  table: [],
  status: "idle",
  message: "",
  rows: 0,
  columns: 0,
  setSourceFormat: (format) => set({ sourceFormat: format }),
  setTargetFormat: (format) => set({ targetFormat: format }),
  setInput: (input) => set({ input }),
  setTable: (table) =>
    set({
      table,
      rows: table.length,
      columns: Math.max(0, ...table.map((row) => row.length))
    }),
  setCell: (rowIndex, columnIndex, value) =>
    set((state) => {
      const table = state.table.map((row) => [...row]);
      table[rowIndex][columnIndex] = value;
      return {
        table,
        rows: table.length,
        columns: Math.max(0, ...table.map((row) => row.length))
      };
    }),
  setResult: (payload) =>
    set({
      output: payload.output,
      table: payload.table,
      message: payload.message,
      rows: payload.rows,
      columns: payload.columns,
      status: "success"
    }),
  setOutput: (output) => set({ output }),
  setError: (message) =>
    set({ output: "", message, rows: 0, columns: 0, status: "error" }),
  clear: () =>
    set({
      input: "",
      output: "",
      table: [],
      rows: 0,
      columns: 0,
      status: "idle",
      message: ""
    })
}));
