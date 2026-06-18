import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <textarea
        className={cn(
          "min-h-64 resize-y rounded-md border border-slate-200 bg-white p-3 font-mono text-sm leading-6 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100",
          className
        )}
        {...props}
      />
    </label>
  );
}
