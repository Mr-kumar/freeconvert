"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Info,
  RotateCcw,
  RotateCw,
  Trash2,
} from "lucide-react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  asPDFNumber,
  asPDFString,
  NumberControl,
  Panel,
  PDFInfoPanel,
  PDFToolActions,
  PDFToolFrame,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type {
  ImageToPDFOptions,
  PageNumberOptions,
  PDFOrientation,
  PDFPageSize,
  PDFPosition,
  PDFToolSlug,
  ToolDefaults,
} from "@/lib/types";
import { clamp, formatBytes } from "@/lib/utils";
import { usePDFStore } from "@/store/usePDFStore";

function ensurePDFName(value: string, fallback: string) {
  const trimmed = value.trim() || fallback;
  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}

function ensureZipName(value: string, fallback: string) {
  const trimmed = value.trim() || fallback;
  return trimmed.toLowerCase().endsWith(".zip") ? trimmed : `${trimmed}.zip`;
}

function baseName(fileName: string | undefined, fallback: string) {
  return (fileName || fallback).replace(/\.[^/.]+$/, "") || fallback;
}

function pagePatternName(
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

const positionOptions: { label: string; value: PDFPosition }[] = [
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

const pageNumberPositions: PageNumberOptions["position"][] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function positionToPercent(position: PDFPosition) {
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

function OutputBatchPreview({
  items,
  title,
}: {
  items: { blob: Blob; name: string }[];
  title: string;
}) {
  const urls = useMemo(
    () => items.map((item) => URL.createObjectURL(item.blob)),
    [items],
  );

  useEffect(() => {
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [urls]);

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
            {item.blob.type.startsWith("image/") && urls[index] ? (
              <img
                alt={item.name}
                className="h-36 w-full object-contain bg-[var(--surface-2)]"
                src={urls[index]}
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

function WatermarkLivePreview({
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
  const imageUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

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
          <img
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
          {type === "image" && imageUrl ? (
            <img
              alt="Watermark"
              className="max-w-none"
              src={imageUrl}
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

function BatchList({ imageMode = false }: { imageMode?: boolean }) {
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

function MetadataTable() {
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
                <td className="px-3 py-2">{page.rotation}°</td>
                <td className="px-3 py-2">{page.orientation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PDFToolClient({
  slug,
  defaults,
}: {
  slug: PDFToolSlug;
  defaults: ToolDefaults;
}) {
  const {
    batchFiles,
    clearOutput,
    inputFile,
    inputInfo,
    outputBatch,
    outputBlob,
    pageOrder,
    pageThumbnails,
    selectedPages,
    setCurrentStep,
    setError,
    setOutputBatch,
    setOutputBlob,
    setPageOrder,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();

  const [outputName, setOutputName] = useState(() =>
    ensurePDFName(`freeconvert-${slug}`, `freeconvert-${slug}.pdf`),
  );
  const [addBlankPage, setAddBlankPage] = useState(false);
  const [compressMerged, setCompressMerged] = useState(false);
  const [mergeTargetSizeKB, setMergeTargetSizeKB] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(
    asPDFString(defaults.quality, "medium"),
  );
  const [targetSizeKB, setTargetSizeKB] = useState(
    asPDFNumber(defaults.targetSizeKB, 0),
  );
  const [customImageQuality, setCustomImageQuality] = useState(
    asPDFNumber(defaults.imageQuality, 60),
  );
  const [targetDPI, setTargetDPI] = useState(asPDFNumber(defaults.dpi, 96));
  const [splitMode, setSplitMode] = useState(asPDFString(defaults.mode, "every-page"));
  const [fixedRange, setFixedRange] = useState(asPDFNumber(defaults.fixedRange, 1));
  const [rangeText, setRangeText] = useState("");
  const [imageFormat, setImageFormat] = useState(
    asPDFString(defaults.format, "jpeg") as "jpeg" | "png" | "webp",
  );
  const [imageQuality, setImageQuality] = useState(asPDFNumber(defaults.quality, 90));
  const [imageDPI, setImageDPI] = useState(asPDFNumber(defaults.dpi, 150));
  const [imageScale, setImageScale] = useState(1);
  const [imagePattern, setImagePattern] = useState("page-{n}");
  const [pageSize, setPageSize] = useState<PDFPageSize>(
    asPDFString(defaults.pageSize, "A4") as PDFPageSize,
  );
  const [orientation, setOrientation] = useState<PDFOrientation>(
    asPDFString(defaults.orientation, "portrait") as PDFOrientation,
  );
  const [margin, setMargin] = useState(asPDFNumber(defaults.margin, 10));
  const [imageFit, setImageFit] = useState<ImageToPDFOptions["imageFit"]>(
    asPDFString(defaults.fit, "contain") as ImageToPDFOptions["imageFit"],
  );
  const [imageAlign, setImageAlign] = useState<PDFPosition>("center");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [metadataTitle, setMetadataTitle] = useState("");
  const [metadataAuthor, setMetadataAuthor] = useState("");
  const [metadataSubject, setMetadataSubject] = useState("");
  const [metadataKeywords, setMetadataKeywords] = useState("");
  const [rotationDegrees, setRotationDegrees] = useState<90 | 180 | 270>(
    asPDFNumber(defaults.degrees, 90) === 180
      ? 180
      : asPDFNumber(defaults.degrees, 90) === 270
        ? 270
        : 90,
  );
  const [previewRotations, setPreviewRotations] = useState<Record<number, number>>({});
  const [watermarkType, setWatermarkType] = useState<"text" | "image">(
    asPDFString(defaults.type, "text") === "image" ? "image" : "text",
  );
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("#e5322d");
  const [watermarkOpacity, setWatermarkOpacity] = useState(
    asPDFNumber(defaults.opacity, 30),
  );
  const [watermarkRotation, setWatermarkRotation] = useState(-35);
  const [watermarkPosition, setWatermarkPosition] = useState<PDFPosition>(
    asPDFString(defaults.position, "center") as PDFPosition,
  );
  const initialWatermarkPercent = positionToPercent(
    asPDFString(defaults.position, "center") as PDFPosition,
  );
  const [watermarkX, setWatermarkX] = useState(initialWatermarkPercent.x);
  const [watermarkY, setWatermarkY] = useState(initialWatermarkPercent.y);
  const [watermarkScale, setWatermarkScale] = useState(25);
  const [extractAsSingle, setExtractAsSingle] = useState(true);
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberOptions["position"]>(
    asPDFString(defaults.position, "bottom-center") as PageNumberOptions["position"],
  );
  const [numberFormat, setNumberFormat] = useState("Page {n}");
  const [numberStart, setNumberStart] = useState(asPDFNumber(defaults.start, 1));
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [pageNumberFontSize, setPageNumberFontSize] = useState(11);
  const [pageNumberColor, setPageNumberColor] = useState("#333333");
  const [pageNumberMargin, setPageNumberMargin] = useState(24);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowEditing, setAllowEditing] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState<128 | 256>(256);
  const [metadataAction, setMetadataAction] = useState<"strip" | "save">("strip");

  const activePages = useMemo(() => {
    if (!totalPages) {
      return [];
    }

    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);

  const downloadName = useMemo(() => {
    if (["split-pdf", "convert-pdf-to-image"].includes(slug)) {
      return ensureZipName(outputName, `freeconvert-${slug}.zip`);
    }

    if (slug === "extract-pdf-pages" && !extractAsSingle) {
      return ensureZipName(outputName, "extracted-pages.zip");
    }

    return ensurePDFName(outputName, `freeconvert-${slug}.pdf`);
  }, [extractAsSingle, outputName, slug]);

  function pageSelectionRange(nextValue: string, pages: number[]) {
    setRangeText(nextValue);
    setSelectedPages(pages);
  }

  function requirePDF() {
    if (!inputFile) {
      setError("Upload a PDF first.");
      return null;
    }

    return inputFile;
  }

  function requireSelectedPages() {
    if (!activePages.length) {
      setError("Select at least one page.");
      return null;
    }

    return activePages;
  }

  function progress(progress: number, step?: string) {
    setProgress(progress);
    if (step) {
      setCurrentStep(step);
    }
  }

  function updateWatermarkPosition(position: PDFPosition) {
    const next = positionToPercent(position);
    setWatermarkPosition(position);
    setWatermarkX(next.x);
    setWatermarkY(next.y);
  }

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (slug === "merge-pdf") {
        if (batchFiles.length < 2) {
          throw new Error("Add at least two PDF files to merge.");
        }

        const { mergePDFs } = await import("@/lib/pdfProcessor");
        let blob = await mergePDFs(batchFiles, {
          files: batchFiles,
          outputName: downloadName,
          addBlankPageBetween: addBlankPage,
        });
        progress(35, "Merged PDF created.");

        if (compressMerged || mergeTargetSizeKB > 0) {
          const { compressPDF } = await import("@/lib/pdfProcessor");
          const mergedFile = new File([blob], downloadName, {
            type: "application/pdf",
            lastModified: Date.now(),
          });
          blob = await compressPDF(
            mergedFile,
            {
              quality: "medium",
              imageQuality: 0.62,
              customQuality: 0.62,
              downsampleImages: true,
              targetDPI: 96,
              targetSizeKB: mergeTargetSizeKB > 0 ? mergeTargetSizeKB : undefined,
            },
            (nextProgress, step) => progress(35 + nextProgress * 0.6, step),
          );
        }

        setOutputBlob(blob, downloadName);
        progress(100, "Merged PDF ready.");
        return;
      }

      if (slug === "convert-image-to-pdf") {
        if (!batchFiles.length) {
          throw new Error("Add at least one image.");
        }

        const { imagesToPDF } = await import("@/lib/pdfProcessor");
        const blob = await imagesToPDF(batchFiles, {
          pageSize,
          orientation,
          margin,
          imageFit,
          imageAlign,
          backgroundColor,
          oneImagePerPage: true,
          title: metadataTitle,
          author: metadataAuthor,
          subject: metadataSubject,
          keywords: metadataKeywords,
        });
        setOutputBlob(blob, downloadName);
        progress(100, "PDF ready.");
        return;
      }

      const file = requirePDF();
      if (!file) {
        return;
      }

      if (slug === "compress-pdf") {
        const level = compressionLevel as "low" | "medium" | "high" | "custom";
        const qualityMap = {
          low: 0.42,
          medium: 0.62,
          high: 0.82,
          custom: customImageQuality / 100,
        };
        const dpiMap = {
          low: 72,
          medium: 96,
          high: 150,
          custom: targetDPI,
        };
        const { compressPDF } = await import("@/lib/pdfProcessor");
        const blob = await compressPDF(
          file,
          {
            quality: level,
            imageQuality: qualityMap[level],
            customQuality: customImageQuality / 100,
            downsampleImages: true,
            targetDPI: dpiMap[level] as 72 | 96 | 150 | 300,
            targetSizeKB: targetSizeKB > 0 ? targetSizeKB : undefined,
          },
          progress,
        );
        setOutputBlob(blob, downloadName);
        return;
      }

      if (slug === "split-pdf") {
        const { splitPDF } = await import("@/lib/pdfProcessor");
        const blobs = await splitPDF(file, {
          mode: splitMode as "every-page" | "fixed-range" | "custom-ranges",
          fixedRange,
          customRanges: rangeText,
          outputNamePattern: outputName,
        });
        const rootName = baseName(file.name, "split");
        setOutputBatch(
          blobs.map((blob, index) => ({
            blob,
            name: `${rootName}-part-${index + 1}.pdf`,
          })),
        );
        progress(100, "Split files ready.");
        return;
      }

      if (slug === "convert-pdf-to-image") {
        const pages = requireSelectedPages();
        if (!pages) {
          return;
        }

        const { pdfToImages } = await import("@/lib/pdfProcessor");
        const blobs = await pdfToImages(
          file,
          {
            format: imageFormat,
            quality: imageQuality / 100,
            dpi: imageDPI as 72 | 96 | 150 | 300 | 600,
            pages,
            scale: imageScale,
            outputNamePattern: imagePattern,
          },
          progress,
        );
        const extension = imageFormat === "jpeg" ? "jpg" : imageFormat;
        setOutputBatch(
          blobs.map((blob, index) => ({
            blob,
            name: pagePatternName(imagePattern, pages[index] || index + 1, index, extension),
          })),
        );
        return;
      }

      if (slug === "rotate-pdf") {
        const pages = requireSelectedPages();
        if (!pages) {
          return;
        }

        const { rotatePDF } = await import("@/lib/pdfProcessor");
        const blob = await rotatePDF(file, {
          pages,
          degrees: rotationDegrees,
        });
        setOutputBlob(blob, downloadName);
        setPreviewRotations((state) => {
          const next = { ...state };
          pages.forEach((page) => {
            next[page] = ((next[page] || 0) + rotationDegrees) % 360;
          });
          return next;
        });
        progress(100, "Rotated PDF ready.");
        return;
      }

      if (slug === "add-watermark-to-pdf") {
        const pages = requireSelectedPages();
        if (!pages) {
          return;
        }

        if (watermarkType === "image" && !watermarkImage) {
          throw new Error("Upload a watermark image first.");
        }

        const { addWatermarkToPDF } = await import("@/lib/pdfProcessor");
        const blob = await addWatermarkToPDF(file, {
          type: watermarkType,
          text: watermarkText,
          watermarkFile: watermarkImage || undefined,
          imageScale: watermarkScale / 100,
          fontSize: watermarkFontSize,
          fontFamily: "Helvetica",
          fontColor: watermarkColor,
          pages,
          position: watermarkPosition,
          customXPercent: watermarkX,
          customYPercent: watermarkY,
          opacity: watermarkOpacity / 100,
          rotation: watermarkRotation,
          layer: "above",
        });
        setOutputBlob(blob, downloadName);
        progress(100, "Watermarked PDF ready.");
        return;
      }

      if (slug === "extract-pdf-pages") {
        const pages = requireSelectedPages();
        if (!pages) {
          return;
        }

        const { extractPages } = await import("@/lib/pdfProcessor");
        const result = await extractPages(file, {
          pages,
          outputNamePattern: outputName,
          asSingleFile: extractAsSingle,
        });

        if (Array.isArray(result)) {
          const rootName = baseName(file.name, "extracted");
          setOutputBatch(
            result.map((blob, index) => ({
              blob,
              name: `${rootName}-page-${pages[index]}.pdf`,
            })),
          );
        } else {
          setOutputBlob(result, downloadName);
        }

        progress(100, "Extracted pages ready.");
        return;
      }

      if (slug === "reorder-pdf-pages") {
        const order = pageOrder.length
          ? pageOrder
          : Array.from({ length: totalPages }, (_, index) => index + 1);
        const { reorderPages } = await import("@/lib/pdfProcessor");
        const blob = await reorderPages(file, order);
        setOutputBlob(blob, downloadName);
        progress(100, "Reordered PDF ready.");
        return;
      }

      if (slug === "add-page-numbers-to-pdf") {
        const pages = requireSelectedPages();
        if (!pages) {
          return;
        }

        const prefix = numberFormat.includes("{n}")
          ? numberFormat.split("{n}")[0]
          : "";
        const suffix = numberFormat.includes("{n}")
          ? numberFormat.split("{n}").slice(1).join("{n}")
          : numberFormat === "1 of {total}"
            ? " of {total}"
            : "";
        const { addPageNumbers } = await import("@/lib/pdfProcessor");
        const blob = await addPageNumbers(
          file,
          {
            pages,
            position: pageNumberPosition,
            startFrom: numberStart,
            prefix,
            suffix,
            fontSize: pageNumberFontSize,
            fontColor: pageNumberColor,
            fontFamily: "Helvetica",
            margin: pageNumberMargin,
            skipFirstPage,
          },
          progress,
        );
        setOutputBlob(blob, downloadName);
        return;
      }

      if (slug === "view-pdf-metadata") {
        const { stripPDFMetadata, updatePDFMetadata } = await import("@/lib/pdfProcessor");
        const blob =
          metadataAction === "strip"
            ? await stripPDFMetadata(file)
            : await updatePDFMetadata(file, {
                title: metadataTitle,
                author: metadataAuthor,
              });
        setOutputBlob(blob, downloadName);
        progress(100, "Metadata PDF ready.");
        return;
      }

      if (slug === "protect-pdf") {
        if (!password || password !== confirmPassword) {
          throw new Error("Enter and confirm the same password.");
        }

        const { protectPDF } = await import("@/lib/pdfProcessor");
        const blob = await protectPDF(
          file,
          {
            userPassword: password,
            allowPrinting,
            allowCopying,
            allowEditing,
            encryptionLevel,
          },
          progress,
        );
        setOutputBlob(blob, downloadName);
        return;
      }

      if (slug === "unlock-pdf") {
        const { unlockPDF } = await import("@/lib/pdfProcessor");
        const blob = await unlockPDF(file, password, progress);
        setOutputBlob(blob, downloadName);
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  function copyMetadataJSON() {
    if (!inputInfo) {
      setError("Upload a PDF first.");
      return;
    }

    navigator.clipboard
      .writeText(JSON.stringify(inputInfo, null, 2))
      .then(() => setCurrentStep("Metadata copied."))
      .catch(() => setError("Could not copy metadata."));
  }

  function controls() {
    if (slug === "merge-pdf") {
      return (
        <>
          <Panel title="PDF files">
            <PDFUploader kind="pdf" label="Add PDFs" multiple />
            <BatchList />
          </Panel>
          <Panel title="Options">
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
            <ToggleButton active={addBlankPage} onClick={() => setAddBlankPage(!addBlankPage)}>
              Add blank page between files
            </ToggleButton>
            <ToggleButton active={compressMerged} onClick={() => setCompressMerged(!compressMerged)}>
              Compress after merge
            </ToggleButton>
            {compressMerged ? (
              <>
                <NumberControl
                  label="Target size (KB)"
                  max={512000}
                  min={0}
                  step={10}
                  value={mergeTargetSizeKB}
                  onChange={setMergeTargetSizeKB}
                />
                <p className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
                  Target size is best effort. Very long or scanned PDFs may not
                  reach a very small KB value without visible quality loss.
                </p>
              </>
            ) : null}
          </Panel>
          <PDFInfoPanel />
        </>
      );
    }

    if (slug === "convert-image-to-pdf") {
      return (
        <>
          <Panel title="Images">
            <PDFUploader kind="image" label="Add images" multiple />
            <BatchList imageMode />
          </Panel>
          <Panel title="Page">
            <SelectControl
              label="Page size"
              options={[
                "A4",
                "A3",
                "A5",
                "Letter",
                "Legal",
                "Tabloid",
                "Match Image",
              ].map((value) => ({ label: value, value: value as PDFPageSize }))}
              value={pageSize}
              onChange={setPageSize}
            />
            <div className="grid grid-cols-3 gap-2">
              {(["portrait", "landscape", "auto"] as PDFOrientation[]).map((value) => (
                <ToggleButton
                  active={orientation === value}
                  key={value}
                  onClick={() => setOrientation(value)}
                >
                  {value}
                </ToggleButton>
              ))}
            </div>
            <RangeControl label="Margin" max={50} min={0} suffix="mm" value={margin} onChange={setMargin} />
            <SelectControl
              label="Image fit"
              options={[
                { label: "Contain", value: "contain" },
                { label: "Cover", value: "cover" },
                { label: "Fill", value: "fill" },
                { label: "Actual size", value: "actual-size" },
              ]}
              value={imageFit}
              onChange={setImageFit}
            />
            <SelectControl
              label="Image alignment"
              options={positionOptions}
              value={imageAlign}
              onChange={setImageAlign}
            />
            <label className="field-label">
              Background
              <input
                className="field-input h-11"
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
              />
            </label>
          </Panel>
          <Panel title="Metadata">
            <TextControl label="Title" value={metadataTitle} onChange={setMetadataTitle} />
            <TextControl label="Author" value={metadataAuthor} onChange={setMetadataAuthor} />
            <TextControl label="Subject" value={metadataSubject} onChange={setMetadataSubject} />
            <TextControl label="Keywords" value={metadataKeywords} onChange={setMetadataKeywords} />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        </>
      );
    }

    return (
      <>
        <Panel title="PDF">
          <PDFUploader kind="pdf" label="Add PDF" />
        </Panel>
        {slug === "compress-pdf" ? (
          <Panel title="Compression">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["low", "Low"],
                ["medium", "Balanced"],
                ["high", "High"],
                ["custom", "Custom"],
              ].map(([value, label]) => (
                <ToggleButton
                  active={compressionLevel === value}
                  key={value}
                  onClick={() => setCompressionLevel(value)}
                >
                  {label}
                </ToggleButton>
              ))}
            </div>
            <NumberControl
              label="Target size (KB)"
              max={512000}
              min={0}
              step={10}
              value={targetSizeKB}
              onChange={setTargetSizeKB}
            />
            {compressionLevel === "custom" ? (
              <>
                <RangeControl label="Image quality" max={100} min={10} suffix="%" value={customImageQuality} onChange={setCustomImageQuality} />
                <SelectControl
                  label="Target DPI"
                  options={[72, 96, 150, 300].map((value) => ({
                    label: `${value} DPI`,
                    value: String(value),
                  }))}
                  value={String(targetDPI)}
                  onChange={(value) => setTargetDPI(Number(value))}
                />
              </>
            ) : null}
            <p className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
              Compression rasterizes PDF pages. Text in the compressed PDF may not be selectable. Target size is best effort.
            </p>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "split-pdf" ? (
          <Panel title="Split mode">
            <div className="grid grid-cols-1 gap-2">
              {[
                ["every-page", "Every page"],
                ["fixed-range", "By range size"],
                ["custom-ranges", "Custom ranges"],
              ].map(([value, label]) => (
                <ToggleButton
                  active={splitMode === value}
                  key={value}
                  onClick={() => setSplitMode(value)}
                >
                  {label}
                </ToggleButton>
              ))}
            </div>
            {splitMode === "fixed-range" ? (
              <NumberControl label="Pages per file" min={1} value={fixedRange} onChange={setFixedRange} />
            ) : null}
            {splitMode === "custom-ranges" ? (
              <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            ) : null}
            <TextControl label="ZIP file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "convert-pdf-to-image" ? (
          <Panel title="Images">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-3 gap-2">
              {(["jpeg", "png", "webp"] as const).map((value) => (
                <ToggleButton active={imageFormat === value} key={value} onClick={() => setImageFormat(value)}>
                  {value.toUpperCase()}
                </ToggleButton>
              ))}
            </div>
            {imageFormat !== "png" ? (
              <RangeControl label="Quality" max={100} min={10} suffix="%" value={imageQuality} onChange={setImageQuality} />
            ) : null}
            <SelectControl
              label="Resolution"
              options={[72, 96, 150, 300, 600].map((value) => ({
                label: `${value} DPI`,
                value: String(value),
              }))}
              value={String(imageDPI)}
              onChange={(value) => setImageDPI(Number(value))}
            />
            <SelectControl
              label="Scale"
              options={[1, 1.5, 2].map((value) => ({
                label: `${value}x`,
                value: String(value),
              }))}
              value={String(imageScale)}
              onChange={(value) => setImageScale(Number(value))}
            />
            <TextControl label="File name pattern" value={imagePattern} onChange={setImagePattern} />
          </Panel>
        ) : null}

        {slug === "rotate-pdf" ? (
          <Panel title="Rotate">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-3 gap-2">
              {([
                [90, "Right 90"],
                [180, "180"],
                [270, "Left 90"],
              ] as const).map(([value, label]) => (
                <ToggleButton active={rotationDegrees === value} key={value} onClick={() => setRotationDegrees(value)}>
                  {label}
                </ToggleButton>
              ))}
            </div>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "add-watermark-to-pdf" ? (
          <Panel title="Watermark">
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={watermarkType === "text"} onClick={() => setWatermarkType("text")}>
                Text
              </ToggleButton>
              <ToggleButton active={watermarkType === "image"} onClick={() => setWatermarkType("image")}>
                Image
              </ToggleButton>
            </div>
            {watermarkType === "text" ? (
              <>
                <TextControl label="Text" value={watermarkText} onChange={setWatermarkText} />
                <RangeControl label="Font size" max={160} min={10} suffix="pt" value={watermarkFontSize} onChange={setWatermarkFontSize} />
                <label className="field-label">
                  Color
                  <input className="field-input h-11" type="color" value={watermarkColor} onChange={(event) => setWatermarkColor(event.target.value)} />
                </label>
              </>
            ) : (
              <label className="field-label">
                Watermark image
                <input
                  className="field-input"
                  accept="image/png,image/jpeg"
                  type="file"
                  onChange={(event) => setWatermarkImage(event.target.files?.[0] || null)}
                />
              </label>
            )}
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <SelectControl label="Position" options={positionOptions} value={watermarkPosition} onChange={updateWatermarkPosition} />
            <div className="grid grid-cols-2 gap-3">
              <NumberControl
                label="X position (%)"
                max={100}
                min={0}
                value={Math.round(watermarkX)}
                onChange={setWatermarkX}
              />
              <NumberControl
                label="Y position (%)"
                max={100}
                min={0}
                value={Math.round(watermarkY)}
                onChange={setWatermarkY}
              />
            </div>
            <RangeControl label="Opacity" max={100} min={0} suffix="%" value={watermarkOpacity} onChange={setWatermarkOpacity} />
            <RangeControl label="Rotation" max={180} min={-180} suffix="°" value={watermarkRotation} onChange={setWatermarkRotation} />
            {watermarkType === "image" ? (
              <RangeControl label="Image scale" max={80} min={5} suffix="%" value={watermarkScale} onChange={setWatermarkScale} />
            ) : null}
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "extract-pdf-pages" ? (
          <Panel title="Extract">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={extractAsSingle} onClick={() => setExtractAsSingle(true)}>
                Single PDF
              </ToggleButton>
              <ToggleButton active={!extractAsSingle} onClick={() => setExtractAsSingle(false)}>
                Separate PDFs
              </ToggleButton>
            </div>
            <TextControl label={extractAsSingle ? "Output file name" : "ZIP file name"} value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "reorder-pdf-pages" ? (
          <Panel title="Order">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="segmented-button"
                type="button"
                onClick={() => setPageOrder([...pageOrder].reverse())}
              >
                <RotateCcw className="h-4 w-4" />
                Reverse
              </button>
              <button
                className="segmented-button"
                type="button"
                onClick={() => setPageOrder(Array.from({ length: totalPages }, (_, index) => index + 1))}
              >
                <RotateCw className="h-4 w-4" />
                Reset
              </button>
            </div>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "add-page-numbers-to-pdf" ? (
          <Panel title="Numbering">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <SelectControl
              label="Position"
              options={pageNumberPositions.map((value) => ({
                label: value.replace("-", " "),
                value,
              }))}
              value={pageNumberPosition}
              onChange={setPageNumberPosition}
            />
            <SelectControl
              label="Format"
              options={[
                { label: "1", value: "{n}" },
                { label: "Page 1", value: "Page {n}" },
                { label: "1 of total", value: "{n} of {total}" },
                { label: "- 1 -", value: "- {n} -" },
              ]}
              value={numberFormat}
              onChange={setNumberFormat}
            />
            <NumberControl label="Start from" min={0} value={numberStart} onChange={setNumberStart} />
            <ToggleButton active={skipFirstPage} onClick={() => setSkipFirstPage(!skipFirstPage)}>
              Skip first page
            </ToggleButton>
            <RangeControl label="Font size" max={24} min={6} suffix="pt" value={pageNumberFontSize} onChange={setPageNumberFontSize} />
            <RangeControl label="Margin" max={50} min={5} suffix="pt" value={pageNumberMargin} onChange={setPageNumberMargin} />
            <label className="field-label">
              Color
              <input className="field-input h-11" type="color" value={pageNumberColor} onChange={(event) => setPageNumberColor(event.target.value)} />
            </label>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "protect-pdf" ? (
          <Panel title="Password">
            <div className="relative">
              <TextControl
                label="Password to open"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
              />
              <button
                aria-label="Show password"
                className="icon-button absolute bottom-1 right-1"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <TextControl
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <SelectControl
              label="Encryption"
              options={[
                { label: "256-bit", value: "256" },
                { label: "128-bit", value: "128" },
              ]}
              value={String(encryptionLevel)}
              onChange={(value) => setEncryptionLevel(Number(value) as 128 | 256)}
            />
            <div className="grid grid-cols-1 gap-2">
              <ToggleButton active={allowPrinting} onClick={() => setAllowPrinting(!allowPrinting)}>
                Allow printing
              </ToggleButton>
              <ToggleButton active={allowCopying} onClick={() => setAllowCopying(!allowCopying)}>
                Allow copying
              </ToggleButton>
              <ToggleButton active={allowEditing} onClick={() => setAllowEditing(!allowEditing)}>
                Allow editing
              </ToggleButton>
            </div>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "unlock-pdf" ? (
          <Panel title="Unlock">
            <div className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
              You must know the current password. This tool does not crack, bypass or remove security without decryption support.
            </div>
            {inputInfo ? (
              <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm font-semibold text-[var(--text)]">
                This PDF is {inputInfo.isEncrypted ? "password protected" : "not password protected"}.
              </p>
            ) : null}
            <TextControl
              label="Current password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        {slug === "view-pdf-metadata" ? (
          <Panel title="Metadata">
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={metadataAction === "strip"} onClick={() => setMetadataAction("strip")}>
                Strip
              </ToggleButton>
              <ToggleButton active={metadataAction === "save"} onClick={() => setMetadataAction("save")}>
                Save fields
              </ToggleButton>
            </div>
            {metadataAction === "save" ? (
              <>
                <TextControl label="Title" value={metadataTitle} onChange={setMetadataTitle} />
                <TextControl label="Author" value={metadataAuthor} onChange={setMetadataAuthor} />
              </>
            ) : null}
            <button className="segmented-button w-full" type="button" onClick={copyMetadataJSON}>
              <Copy className="h-4 w-4" />
              Copy JSON
            </button>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        ) : null}

        <PDFInfoPanel />
      </>
    );
  }

  function preview() {
    if (slug === "convert-pdf-to-image" && outputBatch.length > 0) {
      return (
        <div className="space-y-5 p-4 sm:p-6">
          <OutputBatchPreview items={outputBatch} title="Converted images ready" />
          <PDFPageGrid
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onSelectedPagesChange={setSelectedPages}
          />
        </div>
      );
    }

    if (slug === "view-pdf-metadata") {
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

    if (slug === "rotate-pdf") {
      const rotations = { ...previewRotations };
      activePages.forEach((page) => {
        rotations[page] = rotationDegrees;
      });

      return (
        <div className="space-y-5 p-4 sm:p-6">
          <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
            The preview shows the selected rotation before export. Select pages,
            choose an angle, then process the PDF.
          </p>
          <PDFPageGrid
            rotations={rotations}
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onSelectedPagesChange={setSelectedPages}
          />
        </div>
      );
    }

    if (["convert-pdf-to-image", "extract-pdf-pages", "add-watermark-to-pdf", "add-page-numbers-to-pdf"].includes(slug)) {
      return (
        <div className="space-y-5 p-4 sm:p-6">
          {slug === "add-watermark-to-pdf" ? (
            <WatermarkLivePreview
              imageFile={watermarkImage}
              opacity={watermarkOpacity}
              pageThumbnail={pageThumbnails[0]}
              rotation={watermarkRotation}
              scale={watermarkScale}
              text={watermarkText}
              textColor={watermarkColor}
              textSize={watermarkFontSize}
              type={watermarkType}
              x={watermarkX}
              y={watermarkY}
              onChange={({ x, y }) => {
                setWatermarkX(x);
                setWatermarkY(y);
              }}
            />
          ) : null}
          <PDFPageGrid
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onSelectedPagesChange={setSelectedPages}
          />
          {slug === "add-watermark-to-pdf" ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
              Drag the watermark in the preview or adjust X/Y values. The same
              placement is applied to selected pages in the downloaded PDF.
            </div>
          ) : null}
        </div>
      );
    }

    if (slug === "reorder-pdf-pages") {
      return (
        <div className="space-y-5 p-4 sm:p-6">
          <PDFPageGrid
            pageOrder={pageOrder}
            reorderMode
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onPageOrderChange={setPageOrder}
          />
        </div>
      );
    }

    if (slug === "convert-image-to-pdf") {
      return (
        <div className="space-y-5 p-4 sm:p-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <h2 className="text-sm font-bold text-[var(--text)]">
              {batchFiles.length} images selected
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {batchFiles.map((file) => (
                <div
                  className="truncate rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]"
                  key={`${file.name}-${file.lastModified}`}
                >
                  {file.name}
                </div>
              ))}
            </div>
          </div>
          <PDFPreview />
        </div>
      );
    }

    return <PDFPreview />;
  }

  return (
    <PDFToolFrame controls={(
      <>
        {controls()}
        <PDFToolActions
          downloadName={downloadName}
          outputBatch={outputBatch}
          outputBlob={outputBlob}
          processLabel={
            slug === "view-pdf-metadata"
              ? metadataAction === "strip"
                ? "Strip metadata"
                : "Save metadata"
              : slug === "protect-pdf"
                ? "Protect PDF"
                : slug === "unlock-pdf"
                  ? "Unlock PDF"
              : "Process PDF"
          }
          onProcess={processPDF}
        />
      </>
    )} preview={preview()} slug={slug} />
  );
}
