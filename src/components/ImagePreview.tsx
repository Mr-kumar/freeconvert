"use client";

import { useMemo, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { RawImage } from "@/components/RawImage";
import type { ImageInfo } from "@/lib/types";
import { cn, formatBytes } from "@/lib/utils";

interface ImagePreviewProps {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  beforeInfo?: ImageInfo | null;
  afterInfo?: ImageInfo | null;
  mode?: "side-by-side" | "slider" | "before-only" | "after-only";
  previewStyle?: React.CSSProperties;
}

function InfoLine({ info }: { info?: ImageInfo | null }) {
  if (!info) {
    return null;
  }

  return (
    <p className="mt-2 font-mono text-xs text-[var(--muted)]">
      {info.width} x {info.height} px / {formatBytes(info.fileSize)}
    </p>
  );
}

function EmptyPreview() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:min-h-80">
      <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
        Add an image to start processing.
      </p>
    </div>
  );
}

export function ImagePreview({
  beforeUrl,
  afterUrl,
  beforeInfo,
  afterInfo,
  mode = "side-by-side",
  previewStyle,
}: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [split, setSplit] = useState(50);

  const controls = (
    <div className="flex items-center gap-2">
      <button
        aria-label="Zoom out"
        className="icon-button"
        type="button"
        onClick={() => setZoom((value) => Math.max(0.25, value - 0.25))}
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        aria-label="Fit preview"
        className="icon-button"
        type="button"
        onClick={() => setZoom(1)}
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      <button
        aria-label="Zoom in"
        className="icon-button"
        type="button"
        onClick={() => setZoom((value) => Math.min(4, value + 0.25))}
      >
        <Plus className="h-4 w-4" />
      </button>
      <span className="font-mono text-xs text-[var(--muted)]">
        {Math.round(zoom * 100)}%
      </span>
    </div>
  );

  const imageStyle = useMemo<React.CSSProperties>(
    () => ({
      transform: `scale(${zoom})`,
      ...previewStyle,
    }),
    [previewStyle, zoom],
  );

  if (!beforeUrl && !afterUrl) {
    return <EmptyPreview />;
  }

  if (mode === "slider" && beforeUrl && afterUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">{controls}</div>
        <div
          className="relative h-[520px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          onPointerMove={(event) => {
            if (event.buttons !== 1) {
              return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            setSplit(((event.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <RawImage
            alt="Original"
            className="absolute inset-0 h-full w-full object-contain transition-transform"
            src={beforeUrl}
            style={imageStyle}
          />
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${split}%` }}
          >
            <RawImage
              alt="Output"
              className="h-full w-[calc(100vw-340px)] max-w-none object-contain transition-transform"
              src={afterUrl}
              style={imageStyle}
            />
          </div>
          <div
            className="absolute inset-y-0 w-px bg-[var(--accent)]"
            style={{ left: `${split}%` }}
          />
        </div>
      </div>
    );
  }

  const panels = [
    { label: "Original", url: beforeUrl, info: beforeInfo },
    { label: "Output", url: afterUrl, info: afterInfo },
  ].filter((panel) => {
    if (mode === "before-only") {
      return panel.label === "Original";
    }

    if (mode === "after-only") {
      return panel.label === "Output";
    }

    return Boolean(panel.url);
  });

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 items-center justify-end">{controls}</div>
      <div
        className={cn(
          "grid gap-4",
          panels.length > 1 ? "xl:grid-cols-2" : "grid-cols-1",
        )}
      >
        {panels.map((panel) => (
          <figure key={panel.label} className="min-w-0">
            <div className="flex h-[320px] items-center justify-center overflow-hidden rounded-t-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:h-[460px] sm:p-4">
              {panel.url ? (
                <RawImage
                  alt={panel.label}
                  className="max-h-full max-w-full object-contain transition-transform"
                  src={panel.url}
                  style={imageStyle}
                />
              ) : (
                <EmptyPreview />
              )}
            </div>
            <figcaption className="rounded-b-xl border-x border-b border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p className="text-xs font-bold text-[var(--text)]">
                {panel.label}
              </p>
              <InfoLine info={panel.info} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
