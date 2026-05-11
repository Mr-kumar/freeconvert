"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Info,
  Trash2,
} from "lucide-react";
import { RawImage } from "@/components/RawImage";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import {
  PDFToolActions,
  PDFToolFrame,
} from "@/components/pdf/shared";
import type {
  PageNumberOptions,
  PDFPosition,
  PDFToolSlug,
} from "@/lib/types";
import { clamp, formatBytes } from "@/lib/utils";
import { usePDFStore } from "@/store/usePDFStore";

export function ensurePDFName(value: string, fallback: string) {
  const trimmed = value.trim() || fallback;
  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}

export function ensureZipName(value: string, fallback: string) {
  const trimmed = value.trim() || fallback;
  return trimmed.toLowerCase().endsWith(".zip") ? trimmed : `${trimmed}.zip`;
}

export function baseName(fileName: string | undefined, fallback: string) {
  return (fileName || fallback).replace(/\.[^/.]+$/, "") || fallback;
}

export function pagePatternName(
  pattern: string,
  page: number,
  index: number,
  extension: string,
) {
  const cleanPattern = pattern.trim() || "page-{n}";
  const name = cleanPattern
    .replace(/\{n\}/g, String(page))
    .replace(/\{index\}/g, String(index + 1));

  return `${name.replace(/\.[^/.]+$/, "")}.${extension}`;
}

export const positionOptions: { label: string; value: PDFPosition }[] = [
  { label: "Top left", value: "top-left" },
  { label: "Top center", value: "top-center" },
  { label: "Top right", value: "top-right" },
  { label: "Middle left", value: "middle-left" },
  { label: "Center", value: "center" },
  { label: "Middle right", value: "middle-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom center", value: "bottom-center" },
  { label: "Bottom right", value: "bottom-right" },
];

export const pageNumberPositions: PageNumberOptions["position"][] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function positionToPercent(position: PDFPosition) {
  const x = position.endsWith("left")
    ? 18
    : position.endsWith("right")
      ? 82
      : 50;
  const y = position.startsWith("top")
    ? 18
    : position.startsWith("bottom")
      ? 82
      : 50;

  return { x, y };
}

export function ObjectUrlImage({
  alt,
  blob,
  className,
  style,
}: {
  alt: string;
  blob: Blob;
  className?: string;
  style?: CSSProperties;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const image = imageRef.current;

    if (image) {
      image.src = url;
    }

    return () => {
      if (image?.src === url) {
        image.removeAttribute("src");
      }
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return <RawImage ref={imageRef} alt={alt} className={className} style={style} />;
}

export function OutputBatchPreview({
  items,
  title,
}: {
  items: { blob: Blob; name: string }[];
  title: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[var(--text)]">{title}</h2>
        <p className="text-xs font-semibold text-[var(--muted)]">
          {items.length} file{items.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 12).map((item, index) => (
          <div
            className="overflow-hidden rounded-lg border border-[var(--border)] bg-white"
            key={`${item.name}-${index}`}
          >
            {item.blob.type.startsWith("image/") ? (
              <ObjectUrlImage
                alt={item.name}
                blob={item.blob}
                className="h-36 w-full object-contain bg-[var(--surface-2)]"
              />
            ) : null}
            <div className="p-3">
              <p className="truncate text-xs font-bold text-[var(--text)]">
                {item.name}
              </p>
              <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                {formatBytes(item.blob.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatermarkLivePreview({
  imageFile,
  opacity,
  pageThumbnail,
  rotation,
  scale,
  text,
  textColor,
  textSize,
  type,
  x,
  y,
  onChange,
}: {
  imageFile: File | null;
  opacity: number;
  pageThumbnail?: string;
  rotation: number;
  scale: number;
  text: string;
  textColor: string;
  textSize: number;
  type: "text" | "image";
  x: number;
  y: number;
  onChange: (next: { x: number; y: number }) => void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function updateFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = previewRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    onChange({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[var(--text)]">Live placement</h2>
        <p className="text-xs font-semibold text-[var(--muted)]">Drag watermark</p>
      </div>
      <div
        ref={previewRef}
        className="relative mx-auto aspect-[3/4] max-h-[440px] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-white touch-none"
        onPointerDown={(event) => {
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (dragging) {
            updateFromPointer(event);
          }
        }}
        onPointerUp={() => setDragging(false)}
      >
        {pageThumbnail ? (
          <RawImage
            alt="PDF page preview"
            className="h-full w-full object-contain"
            src={pageThumbnail}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-[var(--muted)]">
            Upload a PDF to preview placement.
          </div>
        )}
        <div
          className="absolute max-w-[85%] select-none"
          style={{
            left: `${x}%`,
            opacity: opacity / 100,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          {type === "image" && imageFile ? (
            <ObjectUrlImage
              alt="Watermark"
              blob={imageFile}
              className="max-w-none"
              style={{ width: `${clamp(scale, 5, 80) * 2}px` }}
            />
          ) : (
            <span
              className="block whitespace-nowrap font-extrabold"
              style={{
                color: textColor,
                fontSize: `${clamp(textSize / 2, 12, 56)}px`,
              }}
            >
              {text || "CONFIDENTIAL"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function BatchList({ imageMode = false }: { imageMode?: boolean }) {
  const {
    batchFiles,
    batchInfos,
    removeBatchFile,
    reorderBatchFiles,
  } = usePDFStore();

  if (!batchFiles.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
      {batchFiles.map((file, index) => (
        <div
          className="flex items-center gap-2 border-b border-[var(--border)] p-2 last:border-b-0"
          key={`${file.name}-${file.lastModified}-${index}`}
        >
          <FileText className="h-4 w-4 shrink-0 text-[var(--accent)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[var(--text)]">
              {file.name}
            </p>
            <p className="font-mono text-[10px] text-[var(--muted)]">
              {formatBytes(file.size)}
              {!imageMode && batchInfos[index]?.pageCount
                ? ` / ${batchInfos[index]?.pageCount} pages`
                : ""}
            </p>
          </div>
          <button
            aria-label="Move up"
            className="icon-button"
            disabled={index === 0}
            type="button"
            onClick={() => reorderBatchFiles(index, index - 1)}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            aria-label="Move down"
            className="icon-button"
            disabled={index === batchFiles.length - 1}
            type="button"
            onClick={() => reorderBatchFiles(index, index + 1)}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            aria-label="Remove"
            className="icon-button"
            type="button"
            onClick={() => removeBatchFile(index)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function MetadataTable() {
  const { inputInfo } = usePDFStore();

  if (!inputInfo) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Upload a PDF to view document and page metadata.
      </p>
    );
  }

  const rows = [
    ["File name", inputInfo.fileName],
    ["File size", formatBytes(inputInfo.fileSize)],
    ["PDF version", inputInfo.pdfVersion ? `PDF ${inputInfo.pdfVersion}` : "Unknown"],
    ["Page count", String(inputInfo.pageCount)],
    ["Encrypted", inputInfo.isEncrypted ? "Yes" : "No"],
    ["Linearized", inputInfo.isLinearized ? "Yes" : "No"],
    ["Title", inputInfo.title || "-"],
    ["Author", inputInfo.author || "-"],
    ["Subject", inputInfo.subject || "-"],
    ["Keywords", inputInfo.keywords || "-"],
    ["Creator", inputInfo.creator || "-"],
    ["Producer", inputInfo.producer || "-"],
    ["Created", inputInfo.creationDate?.toLocaleString() || "-"],
    ["Modified", inputInfo.modificationDate?.toLocaleString() || "-"],
  ];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        {rows.map(([label, value]) => (
          <div
            className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-[var(--border)] bg-white p-3 text-xs last:border-b-0"
            key={label}
          >
            <dt className="font-bold text-[var(--muted)]">{label}</dt>
            <dd className="min-w-0 break-words font-semibold text-[var(--text)]">
              {value}
            </dd>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              {["Page", "Width", "Height", "Size", "Rotation", "Orientation"].map(
                (heading) => (
                  <th className="px-3 py-2 font-bold" key={heading}>
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {inputInfo.pages.map((page) => (
              <tr className="border-t border-[var(--border)]" key={page.pageNumber}>
                <td className="px-3 py-2 font-semibold">{page.pageNumber}</td>
                <td className="px-3 py-2">{Math.round(page.width)} pt</td>
                <td className="px-3 py-2">{Math.round(page.height)} pt</td>
                <td className="px-3 py-2">{page.sizeName || "Custom"}</td>
                <td className="px-3 py-2">{page.rotation} deg</td>
                <td className="px-3 py-2">{page.orientation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SelectablePagePreview() {
  const {
    pageThumbnails,
    selectedPages,
    setSelectedPages,
    totalPages,
  } = usePDFStore();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PDFPageGrid
        selectedPages={selectedPages}
        thumbnails={pageThumbnails}
        totalPages={totalPages}
        onSelectedPagesChange={setSelectedPages}
      />
    </div>
  );
}

export function PDFToolShell({
  controls,
  downloadName,
  outputBatch,
  outputBlob,
  preview,
  processLabel = "Process PDF",
  slug,
  onProcess,
}: {
  controls: ReactNode;
  downloadName: string;
  outputBatch?: { blob: Blob; name: string }[];
  outputBlob: Blob | null;
  preview: ReactNode;
  processLabel?: string;
  slug: PDFToolSlug;
  onProcess: () => void;
}) {
  return (
    <PDFToolFrame
      controls={(
        <>
          {controls}
          <PDFToolActions
            downloadName={downloadName}
            outputBatch={outputBatch || []}
            outputBlob={outputBlob}
            processLabel={processLabel}
            onProcess={onProcess}
          />
        </>
      )}
      preview={preview}
      slug={slug}
    />
  );
}

export function MetadataPreview() {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-lg font-extrabold text-[var(--text)]">
          Document details
        </h2>
      </div>
      <MetadataTable />
    </div>
  );
}
