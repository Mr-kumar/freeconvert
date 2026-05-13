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
  InfoPanel,
  NumberControl,
  Panel,
  RangeControl,
  SelectControl,
  ToolFrame,
  UploadPanel,
} from "./shared";

type BlurMode = "blur" | "pixelate";

export function BlurImageClient({
  slug,
  defaults,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const { inputFile, inputPreviewUrl, error, setError, setProcessing, setProgress } =
    useImageStore();
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat, "image/png"),
  );
  const [quality, setQuality] = useState(asNumber(defaults.quality, 92));
  const [mode, setMode] = useState<BlurMode>("blur");
  const [x, setX] = useState(25);
  const [y, setY] = useState(25);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(25);
  const [strength, setStrength] = useState(14);
  const outputUrl = useMemo(
    () => (outputBlob ? URL.createObjectURL(outputBlob) : ""),
    [outputBlob],
  );
  const downloadName = imageOutputName(inputFile?.name, outputFormat);

  async function processImage() {
    setError(null);
    setOutputBlob(null);

    if (!inputFile) {
      setError("Add an image first.");
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      const source = await loadImageForCanvas(inputFile);
      const canvas = createSafeCanvas(source.width, source.height);
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas rendering is not available in this browser.");
      }

      context.drawImage(source.image, 0, 0);
      const rect = {
        x: (canvas.width * x) / 100,
        y: (canvas.height * y) / 100,
        width: (canvas.width * width) / 100,
        height: (canvas.height * height) / 100,
      };

      if (mode === "pixelate") {
        const pixelSize = Math.max(4, strength);
        const temp = createSafeCanvas(
          Math.max(1, Math.round(rect.width / pixelSize)),
          Math.max(1, Math.round(rect.height / pixelSize)),
        );
        const tempContext = temp.getContext("2d");
        if (!tempContext) throw new Error("Canvas rendering is not available.");
        tempContext.imageSmoothingEnabled = false;
        tempContext.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, temp.width, temp.height);
        context.imageSmoothingEnabled = false;
        context.drawImage(temp, 0, 0, temp.width, temp.height, rect.x, rect.y, rect.width, rect.height);
        context.imageSmoothingEnabled = true;
      } else {
        context.save();
        context.filter = `blur(${strength}px)`;
        context.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height);
        context.restore();
      }

      setProgress(85);
      setOutputBlob(await canvasToImageBlob(canvas, outputFormat, quality / 100));
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not blur this image.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <UploadPanel />
      <Panel title="Area">
        <SelectControl
          label="Mode"
          options={[
            { label: "Blur", value: "blur" },
            { label: "Pixelate", value: "pixelate" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <div className="grid grid-cols-2 gap-3">
          <NumberControl label="X %" max={99} min={0} value={x} onChange={setX} />
          <NumberControl label="Y %" max={99} min={0} value={y} onChange={setY} />
          <NumberControl label="Width %" max={100} min={1} value={width} onChange={setWidth} />
          <NumberControl label="Height %" max={100} min={1} value={height} onChange={setHeight} />
        </div>
        <RangeControl label="Strength" max={40} min={4} value={strength} onChange={setStrength} />
      </Panel>
      <Panel title="Output">
        <FormatControl value={outputFormat} includeAvif={false} onChange={setOutputFormat} />
        {outputFormat !== "image/png" ? (
          <RangeControl label="Quality" max={100} min={10} suffix="%" value={quality} onChange={setQuality} />
        ) : null}
      </Panel>
      <InfoPanel />
      <Panel title="Export">
        {error ? <p className="rounded-lg border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="button-primary w-full" type="button" onClick={processImage}>
          Blur selected area
        </button>
        <DownloadButton blob={outputBlob} filename={downloadName} />
      </Panel>
    </>
  );

  const preview = (
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      {outputUrl || inputPreviewUrl ? (
        <RawImage
          alt="Image preview"
          className="max-h-full max-w-full object-contain"
          src={outputUrl || inputPreviewUrl || ""}
        />
      ) : (
        <p className="text-sm text-[var(--muted)]">Image preview appears after upload.</p>
      )}
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
