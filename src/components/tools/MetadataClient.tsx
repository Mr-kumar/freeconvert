"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";
import type { ToolDefaults, ToolSlug } from "@/lib/types";
import { replaceFileExtension } from "@/lib/utils";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  ToolActions,
  ToolFrame,
  UploadPanel,
} from "./shared";

export function MetadataClient({
  slug,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const {
    inputFile,
    inputInfo,
    inputPreviewUrl,
    outputBlob,
    outputInfo,
    outputPreviewUrl,
    clearOutput,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = useImageStore();
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const outputFormat = asFormat(inputFile?.type, "image/png");
  const downloadName = useMemo(
    () => replaceFileExtension(inputFile?.name || "metadata-stripped.png", outputFormat),
    [inputFile?.name, outputFormat],
  );

  useEffect(() => {
    if (!inputFile) {
      const frame = requestAnimationFrame(() => setPalette([]));
      return () => cancelAnimationFrame(frame);
    }

    let cancelled = false;
    import("@/lib/imageProcessor")
      .then(({ getImagePalette }) => getImagePalette(inputFile))
      .then((colors) => {
        if (!cancelled) {
          setPalette(colors);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPalette([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [inputFile]);

  async function processImage() {
    setError(null);
    clearOutput();

    if (!inputFile) {
      setError("Add an image first.");
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      setProgress(45);
      const { convertImage } = await import("@/lib/imageProcessor");
      const blob = await convertImage(inputFile, {
        outputFormat,
        quality: 0.94,
      });
      setProgress(85);
      setOutputBlob(blob, downloadName);
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not strip metadata.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <UploadPanel />
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
        processLabel="Strip metadata"
        onProcess={processImage}
      >
        <p className="border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-5 text-[var(--muted)]">
          Output keeps the original browser-supported format and uses 94%
          quality for visual fidelity while stripping metadata.
        </p>
      </ToolActions>
    </>
  );

  const preview = (
    <div className="space-y-6 p-4 sm:p-6">
      <ImagePreview
        afterInfo={outputInfo}
        afterUrl={outputPreviewUrl}
        beforeInfo={inputInfo}
        beforeUrl={inputPreviewUrl}
        mode={outputPreviewUrl ? "side-by-side" : "before-only"}
      />
      {inputInfo ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <article className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-bold text-[var(--text)]">
                Image data
              </h2>
              <button
                className="icon-button"
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(JSON.stringify(inputInfo, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto bg-[var(--surface-2)] p-3 font-mono text-xs leading-5 text-[var(--muted)]">
              {JSON.stringify(inputInfo, null, 2)}
            </pre>
          </article>
          <article className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-display text-sm font-bold text-[var(--text)]">
              Palette
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {palette.map((color) => (
                <button
                  className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface-2)] p-2 text-left"
                  key={color}
                  type="button"
                  onClick={() => navigator.clipboard.writeText(color)}
                >
                  <span
                    className="h-10 w-10 border border-[var(--border)]"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-xs text-[var(--text)]">
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
