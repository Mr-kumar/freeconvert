"use client";

import { useMemo, useState } from "react";
import { parsePageRange } from "@/lib/utils";

interface PageRangeInputProps {
  totalPages: number;
  value: string;
  onChange: (value: string, pages: number[]) => void;
}

export function PageRangeInput({
  totalPages,
  value,
  onChange,
}: PageRangeInputProps) {
  const [touched, setTouched] = useState(false);
  const parsed = useMemo(() => {
    try {
      return {
        pages: parsePageRange(value, totalPages),
        error: "",
      };
    } catch (error) {
      return {
        pages: [] as number[],
        error: error instanceof Error ? error.message : "Invalid page range.",
      };
    }
  }, [totalPages, value]);

  function emit(nextValue: string) {
    try {
      const nextPages = parsePageRange(nextValue, totalPages);
      onChange(nextValue, nextPages);
    } catch {
      onChange(nextValue, []);
    }
  }

  function quick(type: "all" | "even" | "odd" | "first" | "last") {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const selected =
      type === "all"
        ? pages
        : type === "even"
          ? pages.filter((page) => page % 2 === 0)
          : type === "odd"
            ? pages.filter((page) => page % 2 === 1)
            : type === "first"
              ? pages.slice(0, 1)
              : pages.slice(-1);
    const nextValue = selected.join(",");
    onChange(nextValue, selected);
  }

  return (
    <div className="space-y-3">
      <label className="field-label">
        Page range
        <input
          className="field-input"
          placeholder={totalPages ? `1-${totalPages}, 5` : "1-3, 5"}
          value={value}
          onBlur={() => setTouched(true)}
          onChange={(event) => emit(event.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["All", "all"],
          ["Even", "even"],
          ["Odd", "odd"],
          ["First", "first"],
          ["Last", "last"],
        ].map(([label, type]) => (
          <button
            className="segmented-button"
            disabled={!totalPages}
            key={type}
            type="button"
            onClick={() => quick(type as "all" | "even" | "odd" | "first" | "last")}
          >
            {label}
          </button>
        ))}
      </div>
      {touched && parsed.error ? (
        <p className="text-xs font-semibold text-[var(--danger)]">
          {parsed.error}
        </p>
      ) : null}
      {parsed.pages.length > 0 ? (
        <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
          {parsed.pages.slice(0, 40).map((page) => (
            <span
              className="rounded-md bg-[#fff1f0] px-2 py-1 font-mono text-[10px] font-bold text-[var(--accent)]"
              key={page}
            >
              {page}
            </span>
          ))}
          {parsed.pages.length > 40 ? (
            <span className="px-2 py-1 text-[10px] font-bold text-[var(--muted)]">
              +{parsed.pages.length - 40}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
