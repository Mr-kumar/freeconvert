"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type { ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  asBoolean,
  asFormat,
  asNumber,
  asString,
  AvifWarning,
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
  useAvifSupport,
} from "./shared";

export function ResizeClient({
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
  const avifSupported = useAvifSupport();
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(
    asFormat(defaults.outputFormat),
  );
  const [quality, setQuality] = useState(asNumber(defaults.quality, 90));
  const [width, setWidth] = useState(asNumber(defaults.width, 0));
  const [height, setHeight] = useState(asNumber(defaults.height, 0));
  const [unit, setUnit] = useState(asString(defaults.unit, "px"));
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(
    asBoolean(defaults.maintainAspectRatio, true),
  );
  const [targetSizeKB, setTargetSizeKB] = useState(
    asNumber(defaults.targetSizeKB, 0),
  );
  const downloadName = useMemo(
    () => outputName(inputFile?.name, outputFormat),
    [inputFile?.name, outputFormat],
  );

  useEffect(() => {
    if (inputInfo && width === 0 && height === 0) {
      const frame = requestAnimationFrame(() => {
        setWidth(inputInfo.width);
        setHeight(inputInfo.height);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [height, inputInfo, width]);

  async function processImage() {
    setError(null);
    clearOutput();

    if (!inputFile) {
      setError("Add an image first.");
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
      const { resizeImage } = await import("@/lib/imageProcessor");
      const blob = await resizeImage(inputFile, {
        width,
        height,
        unit: unit === "percent" ? "percent" : "px",
        maintainAspectRatio,
        outputFormat,
        quality: quality / 100,
        targetSizeKB: targetSizeKB > 0 ? targetSizeKB : undefined,
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
      <Panel title="Resize">
        <div className="grid grid-cols-2 gap-3">
          <NumberControl
            label={unit === "percent" ? "Width %" : "Width px"}
            value={width}
            onChange={(value) => {
              setWidth(value);
              if (maintainAspectRatio && inputInfo && unit === "px") {
                setHeight(Math.round(value / (inputInfo.width / inputInfo.height)));
              }
            }}
          />
          <NumberControl
            label={unit === "percent" ? "Height %" : "Height px"}
            value={height}
            onChange={(value) => {
              setHeight(value);
              if (maintainAspectRatio && inputInfo && unit === "px") {
                setWidth(Math.round(value * (inputInfo.width / inputInfo.height)));
              }
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton active={unit === "px"} onClick={() => setUnit("px")}>
            PX
          </ToggleButton>
          <ToggleButton active={unit === "percent"} onClick={() => setUnit("percent")}>
            %
          </ToggleButton>
        </div>
        <ToggleButton
          active={maintainAspectRatio}
          onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
        >
          Lock aspect ratio
        </ToggleButton>
        <NumberControl
          label="Target file size (KB)"
          max={51200}
          value={targetSizeKB}
          onChange={setTargetSizeKB}
        />
        <p className="text-xs leading-5 text-[var(--muted)]">
          Optional. Type 35 for 35 KB or 10 for 10 KB after resizing. Works
          best with JPG, WebP and AVIF; PNG is lossless and may stay larger.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["HD", 1280, 720],
            ["Full HD", 1920, 1080],
            ["Square", 1080, 1080],
            ["4K", 3840, 2160],
          ].map(([label, nextWidth, nextHeight]) => (
            <button
              className="segmented-button"
              key={String(label)}
              type="button"
              onClick={() => {
                setUnit("px");
                setWidth(Number(nextWidth));
                setHeight(Number(nextHeight));
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </Panel>
      <InfoPanel />
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
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
