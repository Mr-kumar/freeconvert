"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { ReactCropperElement } from "react-cropper";
import { RotateCcw } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";
import type { ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  asFormat,
  asNumber,
  asString,
  AvifWarning,
  FormatControl,
  InfoPanel,
  outputName,
  Panel,
  RangeControl,
  SelectControl,
  ToolActions,
  ToolFrame,
  UploadPanel,
  useAvifSupport,
} from "./shared";

const Cropper = dynamic(() => import("react-cropper").then((mod) => mod.default), {
  ssr: false,
}) as typeof import("react-cropper").default;

export function CropClient({
  slug,
  defaults,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
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
  const [cropRatio, setCropRatio] = useState(asString(defaults.ratio, "free"));
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

    if (outputFormat === "image/avif" && !avifSupported) {
      setError("AVIF export is not supported in this browser.");
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      setProgress(45);
      const cropper = cropperRef.current?.cropper;
      if (!cropper) {
        throw new Error("Cropper is not ready yet.");
      }

      const canvas = cropper.getCroppedCanvas({
        fillColor: outputFormat === "image/jpeg" ? "#ffffff" : "transparent",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (!result) {
              canvas.width = 0;
              canvas.height = 0;
              reject(new Error("Could not crop this image."));
              return;
            }
            resolve(result);
            canvas.width = 0;
            canvas.height = 0;
          },
          outputFormat,
          quality / 100,
        );
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

  const [ratioWidth, ratioHeight] = cropRatio.split(":").map(Number);
  const ratio =
    cropRatio === "free" || !ratioWidth || !ratioHeight
      ? undefined
      : ratioWidth / ratioHeight;

  const controls = (
    <>
      <UploadPanel />
      <Panel title="Crop">
        <SelectControl
          label="Aspect ratio"
          options={[
            { label: "Free", value: "free" },
            { label: "1:1", value: "1:1" },
            { label: "4:3", value: "4:3" },
            { label: "16:9", value: "16:9" },
            { label: "3:4", value: "3:4" },
            { label: "9:16", value: "9:16" },
          ]}
          value={cropRatio}
          onChange={setCropRatio}
        />
        <button
          className="segmented-button"
          type="button"
          onClick={() => cropperRef.current?.cropper.reset()}
        >
          <RotateCcw className="h-4 w-4" />
          Reset crop
        </button>
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

  const preview =
    inputPreviewUrl ? (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3">
          <Cropper
            ref={cropperRef}
            src={inputPreviewUrl}
            style={{ height: 520, width: "100%" }}
            aspectRatio={ratio}
            background={false}
            responsive
            viewMode={1}
            autoCropArea={0.8}
          />
        </div>
        <ImagePreview
          afterInfo={outputInfo}
          afterUrl={outputPreviewUrl}
          beforeInfo={inputInfo}
          beforeUrl={inputPreviewUrl}
          mode={outputPreviewUrl ? "side-by-side" : "before-only"}
        />
      </div>
    ) : (
      <div className="p-4 sm:p-6">
        <ImagePreview />
      </div>
    );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
