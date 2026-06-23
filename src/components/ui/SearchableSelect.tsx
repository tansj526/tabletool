"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";

interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  className
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0,
    width: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  function updateMenuPosition() {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setMenuPosition({
      left: rect.left,
      top: rect.bottom + 8,
      width: rect.width
    });
  }

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn("relative block text-sm font-semibold text-slate-700", className)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery("");
        }
      }}
    >
      <span className="mb-2 block">{label}</span>
      <button
        ref={buttonRef}
        type="button"
        className="flex h-11 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-slate-900 outline-none transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-blue-100"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          updateMenuPosition();
          setOpen((current) => !current);
        }}
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed z-50 rounded-md border border-slate-200 bg-white p-2 shadow-panel"
          style={{
            left: menuPosition.left,
            top: menuPosition.top,
            width: menuPosition.width
          }}
        >
          <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-500">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none"
              value={query}
              autoFocus
              placeholder="Search"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                  setQuery("");
                }
              }}
            />
          </label>
          <div className="mt-2 max-h-64 overflow-auto" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm font-medium text-slate-500">No results</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    "flex min-h-9 w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-primary",
                    option.value === value && "bg-blue-50 text-primary"
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
