"use client";

import { useMemo, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type { ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  asNumber,
  FormatControl,
  InfoPanel,
  NumberControl,
  outputName,
  Panel,
  RangeControl,
  ToggleButton,
  ToolActions,
  ToolFrame,
  UploadPanel,
} from "./shared";

export function CompressClient({
  slug,
  defaults,
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
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat),
  );
  const [quality, setQuality] = useState(asNumber(defaults.quality, 75));
  const [targetSizeKB, setTargetSizeKB] = useState(
    asNumber(defaults.targetSizeKB, 0),
  );
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(
    asNumber(defaults.maxWidthOrHeight, 0),
  );
  const [sizeMode, setSizeMode] = useState<"kb" | "px">(
    maxWidthOrHeight > 0 && targetSizeKB === 0 ? "px" : "kb",
  );
  const downloadName = useMemo(
    () => outputName(inputFile?.name, outputFormat),
    [inputFile?.name, outputFormat],
  );

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
      const { compressImage } = await import("@/lib/imageProcessor");
      const blob = await compressImage(inputFile, {
        quality: quality / 100,
        outputFormat,
        targetSizeKB:
          sizeMode === "kb" && targetSizeKB > 0 ? targetSizeKB : undefined,
        maxWidthOrHeight:
          sizeMode === "px" && maxWidthOrHeight > 0
            ? maxWidthOrHeight
            : undefined,
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

  const controls = (
    <>
      <UploadPanel />
      <Panel title="Compress">
        <RangeControl
          label="Quality"
          max={100}
          min={1}
          suffix="%"
          value={quality}
          onChange={setQuality}
        />
        <div className="space-y-2">
          <p className="field-label">Size target</p>
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={sizeMode === "kb"} onClick={() => setSizeMode("kb")}>
              KB file size
            </ToggleButton>
            <ToggleButton active={sizeMode === "px"} onClick={() => setSizeMode("px")}>
              PX dimension
            </ToggleButton>
          </div>
        </div>
        {sizeMode === "kb" ? (
          <>
            <NumberControl
              label="Target output size (KB)"
              value={targetSizeKB}
              onChange={setTargetSizeKB}
            />
            <p className="text-xs leading-5 text-[var(--muted)]">
              Leave 0 to compress by quality only. Set a KB target when you
              need a file under a specific upload limit.
            </p>
          </>
        ) : (
          <>
            <NumberControl
              label="Max width or height (PX)"
              value={maxWidthOrHeight}
              onChange={setMaxWidthOrHeight}
            />
            <p className="text-xs leading-5 text-[var(--muted)]">
              The largest side will be capped to this pixel value while
              preserving the image ratio. Leave 0 to keep dimensions.
            </p>
          </>
        )}
      </Panel>
      <InfoPanel />
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
        onProcess={processImage}
      >
        <FormatControl
          includeAvif={false}
          value={outputFormat}
          onChange={setOutputFormat}
        />
      </ToolActions>
    </>
  );

  const preview = (
    <div className="p-4 sm:p-6">
      <ImagePreview
        afterInfo={outputInfo}
        afterUrl={outputPreviewUrl}
        beforeInfo={inputInfo}
        beforeUrl={inputPreviewUrl}
        mode={outputPreviewUrl ? "side-by-side" : "before-only"}
      />
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
