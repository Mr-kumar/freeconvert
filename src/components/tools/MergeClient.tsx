"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";
import { RawImage } from "@/components/RawImage";
import type { ImageFormat, MergeDirection, ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  asNumber,
  asString,
  AvifWarning,
  extensionFromFormat,
  FormatControl,
  InfoPanel,
  NumberControl,
  Panel,
  RangeControl,
  SelectControl,
  ToggleButton,
  ToolActions,
  ToolFrame,
  UploadPanel,
  useAvifSupport,
} from "./shared";

export function MergeClient({
  slug,
  defaults,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const {
    batchFiles,
    batchPreviewUrls,
    outputBlob,
    outputInfo,
    outputPreviewUrl,
    clearOutput,
    removeBatchFile,
    reorderBatch,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = useImageStore();
  const avifSupported = useAvifSupport();
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat),
  );
  const [quality, setQuality] = useState(asNumber(defaults.quality, 90));
  const [direction, setDirection] = useState<MergeDirection>(
    asString(defaults.direction, "horizontal") as MergeDirection,
  );
  const [gap, setGap] = useState(asNumber(defaults.gap, 0));
  const [background, setBackground] = useState(
    asString(defaults.backgroundColor, "#ffffff"),
  );
  const [columns, setColumns] = useState(asNumber(defaults.columns, 2));
  const [align, setAlign] = useState<"start" | "center" | "end">(
    asString(defaults.align, "center") as "start" | "center" | "end",
  );
  const [resizeToMatch, setResizeToMatch] = useState(false);
  const downloadName = useMemo(
    () => `freeconvert-merged.${extensionFromFormat(outputFormat)}`,
    [outputFormat],
  );

  async function processImage() {
    setError(null);
    clearOutput();

    if (batchFiles.length === 0) {
      setError("Add at least one image.");
      return;
    }

    if (outputFormat === "image/avif" && !avifSupported) {
      setError("AVIF export is not supported in this browser.");
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      setProgress(45);
      const { mergeImages } = await import("@/lib/imageProcessor");
      const blob = await mergeImages(batchFiles, {
        direction,
        gap,
        backgroundColor: background,
        columns,
        align,
        resizeToMatch: direction !== "grid" && resizeToMatch,
        outputFormat,
        quality: quality / 100,
      });
      setProgress(85);
      setOutputBlob(blob, downloadName);
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not process this image.");
    } finally {
      setProcessing(false);
    }
  }

  function moveBatchItem(from: number, to: number) {
    if (to < 0 || to >= batchFiles.length) {
      return;
    }

    reorderBatch(from, to);
  }

  const controls = (
    <>
      <UploadPanel multiple />
      <Panel title="Layout">
        {batchFiles.length > 0 ? (
          <div className="border border-[var(--border)] bg-[var(--surface-2)]">
            {batchFiles.map((file, index) => (
              <div
                className="flex items-center gap-2 border-b border-[var(--border)] p-2 last:border-b-0"
                key={`${file.name}-${index}`}
              >
                <RawImage
                  alt=""
                  className="h-10 w-10 border border-[var(--border)] object-cover"
                  src={batchPreviewUrls[index]}
                />
                <span className="min-w-0 flex-1 truncate text-xs text-[var(--text)]">
                  {file.name}
                </span>
                <button
                  aria-label="Move up"
                  className="icon-button"
                  disabled={index === 0}
                  type="button"
                  onClick={() => moveBatchItem(index, index - 1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  aria-label="Move down"
                  className="icon-button"
                  disabled={index === batchFiles.length - 1}
                  type="button"
                  onClick={() => moveBatchItem(index, index + 1)}
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
        ) : null}
        <SelectControl
          label="Direction"
          options={[
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
            { label: "Grid", value: "grid" },
          ]}
          value={direction}
          onChange={setDirection}
        />
        {direction === "grid" ? (
          <NumberControl
            label="Grid columns"
            max={8}
            min={1}
            value={columns}
            onChange={setColumns}
          />
        ) : null}
        <RangeControl
          label="Gap"
          max={100}
          min={0}
          suffix="px"
          value={gap}
          onChange={setGap}
        />
        <label className="field-label">
          Background
          <input
            className="field-input h-11"
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
          />
        </label>
        <SelectControl
          label="Align"
          options={[
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
          ]}
          value={align}
          onChange={setAlign}
        />
        {direction !== "grid" ? (
          <ToggleButton
            active={resizeToMatch}
            onClick={() => setResizeToMatch(!resizeToMatch)}
          >
            Resize to match
          </ToggleButton>
        ) : null}
      </Panel>
      <InfoPanel />
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
        processLabel="Merge images"
        onProcess={processImage}
      >
        <FormatControl value={outputFormat} onChange={setOutputFormat} />
        {outputFormat !== "image/png" ? (
          <RangeControl
            label="Quality"
            max={100}
            min={1}
            suffix="%"
            value={quality}
            onChange={setQuality}
          />
        ) : null}
        <AvifWarning show={outputFormat === "image/avif" && !avifSupported} />
      </ToolActions>
    </>
  );

  const preview = (
    <div className="space-y-6 p-4 sm:p-6">
      {batchPreviewUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {batchPreviewUrls.map((url, index) => (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-2" key={url}>
              <RawImage
                alt={`Input ${index + 1}`}
                className="aspect-square w-full object-cover"
                src={url}
              />
            </div>
          ))}
        </div>
      ) : null}
      <ImagePreview
        afterInfo={outputInfo}
        afterUrl={outputPreviewUrl}
        mode="after-only"
      />
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
