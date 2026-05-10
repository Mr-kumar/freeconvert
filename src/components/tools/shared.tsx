"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Loader2, Wand2 } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import { ImageUploader } from "@/components/ImageUploader";
import { ToolLayout } from "@/components/ToolLayout";
import { toolConfigs } from "@/lib/tools";
import type { ImageFormat, ToolSlug } from "@/lib/types";
import {
  clamp,
  cn,
  formatBytes,
  getExtensionFromMime,
  isImageFormat,
  replaceFileExtension,
  shortFormat,
} from "@/lib/utils";
import { useImageStore } from "@/store/useImageStore";

export function asFormat(value: unknown, fallback: ImageFormat = "image/jpeg") {
  return typeof value === "string" && isImageFormat(value) ? value : fallback;
}

export function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
}

export function useAvifSupport() {
  const [avifSupported, setAvifSupported] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let frame: number | undefined;

    import("@/lib/imageProcessor")
      .then(({ supportsAvifExport }) => {
        if (cancelled) {
          return;
        }

        frame = requestAnimationFrame(() => {
          setAvifSupported(supportsAvifExport());
        });
      })
      .catch(() => {
        if (!cancelled) {
          setAvifSupported(false);
        }
      });

    return () => {
      cancelled = true;
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return avifSupported;
}

export function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden border-b border-[var(--border)] p-4">
      <h2 className="mb-4 text-sm font-bold text-[var(--accent)]">
        {title}
      </h2>
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
  allowEmpty = false,
  label,
  value,
  min = 0,
  max,
  step,
  onChange,
}: {
  allowEmpty?: false;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number | string;
  onChange: (value: number) => void;
} | {
  allowEmpty: true;
  label: string;
  value: number | "";
  min?: number;
  max?: number;
  step?: number | string;
  onChange: (value: number | "") => void;
}) {
  const emitChange = onChange as (value: number | "") => void;

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
          const nextValue = event.target.value;

          if (nextValue === "") {
            emitChange(allowEmpty ? "" : 0);
            return;
          }

          const parsed = Number(nextValue);

          if (Number.isFinite(parsed)) {
            emitChange(parsed);
          }
        }}
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

const formatOptions: ImageFormat[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function FormatControl({
  value,
  onChange,
  includeAvif = true,
}: {
  value: ImageFormat;
  onChange: (value: ImageFormat) => void;
  includeAvif?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="field-label">Output format</p>
      <div className="grid grid-cols-2 gap-2">
        {formatOptions
          .filter((format) => includeAvif || format !== "image/avif")
          .map((format) => (
            <ToggleButton
              active={value === format}
              key={format}
              onClick={() => onChange(format)}
            >
              {shortFormat(format)}
            </ToggleButton>
          ))}
      </div>
    </div>
  );
}

export function InfoPanel() {
  const { inputInfo, outputInfo } = useImageStore();

  return (
    <Panel title="Info">
      {inputInfo ? (
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] text-xs">
          {[
            ["Dimensions", `${inputInfo.width} x ${inputInfo.height}`],
            ["Size", formatBytes(inputInfo.fileSize)],
            ["Aspect", inputInfo.aspectRatio],
            ["Megapixels", `${inputInfo.megapixels} MP`],
          ].map(([label, value]) => (
            <div className="bg-[var(--surface-2)] p-3" key={label}>
              <dt className="font-mono text-[var(--muted)]">{label}</dt>
              <dd className="mt-1 font-semibold text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-[var(--muted)]">Image details appear after upload.</p>
      )}
      {outputInfo ? (
        <p className="font-mono text-xs text-[var(--success)]">
          Output: {outputInfo.width} x {outputInfo.height} /{" "}
          {formatBytes(outputInfo.fileSize)}
        </p>
      ) : null}
    </Panel>
  );
}

export function FaqFooter({ slug }: { slug: ToolSlug }) {
  const tool = toolConfigs[slug];

  return (
    <section className="mx-auto max-w-7xl border-x border-t border-[var(--border)] bg-[var(--surface)] px-4 py-8 sm:px-6">
      <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
        Questions
      </h2>
      <div className="mt-5 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
        {[
          ["Is FreeConvert free?", "Yes. You can use the image tools without an account."],
          [
            "Are my images uploaded?",
            "No. Processing happens in your browser and your files stay on your device.",
          ],
          [
            "What does this tool support?",
            `${tool.name} supports common browser image formats such as JPEG, PNG, WebP and AVIF where available.`,
          ],
        ].map(([question, answer]) => (
          <article className="bg-[var(--surface-2)] p-5" key={question}>
            <h3 className="font-display text-sm font-bold text-[var(--text)]">
              {question}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ToolFrame({
  slug,
  controls,
  preview,
}: {
  slug: ToolSlug;
  controls: ReactNode;
  preview: ReactNode;
}) {
  const tool = toolConfigs[slug];

  return (
    <ToolLayout
      controls={controls}
      description={tool.description}
      footer={<FaqFooter slug={slug} />}
      preview={preview}
      title={tool.name}
    />
  );
}

export function UploadPanel({ multiple = false }: { multiple?: boolean }) {
  return (
    <Panel title={multiple ? "Images" : "Image"}>
      <ImageUploader multiple={multiple} />
    </Panel>
  );
}

export function ToolActions({
  children,
  disabled = false,
  downloadName,
  outputBlob,
  processLabel = "Process image",
  onProcess,
}: {
  children?: ReactNode;
  disabled?: boolean;
  downloadName: string;
  outputBlob: Blob | null;
  processLabel?: string;
  onProcess: () => void;
}) {
  const { error, isProcessing, progress } = useImageStore();

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
            Processing your image... {progress > 0 ? `${Math.round(progress)}%` : ""}
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
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        {processLabel}
      </button>
      <DownloadButton blob={outputBlob} filename={downloadName} />
    </Panel>
  );
}

export function AvifWarning({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <p className="flex gap-2 border border-[var(--warning)] p-3 text-xs leading-5 text-[var(--warning)]">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      AVIF export is not available in this browser.
    </p>
  );
}

export function outputName(fileName: string | undefined, format: ImageFormat) {
  return replaceFileExtension(fileName || "freeconvert-output.png", format);
}

export function extensionFromFormat(format: ImageFormat) {
  return getExtensionFromMime(format);
}
