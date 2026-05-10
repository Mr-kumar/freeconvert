"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Wand2 } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { DownloadButton } from "@/components/DownloadButton";
import { pdfToolConfigs } from "@/lib/tools";
import type { PDFToolSlug } from "@/lib/types";
import { clamp, cn, formatBytes } from "@/lib/utils";
import { usePDFStore } from "@/store/usePDFStore";

export function asPDFString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function asPDFNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asPDFBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden border-b border-[var(--border)] p-4">
      <h2 className="mb-4 text-sm font-bold text-[var(--accent)]">{title}</h2>
      <div className="w-full min-w-0 max-w-full space-y-4">{children}</div>
    </section>
  );
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field-label min-w-0">
      <span className="flex items-center justify-between">
        {label}
        <span className="font-mono text-xs text-[var(--accent)]">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="range-input"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function NumberControl({
  label,
  value,
  min = 0,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number | string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field-label min-w-0">
      {label}
      <input
        className="field-input"
        max={max}
        min={min}
        step={step}
        type="number"
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) {
            onChange(parsed);
          }
        }}
      />
    </label>
  );
}

export function TextControl({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "password";
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-label min-w-0">
      {label}
      <input
        className="field-input"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="field-label">
      {label}
      <select
        className="field-input"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
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

export function ToggleButton({
  active,
  children,
  className,
  disabled = false,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn("segmented-button min-w-0", active && "segmented-button-active", className)}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PDFInfoPanel() {
  const { batchFiles, batchInfos, inputInfo, outputInfo } = usePDFStore();
  const totalBatchPages = batchInfos.reduce(
    (sum, info) => sum + (info?.pageCount || 0),
    0,
  );
  const totalBatchSize = batchFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <Panel title="Info">
      {inputInfo ? (
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] text-xs">
          {[
            ["Pages", String(inputInfo.pageCount)],
            ["Size", formatBytes(inputInfo.fileSize)],
            ["Version", inputInfo.pdfVersion ? `PDF ${inputInfo.pdfVersion}` : "Unknown"],
            ["Encrypted", inputInfo.isEncrypted ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div className="bg-[var(--surface-2)] p-3" key={label}>
              <dt className="font-mono text-[var(--muted)]">{label}</dt>
              <dd className="mt-1 font-semibold text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : batchFiles.length > 0 ? (
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] text-xs">
          {[
            ["Files", String(batchFiles.length)],
            ["Total size", formatBytes(totalBatchSize)],
            ["Known pages", String(totalBatchPages)],
            ["Ready", `${batchInfos.filter(Boolean).length}/${batchFiles.length}`],
          ].map(([label, value]) => (
            <div className="bg-[var(--surface-2)] p-3" key={label}>
              <dt className="font-mono text-[var(--muted)]">{label}</dt>
              <dd className="mt-1 font-semibold text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          PDF details appear after upload.
        </p>
      )}
      {outputInfo ? (
        <p className="font-mono text-xs text-[var(--success)]">
          Output: {outputInfo.pageCount} pages / {formatBytes(outputInfo.fileSize)}
        </p>
      ) : null}
    </Panel>
  );
}

export function PDFToolActions({
  children,
  disabled = false,
  downloadName,
  outputBlob,
  outputBatch,
  processLabel = "Process PDF",
  onProcess,
}: {
  children?: ReactNode;
  disabled?: boolean;
  downloadName: string;
  outputBlob: Blob | null;
  outputBatch: { blob: Blob; name: string }[];
  processLabel?: string;
  onProcess: () => void;
}) {
  const { currentStep, error, isProcessing, progress } = usePDFStore();

  return (
    <Panel title="Export">
      {children}
      {isProcessing ? (
        <div className="space-y-2">
          <div className="h-2 bg-[var(--surface-2)]">
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{ width: `${clamp(progress || 8, 0, 100)}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[var(--muted)]">
            {currentStep || "Processing your PDF..."}
            {progress > 0 ? ` ${Math.round(progress)}%` : ""}
          </p>
        </div>
      ) : null}
      {error ? (
        <p className="border border-[var(--danger)] p-3 text-sm leading-6 text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      <button
        className="button-primary w-full"
        disabled={disabled || isProcessing}
        type="button"
        onClick={onProcess}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        {processLabel}
      </button>
      <DownloadButton
        batchBlobs={outputBatch}
        blob={outputBlob}
        filename={downloadName}
      />
    </Panel>
  );
}

export function PDFToolFrame({
  slug,
  controls,
  preview,
}: {
  slug: PDFToolSlug;
  controls: ReactNode;
  preview: ReactNode;
}) {
  const tool = pdfToolConfigs[slug];

  return (
    <main className="w-full max-w-full overflow-hidden bg-[var(--bg)] lg:min-h-[calc(100vh-64px)]">
      <section className="overflow-hidden bg-[var(--bg)]">
        <div className="mx-auto flex w-[min(358px,calc(100vw-2rem))] max-w-7xl flex-col gap-4 px-0 py-5 sm:w-full sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
              href="/pdf-tools"
            >
              <ArrowLeft className="h-4 w-4" />
              PDF tools
            </Link>
            <h1 className="break-words font-display text-3xl font-extrabold text-[var(--text)] sm:text-5xl">
              {tool.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              {tool.description}
            </p>
          </div>
          <div className="self-start rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)] lg:self-auto">
            Browser only
          </div>
        </div>
      </section>

      <AdSlot
        className="pb-5"
        format="horizontal"
        minHeight={90}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_TOP}
      />

      <section className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-5 overflow-hidden px-0 pb-10 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="mx-auto w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full overflow-visible rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:mx-0 sm:w-full lg:min-h-[calc(100vh-238px)] lg:overflow-hidden">
          {controls}
        </aside>
        <div className="mx-auto min-h-[320px] w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full rounded-2xl border border-[var(--border)] bg-white shadow-sm sm:mx-0 sm:w-full sm:min-h-[560px]">
          {preview}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-x border-t border-[var(--border)] bg-[var(--surface)] px-4 py-8 sm:px-6">
        <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
          Questions
        </h2>
        <div className="mt-5 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
          {[
            ["Are my PDFs uploaded?", "No. The PDF tools run in your browser and files stay on your device."],
            ["Is this free?", "Yes. You can use these PDF tools without an account."],
            ["Can password tools bypass security?", "No. Protection can add a password, and unlocking requires the current known password."],
          ].map(([question, answer]) => (
            <article className="bg-[var(--surface-2)] p-5" key={question}>
              <h3 className="font-display text-sm font-bold text-[var(--text)]">
                {question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
