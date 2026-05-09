"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type { FilterOptions, ImageFormat, ToolDefaults, ToolSlug } from "@/lib/types";
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
  ToggleButton,
  ToolActions,
  ToolFrame,
  UploadPanel,
  useAvifSupport,
  useDebouncedValue,
} from "./shared";

const filterPresets: Record<string, Partial<FilterOptions>> = {
  Original: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
    opacity: 100,
    sharpness: 0,
  },
  Vivid: { brightness: 110, contrast: 120, saturation: 140 },
  Matte: { brightness: 105, contrast: 80, saturation: 70 },
  "B&W": { grayscale: 100 },
  Sepia: { sepia: 80, saturation: 80 },
  Cool: { hue: 30, saturation: 110 },
  Warm: { hue: -20, saturation: 115, brightness: 105 },
  Faded: { brightness: 110, contrast: 70, saturation: 60 },
  Dramatic: { contrast: 150, saturation: 120 },
  Vintage: { sepia: 40, contrast: 90, brightness: 95 },
};

export function FiltersClient({
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
  const [filterTab, setFilterTab] = useState<"adjust" | "presets">("adjust");
  const presetName = defaults.preset
    ? Object.keys(filterPresets).find(
        (name) => name.toLowerCase() === asString(defaults.preset, "").toLowerCase(),
      )
    : undefined;
  const [filters, setFilters] = useState<FilterOptions>(() => ({
    brightness: asNumber(defaults.brightness, 100),
    contrast: asNumber(defaults.contrast, 100),
    saturation: asNumber(defaults.saturation, 100),
    hue: asNumber(defaults.hue, 0),
    blur: asNumber(defaults.blur, 0),
    sepia: asNumber(defaults.sepia, 0),
    grayscale: asNumber(defaults.grayscale, 0),
    invert: asNumber(defaults.invert, 0),
    opacity: asNumber(defaults.opacity, 100),
    sharpness: 0,
    outputFormat: asFormat(defaults.outputFormat),
    quality: asNumber(defaults.quality, 90) / 100,
    ...(presetName ? filterPresets[presetName] : {}),
  }));
  const previewFilters = useDebouncedValue(filters, 80);
  const downloadName = useMemo(
    () => outputName(inputFile?.name, outputFormat),
    [inputFile?.name, outputFormat],
  );

  const previewStyle = useMemo<CSSProperties>(
    () => ({
      filter: [
        `brightness(${previewFilters.brightness}%)`,
        `contrast(${previewFilters.contrast}%)`,
        `saturate(${previewFilters.saturation}%)`,
        `hue-rotate(${previewFilters.hue}deg)`,
        `blur(${previewFilters.blur}px)`,
        `sepia(${previewFilters.sepia}%)`,
        `grayscale(${previewFilters.grayscale}%)`,
        `invert(${previewFilters.invert}%)`,
        `opacity(${previewFilters.opacity}%)`,
      ].join(" "),
    }),
    [previewFilters],
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
      const { applyFilters } = await import("@/lib/imageProcessor");
      const blob = await applyFilters(inputFile, {
        ...filters,
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
      <Panel title="Adjustments">
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton active={filterTab === "adjust"} onClick={() => setFilterTab("adjust")}>
            Adjust
          </ToggleButton>
          <ToggleButton active={filterTab === "presets"} onClick={() => setFilterTab("presets")}>
            Presets
          </ToggleButton>
        </div>
        {filterTab === "adjust" ? (
          <>
            {[
              ["Brightness", "brightness", 0, 200, "%"],
              ["Contrast", "contrast", 0, 200, "%"],
              ["Saturation", "saturation", 0, 200, "%"],
              ["Hue", "hue", -180, 180, "deg"],
              ["Blur", "blur", 0, 20, "px"],
              ["Sepia", "sepia", 0, 100, "%"],
              ["Grayscale", "grayscale", 0, 100, "%"],
              ["Invert", "invert", 0, 100, "%"],
              ["Opacity", "opacity", 0, 100, "%"],
              ["Sharpness", "sharpness", 0, 10, ""],
            ].map(([label, key, min, max, suffix]) => (
              <RangeControl
                key={String(key)}
                label={String(label)}
                max={Number(max)}
                min={Number(min)}
                suffix={String(suffix)}
                value={filters[key as keyof FilterOptions] as number}
                onChange={(value) =>
                  setFilters((state) => ({
                    ...state,
                    [key as keyof FilterOptions]: value,
                  }))
                }
              />
            ))}
            <p className="border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-5 text-[var(--muted)]">
              Sharpness is applied during processing, so it appears in the
              downloaded output after you process the image.
            </p>
            <button
              className="segmented-button"
              type="button"
              onClick={() =>
                setFilters((state) => ({
                  ...state,
                  ...filterPresets.Original,
                }))
              }
            >
              Reset all
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(filterPresets).map((preset) => (
              <button
                className="segmented-button"
                key={preset}
                type="button"
                onClick={() =>
                  setFilters((state) => ({
                    ...state,
                    ...filterPresets[preset],
                  }))
                }
              >
                {preset}
              </button>
            ))}
          </div>
        )}
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
