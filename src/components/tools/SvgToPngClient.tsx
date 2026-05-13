"use client";

import { useMemo, useState } from "react";
import { FileCode2, Upload } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import { RawImage } from "@/components/RawImage";
import {
  canvasToImageBlob,
  createSafeCanvas,
  imageOutputName,
  sanitizeSvg,
} from "@/lib/imageExtras";
import type { ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
import { formatBytes } from "@/lib/utils";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  asNumber,
  FormatControl,
  NumberControl,
  Panel,
  RangeControl,
  ToolFrame,
} from "./shared";

export function SvgToPngClient({
  slug,
  defaults,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const { error, isProcessing, progress, setError, setProcessing, setProgress } =
    useImageStore();
  const [file, setFile] = useState<File | null>(null);
  const [svgText, setSvgText] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat, "image/png"),
  );
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(asNumber(defaults.quality, 92));
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const previewUrl = useMemo(() => {
    if (!svgText) return "";
    return URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }));
  }, [svgText]);
  const downloadName = imageOutputName(file?.name || "freeconvert-svg", outputFormat);

  async function chooseFile(nextFile: File | undefined) {
    setError(null);
    setOutputBlob(null);
    if (!nextFile) return;
    if (!/\.svg$/i.test(nextFile.name) && nextFile.type !== "image/svg+xml") {
      setError("Add a valid SVG file.");
      return;
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      setError("SVG is too large for browser processing. Maximum is 5 MB.");
      return;
    }
    setFile(nextFile);
    setSvgText(sanitizeSvg(await nextFile.text()));
  }

  async function processSvg() {
    setError(null);
    setOutputBlob(null);

    if (!svgText) {
      setError("Add an SVG file first.");
      return;
    }

    setProcessing(true);
    setProgress(20);

    try {
      const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }));
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not render this SVG."));
        img.src = url;
      });
      URL.revokeObjectURL(url);
      const canvas = createSafeCanvas(image.naturalWidth * scale, image.naturalHeight * scale);
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas rendering is not available in this browser.");
      }

      if (outputFormat === "image/jpeg" || backgroundColor !== "transparent") {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setProgress(80);
      setOutputBlob(await canvasToImageBlob(canvas, outputFormat, quality / 100));
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not convert this SVG.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <Panel title="SVG">
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] p-5 text-center transition-colors hover:border-[var(--accent)]">
          <input
            accept=".svg,image/svg+xml"
            className="sr-only"
            type="file"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <Upload className="h-8 w-8 text-[var(--accent)]" />
          <span className="mt-4 text-sm font-bold text-[var(--text)]">Add SVG</span>
          <span className="mt-2 text-xs leading-5 text-[var(--muted)]">
            SVG files up to 5 MB
          </span>
        </label>
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <FileCode2 className="h-4 w-4 text-[var(--accent)]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--text)]">{file.name}</p>
              <p className="font-mono text-xs text-[var(--muted)]">{formatBytes(file.size)}</p>
            </div>
          </div>
        ) : null}
      </Panel>
      <Panel title="Output">
        <FormatControl value={outputFormat} includeAvif={false} onChange={setOutputFormat} />
        <NumberControl label="Scale" max={8} min={1} value={scale} onChange={setScale} />
        {outputFormat !== "image/png" ? (
          <RangeControl label="Quality" max={100} min={10} suffix="%" value={quality} onChange={setQuality} />
        ) : null}
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
      <Panel title="Export">
        {isProcessing ? (
          <p className="text-xs font-bold text-[var(--muted)]">Rendering... {Math.round(progress)}%</p>
        ) : null}
        {error ? <p className="rounded-lg border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="button-primary w-full" disabled={isProcessing} type="button" onClick={processSvg}>
          Convert SVG
        </button>
        <DownloadButton blob={outputBlob} filename={downloadName} />
      </Panel>
    </>
  );

  const preview = (
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      {previewUrl ? (
        <RawImage alt="SVG preview" className="max-h-full max-w-full object-contain" src={previewUrl} />
      ) : (
        <p className="text-sm text-[var(--muted)]">SVG preview appears after upload.</p>
      )}
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
