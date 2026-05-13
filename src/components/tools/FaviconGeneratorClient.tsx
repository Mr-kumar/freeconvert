"use client";

import { useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import {
  createIcoFromPngs,
  createSafeCanvas,
  dataUrlToUint8Array,
  loadImageForCanvas,
} from "@/lib/imageExtras";
import type { ToolDefaults, ToolSlug } from "@/lib/types";
import { formatBytes } from "@/lib/utils";
import { useImageStore } from "@/store/useImageStore";
import { InfoPanel, Panel, ToolFrame, UploadPanel } from "./shared";

const iconSizes = [16, 32, 48, 180, 192, 512];

async function renderPng(image: HTMLImageElement, size: number) {
  const canvas = createSafeCanvas(size, size);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available in this browser.");
  }

  context.clearRect(0, 0, size, size);
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - sourceSize) / 2;
  const sy = (image.naturalHeight - sourceSize) / 2;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, size, size);

  const dataUrl = canvas.toDataURL("image/png");
  return dataUrlToUint8Array(dataUrl);
}

export function FaviconGeneratorClient({
  slug,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const { inputFile, error, clearOutput, setError, setProcessing, setProgress } =
    useImageStore();
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [items, setItems] = useState<{ name: string; size: number }[]>([]);

  async function generate() {
    setError(null);
    clearOutput();
    setOutputBlob(null);
    setItems([]);

    if (!inputFile) {
      setError("Add an image first.");
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      const { default: JSZip } = await import("jszip");
      const source = await loadImageForCanvas(inputFile);
      const zip = new JSZip();
      const pngs: { size: number; bytes: Uint8Array }[] = [];

      for (let index = 0; index < iconSizes.length; index += 1) {
        const size = iconSizes[index];
        const bytes = await renderPng(source.image, size);
        pngs.push({ size, bytes });
        zip.file(`favicon-${size}x${size}.png`, bytes);
        setProgress(20 + ((index + 1) / iconSizes.length) * 45);
      }

      zip.file("favicon.ico", await createIcoFromPngs(pngs.slice(0, 3)).arrayBuffer());
      zip.file(
        "site.webmanifest",
        JSON.stringify(
          {
            icons: [
              { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
              { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
            ],
          },
          null,
          2,
        ),
      );

      const blob = await zip.generateAsync({ type: "blob" });
      setOutputBlob(blob);
      setItems([
        { name: "favicon.ico", size: 0 },
        ...iconSizes.map((size) => ({ name: `favicon-${size}x${size}.png`, size })),
        { name: "site.webmanifest", size: 0 },
      ]);
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create favicon files.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <UploadPanel />
      <InfoPanel />
      <Panel title="Export">
        {error ? <p className="rounded-lg border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="button-primary w-full" type="button" onClick={generate}>
          Generate favicon pack
        </button>
        <DownloadButton blob={outputBlob} filename="freeconvert-favicon-pack.zip" />
      </Panel>
    </>
  );

  const preview = (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <h2 className="text-sm font-extrabold text-[var(--text)]">Generated files</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          The ZIP includes ICO, PNG icon sizes and a small web manifest snippet.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(items.length ? items : iconSizes.map((size) => ({ name: `favicon-${size}x${size}.png`, size }))).map((item) => (
          <div className="rounded-lg border border-[var(--border)] p-3" key={item.name}>
            <p className="text-sm font-bold text-[var(--text)]">{item.name}</p>
            <p className="mt-1 font-mono text-xs text-[var(--muted)]">
              {item.size ? `${item.size} x ${item.size}` : outputBlob ? formatBytes(outputBlob.size) : "Included"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
