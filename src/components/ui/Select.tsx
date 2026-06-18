import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ label: string; value: string }>;
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select
        className={cn(
          "h-11 rounded-md border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
