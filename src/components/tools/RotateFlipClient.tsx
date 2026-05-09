"use client";

import { useMemo, useState, type CSSProperties } from "react";
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
  outputName,
  Panel,
  RangeControl,
  ToggleButton,
  ToolActions,
  ToolFrame,
  UploadPanel,
  useAvifSupport,
} from "./shared";

export function RotateFlipClient({
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
  const [degrees, setDegrees] = useState(asNumber(defaults.degrees, 0));
  const [flipH, setFlipH] = useState(asBoolean(defaults.flipH, false));
  const [flipV, setFlipV] = useState(asBoolean(defaults.flipV, false));
  const [fillColor, setFillColor] = useState(
    asString(defaults.fillColor, "#ffffff"),
  );
  const downloadName = useMemo(
    () => outputName(inputFile?.name, outputFormat),
    [inputFile?.name, outputFormat],
  );
  const previewStyle = useMemo<CSSProperties>(
    () => ({
      transform: `rotate(${degrees}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    }),
    [degrees, flipH, flipV],
  );

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
      const { rotateImage } = await import("@/lib/imageProcessor");
      const blob = await rotateImage(inputFile, {
        degrees,
        flipH,
        flipV,
        fillColor,
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

  const controls = (
    <>
      <UploadPanel />
      <Panel title="Transform">
        <div className="grid grid-cols-3 gap-2">
          <button className="segmented-button" type="button" onClick={() => setDegrees((value) => value - 90)}>
            -90
          </button>
          <button className="segmented-button" type="button" onClick={() => setDegrees((value) => value + 90)}>
            +90
          </button>
          <button className="segmented-button" type="button" onClick={() => setDegrees(180)}>
            180
          </button>
        </div>
        <RangeControl
          label="Angle"
          max={180}
          min={-180}
          suffix="deg"
          value={degrees}
          onChange={setDegrees}
        />
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton active={flipH} onClick={() => setFlipH(!flipH)}>
            Flip H
          </ToggleButton>
          <ToggleButton active={flipV} onClick={() => setFlipV(!flipV)}>
            Flip V
          </ToggleButton>
        </div>
        <label className="field-label">
          Fill color
          <input
            className="field-input h-11"
            type="color"
            value={fillColor === "transparent" ? "#ffffff" : fillColor}
            onChange={(event) => setFillColor(event.target.value)}
          />
        </label>
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
        previewStyle={previewStyle}
      />
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
