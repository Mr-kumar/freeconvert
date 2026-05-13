"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { RawImage } from "@/components/RawImage";
import {
  canvasToImageBlob,
  createSafeCanvas,
  imageOutputName,
  loadImageForCanvas,
} from "@/lib/imageExtras";
import type { ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  asNumber,
  FormatControl,
  NumberControl,
  Panel,
  RangeControl,
  SelectControl,
  ToolFrame,
  UploadPanel,
} from "./shared";

type CollageLayout = "grid" | "story" | "banner" | "comparison";

const aspectSizes: Record<string, [number, number]> = {
  square: [1200, 1200],
  story: [1080, 1920],
  landscape: [1600, 900],
  portrait: [1200, 1500],
};

function coverRect(
  sourceWidth: number,
  sourceHeight: number,
  targetX: number,
  targetY: number,
  targetWidth: number,
  targetHeight: number,
) {
  const ratio = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * ratio;
  const height = sourceHeight * ratio;
  return {
    x: targetX + (targetWidth - width) / 2,
    y: targetY + (targetHeight - height) / 2,
    width,
    height,
  };
}

export function ImageCollageClient({
  slug,
  defaults,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const { batchFiles, error, setError, setProcessing, setProgress } = useImageStore();
  const [layout, setLayout] = useState<CollageLayout>("grid");
  const [aspect, setAspect] = useState("square");
  const [gap, setGap] = useState(18);
  const [columns, setColumns] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat, "image/jpeg"),
  );
  const [quality, setQuality] = useState(asNumber(defaults.quality, 92));
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const outputUrl = useMemo(
    () => (outputBlob ? URL.createObjectURL(outputBlob) : ""),
    [outputBlob],
  );

  async function makeCollage() {
    setError(null);
    setOutputBlob(null);

    if (!batchFiles.length) {
      setError("Add at least two images.");
      return;
    }

    setProcessing(true);
    setProgress(8);

    try {
      const images = await Promise.all(batchFiles.slice(0, 12).map(loadImageForCanvas));
      const [canvasWidth, canvasHeight] = aspectSizes[aspect] || aspectSizes.square;
      const canvas = createSafeCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas rendering is not available in this browser.");
      }

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const safeGap = Math.max(0, gap);

      if (layout === "banner") {
        const cellWidth = (canvas.width - safeGap * (images.length - 1)) / images.length;
        images.forEach((item, index) => {
          const rect = coverRect(item.width, item.height, index * (cellWidth + safeGap), 0, cellWidth, canvas.height);
          context.drawImage(item.image, rect.x, rect.y, rect.width, rect.height);
        });
      } else if (layout === "story") {
        const heroHeight = canvas.height * 0.58;
        const hero = images[0];
        const heroRect = coverRect(hero.width, hero.height, 0, 0, canvas.width, heroHeight);
        context.drawImage(hero.image, heroRect.x, heroRect.y, heroRect.width, heroRect.height);
        const rest = images.slice(1);
        const cellWidth = rest.length ? (canvas.width - safeGap * (rest.length - 1)) / rest.length : canvas.width;
        rest.forEach((item, index) => {
          const rect = coverRect(item.width, item.height, index * (cellWidth + safeGap), heroHeight + safeGap, cellWidth, canvas.height - heroHeight - safeGap);
          context.drawImage(item.image, rect.x, rect.y, rect.width, rect.height);
        });
      } else {
        const cols = layout === "comparison" ? 2 : Math.max(1, columns);
        const rows = Math.ceil(images.length / cols);
        const cellWidth = (canvas.width - safeGap * (cols - 1)) / cols;
        const cellHeight = (canvas.height - safeGap * (rows - 1)) / rows;
        images.forEach((item, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const rect = coverRect(
            item.width,
            item.height,
            col * (cellWidth + safeGap),
            row * (cellHeight + safeGap),
            cellWidth,
            cellHeight,
          );
          context.drawImage(item.image, rect.x, rect.y, rect.width, rect.height);
        });
      }

      setProgress(85);
      setOutputBlob(await canvasToImageBlob(canvas, outputFormat, quality / 100));
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create this collage.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <UploadPanel multiple />
      <Panel title="Layout">
        <SelectControl
          label="Template"
          options={[
            { label: "Grid", value: "grid" },
            { label: "Story", value: "story" },
            { label: "Banner", value: "banner" },
            { label: "Comparison", value: "comparison" },
          ]}
          value={layout}
          onChange={setLayout}
        />
        <SelectControl
          label="Canvas ratio"
          options={[
            { label: "Square", value: "square" },
            { label: "Story", value: "story" },
            { label: "Landscape", value: "landscape" },
            { label: "Portrait", value: "portrait" },
          ]}
          value={aspect}
          onChange={setAspect}
        />
        <NumberControl label="Columns" max={6} min={1} value={columns} onChange={setColumns} />
        <RangeControl label="Gap" max={80} min={0} suffix="px" value={gap} onChange={setGap} />
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
      <Panel title="Output">
        <FormatControl value={outputFormat} includeAvif={false} onChange={setOutputFormat} />
        {outputFormat !== "image/png" ? (
          <RangeControl label="Quality" max={100} min={10} suffix="%" value={quality} onChange={setQuality} />
        ) : null}
      </Panel>
      <Panel title="Export">
        {error ? <p className="rounded-lg border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="button-primary w-full" type="button" onClick={makeCollage}>
          Create collage
        </button>
        <DownloadButton blob={outputBlob} filename={imageOutputName("freeconvert-collage", outputFormat)} />
      </Panel>
    </>
  );

  const preview = (
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      {outputUrl ? (
        <RawImage alt="Collage preview" className="max-h-full max-w-full object-contain" src={outputUrl} />
      ) : (
        <p className="text-sm text-[var(--muted)]">Collage preview appears after export.</p>
      )}
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
