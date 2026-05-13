"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { DownloadButton } from "@/components/DownloadButton";
import {
  utilityCategoryConfigs,
  type UtilityToolConfig,
} from "@/lib/utilityTools";
import { cn } from "@/lib/utils";

export function UtilityToolLayout({
  tool,
  controls,
  preview,
}: {
  tool: UtilityToolConfig;
  controls: ReactNode;
  preview: ReactNode;
}) {
  const category = utilityCategoryConfigs[tool.category];

  return (
    <main className="w-full max-w-full overflow-hidden bg-[var(--bg)] lg:min-h-[calc(100vh-64px)]">
      <section className="bg-[var(--bg)]">
        <div className="mx-auto flex w-[min(358px,calc(100vw-2rem))] max-w-7xl flex-col gap-4 px-0 py-5 sm:w-full sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
              href={`/#${category.anchor}`}
            >
              <ArrowLeft className="h-4 w-4" />
              {category.label}
            </Link>
            <p className="mb-3 text-xs font-extrabold uppercase text-[var(--accent)]">
              {category.title}
            </p>
            <h1 className="break-words font-display text-3xl font-extrabold text-[var(--text)] sm:text-5xl">
              {tool.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              {tool.description}
            </p>
          </div>
          <div className="self-start rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)] lg:self-auto">
            Client-side
          </div>
        </div>
      </section>

      <AdSlot
        className="pb-5"
        format="horizontal"
        minHeight={90}
        minViewportWidth={640}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_TOP}
      />

      <section className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-5 overflow-hidden px-0 pb-10 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="mx-auto w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full overflow-visible rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:mx-0 sm:w-full">
          {controls}
        </aside>
        <div className="mx-auto min-h-[360px] w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full rounded-2xl border border-[var(--border)] bg-white shadow-sm sm:mx-0 sm:w-full sm:min-h-[560px]">
          {preview}
        </div>
      </section>
    </main>
  );
}

export function ControlSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] p-4 last:border-b-0 sm:p-5">
      <h2 className="text-sm font-extrabold text-[var(--text)]">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field-label">
      {label}
      {children}
      {hint ? (
        <span className="text-xs font-medium leading-5 text-[var(--muted)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm font-bold text-[var(--text)]">
      <span>{label}</span>
      <input
        checked={checked}
        className="h-4 w-4 accent-[var(--accent)]"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

export function SegmentedChoice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          className={cn(
            "segmented-button justify-center",
            value === option.value && "segmented-button-active",
          )}
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PreviewShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <h2 className="text-sm font-extrabold text-[var(--text)]">{title}</h2>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  const toneClass = {
    default: "bg-[var(--surface-2)] text-[var(--text)]",
    accent: "bg-[#fff4f3] text-[var(--accent)]",
    success: "bg-emerald-50 text-[var(--success)]",
    warning: "bg-amber-50 text-[var(--warning)]",
  }[tone];

  return (
    <div className={cn("rounded-lg border border-[var(--border)] p-4", toneClass)}>
      <p className="text-xs font-bold uppercase text-[var(--muted)]">{label}</p>
      <p className="mt-2 break-words text-xl font-extrabold">{value}</p>
    </div>
  );
}

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      className="segmented-button justify-center"
      disabled={!value}
      type="button"
      onClick={copy}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function TextDownloadButton({
  text,
  filename,
}: {
  text: string;
  filename: string;
}) {
  const blob = useMemo(
    () => (text ? new Blob([text], { type: "text/plain;charset=utf-8" }) : null),
    [text],
  );

  return <DownloadButton blob={blob} filename={filename} />;
}

export function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="min-h-48 whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-xs leading-6 text-[var(--text)]">
      {value || "Output will appear here."}
    </pre>
  );
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(value);
}

export function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
