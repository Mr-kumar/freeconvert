"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type {
  ImageFormat,
  ResizeUnit,
  ToolDefaults,
  ToolSlug,
} from "@/lib/types";
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

type NumberFieldValue = number | "";

interface ResizePreset {
  id: string;
  label: string;
  details: string;
  group?: GovtPresetGroup;
  width?: number;
  height?: number;
  unit?: ResizeUnit;
  dpi?: number;
  targetSizeKB?: number;
  minSizeKB?: number;
  maxSizeKB?: number;
  outputFormat?: ImageFormat;
  quality?: number;
}

type GovtPresetGroup = "SSC" | "UPSC" | "NTA" | "IBPS/SBI";

const DEFAULT_DPI = 300;

const QUICK_SIZE_PRESETS: ResizePreset[] = [
  { id: "hd", label: "HD", details: "1280 x 720 px", width: 1280, height: 720, unit: "px" },
  { id: "full-hd", label: "Full HD", details: "1920 x 1080 px", width: 1920, height: 1080, unit: "px" },
  { id: "square", label: "Square", details: "1080 x 1080 px", width: 1080, height: 1080, unit: "px" },
  { id: "4k", label: "4K", details: "3840 x 2160 px", width: 3840, height: 2160, unit: "px" },
];

const GOVT_EXAM_PRESETS: ResizePreset[] = [
  {
    id: "ssc-photo",
    label: "SSC Photo",
    details: "3.5 x 4.5 cm, 20-50 KB JPG",
    group: "SSC",
    width: 3.5,
    height: 4.5,
    unit: "cm",
    dpi: DEFAULT_DPI,
    targetSizeKB: 48,
    minSizeKB: 20,
    maxSizeKB: 50,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "ssc-signature",
    label: "SSC Signature",
    details: "4.0 x 2.0 cm, 10-20 KB JPG",
    group: "SSC",
    width: 4,
    height: 2,
    unit: "cm",
    dpi: DEFAULT_DPI,
    targetSizeKB: 18,
    minSizeKB: 10,
    maxSizeKB: 20,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "upsc-photo",
    label: "UPSC Photo",
    details: "Keep crop, 20-200 KB JPG",
    group: "UPSC",
    targetSizeKB: 190,
    minSizeKB: 20,
    maxSizeKB: 200,
    outputFormat: "image/jpeg",
    quality: 88,
  },
  {
    id: "nta-photo",
    label: "NTA Photo",
    details: "3.5 x 4.5 cm, 10-200 KB JPG",
    group: "NTA",
    width: 3.5,
    height: 4.5,
    unit: "cm",
    dpi: DEFAULT_DPI,
    targetSizeKB: 190,
    minSizeKB: 10,
    maxSizeKB: 200,
    outputFormat: "image/jpeg",
    quality: 88,
  },
  {
    id: "nta-signature",
    label: "NTA Signature",
    details: "3.5 x 1.5 cm, 4-30 KB JPG",
    group: "NTA",
    width: 3.5,
    height: 1.5,
    unit: "cm",
    dpi: DEFAULT_DPI,
    targetSizeKB: 28,
    minSizeKB: 4,
    maxSizeKB: 30,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "ibps-sbi-photo",
    label: "IBPS/SBI Photo",
    details: "200 x 230 px, 20-50 KB JPG",
    group: "IBPS/SBI",
    width: 200,
    height: 230,
    unit: "px",
    targetSizeKB: 48,
    minSizeKB: 20,
    maxSizeKB: 50,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "ibps-sbi-signature",
    label: "IBPS/SBI Signature",
    details: "140 x 60 px, 10-20 KB JPG",
    group: "IBPS/SBI",
    width: 140,
    height: 60,
    unit: "px",
    targetSizeKB: 18,
    minSizeKB: 10,
    maxSizeKB: 20,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "ibps-thumb",
    label: "IBPS Thumb",
    details: "240 x 240 px, 20-50 KB JPG",
    group: "IBPS/SBI",
    width: 240,
    height: 240,
    unit: "px",
    targetSizeKB: 48,
    minSizeKB: 20,
    maxSizeKB: 50,
    outputFormat: "image/jpeg",
    quality: 85,
  },
  {
    id: "ibps-declaration",
    label: "IBPS Declaration",
    details: "800 x 400 px, 50-100 KB JPG",
    group: "IBPS/SBI",
    width: 800,
    height: 400,
    unit: "px",
    dpi: 200,
    targetSizeKB: 96,
    minSizeKB: 50,
    maxSizeKB: 100,
    outputFormat: "image/jpeg",
    quality: 85,
  },
];

const ALL_PRESETS = [...QUICK_SIZE_PRESETS, ...GOVT_EXAM_PRESETS];
const GOVT_PRESET_GROUPS: GovtPresetGroup[] = ["SSC", "UPSC", "NTA", "IBPS/SBI"];

function asResizeUnit(value: unknown): ResizeUnit {
  const unit = asString(value, "px");

  if (unit === "percent" || unit === "cm") {
    return unit;
  }

  return "px";
}

function optionalNumber(value: unknown): NumberFieldValue {
  const parsed = asNumber(value, 0);
  return parsed > 0 ? parsed : "";
}

function positiveNumber(value: NumberFieldValue) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function normalizedDpi(value: NumberFieldValue) {
  const dpi = positiveNumber(value) || DEFAULT_DPI;
  return Math.min(Math.max(dpi, 1), 1200);
}

function cmToPx(value: number, dpi: number) {
  return (value / 2.54) * dpi;
}

function pxToCm(value: number, dpi: number) {
  return (value / dpi) * 2.54;
}

function formatCm(value: number) {
  return value.toFixed(2);
}

function valuesMatch(value: NumberFieldValue, expected: number | undefined) {
  return expected === undefined || Math.abs(positiveNumber(value) - expected) < 0.01;
}

function dimensionLabel(axis: "Width" | "Height", unit: ResizeUnit) {
  if (unit === "percent") {
    return `${axis} %`;
  }

  return `${axis} ${unit}`;
}

function inputStep(unit: ResizeUnit) {
  return unit === "cm" || unit === "percent" ? 0.01 : 1;
}

function ratioAdjustedValue(value: number, aspect: number, axis: "width" | "height", unit: ResizeUnit) {
  const nextValue = axis === "width" ? value / aspect : value * aspect;
  return unit === "cm" ? Number(nextValue.toFixed(2)) : Math.max(1, Math.round(nextValue));
}

function resolveOutputEstimate({
  dpi,
  height,
  inputHeight,
  inputWidth,
  maintainAspectRatio,
  unit,
  width,
}: {
  dpi: number;
  height: NumberFieldValue;
  inputHeight?: number;
  inputWidth?: number;
  maintainAspectRatio: boolean;
  unit: ResizeUnit;
  width: NumberFieldValue;
}) {
  const hasInput = Boolean(inputWidth && inputHeight);
  const aspect = hasInput ? Number(inputWidth) / Number(inputHeight) : 1;
  let outputWidth = positiveNumber(width);
  let outputHeight = positiveNumber(height);

  if (unit === "cm") {
    outputWidth = outputWidth ? cmToPx(outputWidth, dpi) : 0;
    outputHeight = outputHeight ? cmToPx(outputHeight, dpi) : 0;
  } else if (unit === "percent") {
    if (!hasInput) {
      return null;
    }

    const widthPercent = outputWidth || (maintainAspectRatio && outputHeight ? outputHeight : 100);
    const heightPercent = outputHeight || (maintainAspectRatio && outputWidth ? outputWidth : 100);
    outputWidth = Number(inputWidth) * (widthPercent / 100);
    outputHeight = Number(inputHeight) * (heightPercent / 100);
  }

  if (!outputWidth && !outputHeight) {
    if (!hasInput) {
      return null;
    }

    outputWidth = Number(inputWidth);
    outputHeight = Number(inputHeight);
  } else if (maintainAspectRatio && hasInput) {
    if (outputWidth && !outputHeight) {
      outputHeight = outputWidth / aspect;
    } else if (!outputWidth && outputHeight) {
      outputWidth = outputHeight * aspect;
    } else if (outputWidth && outputHeight) {
      outputHeight = outputWidth / aspect;
    }
  } else if (hasInput) {
    outputWidth = outputWidth || Number(inputWidth);
    outputHeight = outputHeight || Number(inputHeight);
  }

  if (!outputWidth || !outputHeight) {
    return null;
  }

  const widthPx = Math.max(1, Math.round(outputWidth));
  const heightPx = Math.max(1, Math.round(outputHeight));

  return {
    heightCm: pxToCm(heightPx, dpi),
    heightPx,
    widthCm: pxToCm(widthPx, dpi),
    widthPx,
  };
}

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
  const [width, setWidth] = useState<NumberFieldValue>(optionalNumber(defaults.width));
  const [height, setHeight] = useState<NumberFieldValue>(optionalNumber(defaults.height));
  const [unit, setUnit] = useState<ResizeUnit>(asResizeUnit(defaults.unit));
  const [dpi, setDpi] = useState<NumberFieldValue>(
    asNumber(defaults.dpi, DEFAULT_DPI),
  );
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(
    asBoolean(defaults.maintainAspectRatio, false),
  );
  const [targetSizeKB, setTargetSizeKB] = useState<NumberFieldValue>(
    optionalNumber(defaults.targetSizeKB),
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presetGroup, setPresetGroup] = useState<GovtPresetGroup>("SSC");
  const initializedInputKey = useRef<string | null>(null);
  const outputDpi = normalizedDpi(dpi);
  const downloadName = useMemo(
    () => outputName(inputFile?.name, outputFormat),
    [inputFile?.name, outputFormat],
  );
  const inputFileKey = inputFile
    ? `${inputFile.name}:${inputFile.size}:${inputFile.lastModified}`
    : "";
  const outputEstimate = useMemo(
    () =>
      resolveOutputEstimate({
        dpi: outputDpi,
        height,
        inputHeight: inputInfo?.height,
        inputWidth: inputInfo?.width,
        maintainAspectRatio,
        unit,
        width,
      }),
    [height, inputInfo?.height, inputInfo?.width, maintainAspectRatio, outputDpi, unit, width],
  );
  const activePreset = useMemo(
    () => ALL_PRESETS.find((preset) => preset.id === selectedPresetId),
    [selectedPresetId],
  );
  const visibleGovtPresets = useMemo(
    () => GOVT_EXAM_PRESETS.filter((preset) => preset.group === presetGroup),
    [presetGroup],
  );
  const presetSizeStatus = useMemo(() => {
    if (!activePreset || !outputInfo || (!activePreset.minSizeKB && !activePreset.maxSizeKB)) {
      return null;
    }

    const outputSizeKB = outputInfo.fileSize / 1024;
    const minSize = activePreset.minSizeKB ?? 0;
    const maxSize = activePreset.maxSizeKB ?? Number.POSITIVE_INFINITY;

    if (outputSizeKB >= minSize && outputSizeKB <= maxSize) {
      return {
        tone: "success",
        text: `${outputSizeKB.toFixed(1)} KB fits ${activePreset.label}.`,
      };
    }

    return {
      tone: "warning",
      text: `${outputSizeKB.toFixed(1)} KB is outside ${activePreset.label}'s ${minSize}-${maxSize} KB range.`,
    };
  }, [activePreset, outputInfo]);

  useEffect(() => {
    if (!inputInfo || !inputFileKey || unit !== "px") {
      return;
    }

    if (initializedInputKey.current === inputFileKey) {
      return;
    }

    initializedInputKey.current = inputFileKey;

    if (positiveNumber(width) === 0 && positiveNumber(height) === 0) {
      const frame = requestAnimationFrame(() => {
        setWidth(inputInfo.width);
        setHeight(inputInfo.height);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [height, inputFileKey, inputInfo, unit, width]);

  function updateWidth(value: NumberFieldValue) {
    setSelectedPresetId(null);
    setWidth(value);

    const nextWidth = positiveNumber(value);

    if (!maintainAspectRatio || !nextWidth) {
      return;
    }

    if (unit === "percent") {
      setHeight(value);
      return;
    }

    if (inputInfo) {
      setHeight(
        ratioAdjustedValue(
          nextWidth,
          inputInfo.width / inputInfo.height,
          "width",
          unit,
        ),
      );
    }
  }

  function updateHeight(value: NumberFieldValue) {
    setSelectedPresetId(null);
    setHeight(value);

    const nextHeight = positiveNumber(value);

    if (!maintainAspectRatio || !nextHeight) {
      return;
    }

    if (unit === "percent") {
      setWidth(value);
      return;
    }

    if (inputInfo) {
      setWidth(
        ratioAdjustedValue(
          nextHeight,
          inputInfo.width / inputInfo.height,
          "height",
          unit,
        ),
      );
    }
  }

  function updateUnit(nextUnit: ResizeUnit) {
    setSelectedPresetId(null);

    if (nextUnit === unit) {
      return;
    }

    if (outputEstimate) {
      if (nextUnit === "px") {
        setWidth(outputEstimate.widthPx);
        setHeight(outputEstimate.heightPx);
      } else if (nextUnit === "cm") {
        setWidth(Number(outputEstimate.widthCm.toFixed(2)));
        setHeight(Number(outputEstimate.heightCm.toFixed(2)));
      } else if (inputInfo) {
        setWidth(Number(((outputEstimate.widthPx / inputInfo.width) * 100).toFixed(2)));
        setHeight(Number(((outputEstimate.heightPx / inputInfo.height) * 100).toFixed(2)));
      }
    }

    setUnit(nextUnit);
  }

  function applyPreset(preset: ResizePreset) {
    setSelectedPresetId(preset.id);
    setMaintainAspectRatio(false);

    if (preset.unit) {
      setUnit(preset.unit);
    }

    if (preset.dpi) {
      setDpi(preset.dpi);
    }

    if (preset.width !== undefined) {
      setWidth(preset.width);
    }

    if (preset.height !== undefined) {
      setHeight(preset.height);
    }

    if (preset.targetSizeKB !== undefined) {
      setTargetSizeKB(preset.targetSizeKB);
    }

    if (preset.outputFormat) {
      setOutputFormat(preset.outputFormat);
    }

    if (preset.quality) {
      setQuality(preset.quality);
    }
  }

  function isPresetActive(preset: ResizePreset) {
    if (selectedPresetId === preset.id) {
      return true;
    }

    if (!preset.unit || preset.unit !== unit) {
      return false;
    }

    return valuesMatch(width, preset.width) && valuesMatch(height, preset.height);
  }

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
      const targetSize = positiveNumber(targetSizeKB);
      const blob = await resizeImage(inputFile, {
        width: positiveNumber(width),
        height: positiveNumber(height),
        unit,
        dpi: outputDpi,
        maintainAspectRatio,
        outputFormat,
        quality: quality / 100,
        targetSizeKB: targetSize > 0 ? targetSize : undefined,
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
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          <NumberControl
            allowEmpty
            label={dimensionLabel("Width", unit)}
            min={0}
            step={inputStep(unit)}
            value={width}
            onChange={updateWidth}
          />
          <NumberControl
            allowEmpty
            label={dimensionLabel("Height", unit)}
            min={0}
            step={inputStep(unit)}
            value={height}
            onChange={updateHeight}
          />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
          <ToggleButton active={unit === "px"} onClick={() => updateUnit("px")}>
            PX
          </ToggleButton>
          <ToggleButton active={unit === "cm"} onClick={() => updateUnit("cm")}>
            CM
          </ToggleButton>
          <ToggleButton active={unit === "percent"} onClick={() => updateUnit("percent")}>
            %
          </ToggleButton>
        </div>
        {unit !== "percent" ? (
          <NumberControl
            allowEmpty
            label="Print DPI"
            max={1200}
            min={1}
            step={1}
            value={dpi}
            onChange={(value) => {
              setSelectedPresetId(null);
              setDpi(value);
            }}
          />
        ) : null}
        <ToggleButton
          active={maintainAspectRatio}
          onClick={() => {
            setSelectedPresetId(null);
            setMaintainAspectRatio(!maintainAspectRatio);
          }}
        >
          Lock aspect ratio
        </ToggleButton>
        {outputEstimate ? (
          <dl className="grid min-w-0 grid-cols-1 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] text-xs sm:grid-cols-2">
            <div className="bg-[var(--surface-2)] p-3">
              <dt className="font-mono text-[var(--muted)]">Pixels</dt>
              <dd className="mt-1 font-semibold text-[var(--text)]">
                {outputEstimate.widthPx.toLocaleString()} x{" "}
                {outputEstimate.heightPx.toLocaleString()}
              </dd>
            </div>
            <div className="bg-[var(--surface-2)] p-3">
              <dt className="font-mono text-[var(--muted)]">
                CM @ {outputDpi} DPI
              </dt>
              <dd className="mt-1 font-semibold text-[var(--text)]">
                {formatCm(outputEstimate.widthCm)} x {formatCm(outputEstimate.heightCm)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-xs leading-5 text-[var(--muted)]">
            Upload an image to preview percentage output.
          </p>
        )}
        <NumberControl
          allowEmpty
          label="Target file size max (KB)"
          max={51200}
          min={0}
          step={1}
          value={targetSizeKB}
          onChange={(value) => {
            setSelectedPresetId(null);
            setTargetSizeKB(value);
          }}
        />
        <p className="text-xs leading-5 text-[var(--muted)]">
          Leave blank to use quality only. JPG, WebP and AVIF can target KB; PNG may stay larger.
        </p>
      </Panel>
      <Panel title="Quick sizes">
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
          {QUICK_SIZE_PRESETS.map((preset) => (
            <ToggleButton
              active={isPresetActive(preset)}
              className="min-h-16 w-full flex-col items-start justify-center text-left"
              key={preset.id}
              onClick={() => applyPreset(preset)}
            >
              <span className="block w-full min-w-0 break-words">{preset.label}</span>
              <span className="block w-full min-w-0 break-words text-[0.68rem] font-semibold leading-4 text-[var(--muted)]">
                {preset.details}
              </span>
            </ToggleButton>
          ))}
        </div>
      </Panel>
      <Panel title="Government exam presets">
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-4">
          {GOVT_PRESET_GROUPS.map((group) => (
            <ToggleButton
              active={presetGroup === group}
              key={group}
              onClick={() => setPresetGroup(group)}
            >
              {group}
            </ToggleButton>
          ))}
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-2">
          {visibleGovtPresets.map((preset) => (
            <ToggleButton
              active={isPresetActive(preset)}
              className="min-h-16 w-full flex-col items-start justify-center text-left"
              key={preset.id}
              onClick={() => applyPreset(preset)}
            >
              <span className="block w-full min-w-0 break-words">{preset.label}</span>
              <span className="block w-full min-w-0 break-words text-[0.68rem] font-semibold leading-4 text-[var(--muted)]">
                {preset.details}
              </span>
            </ToggleButton>
          ))}
        </div>
        {activePreset ? (
          <p className="text-xs leading-5 text-[var(--muted)]">
            Active: {activePreset.label}. Check the latest exam notice before final upload.
          </p>
        ) : null}
      </Panel>
      <InfoPanel />
      {presetSizeStatus ? (
        <Panel title="Preset check">
          <p
            className={
              presetSizeStatus.tone === "success"
                ? "text-sm font-semibold text-[var(--success)]"
                : "text-sm font-semibold text-[var(--warning)]"
            }
          >
            {presetSizeStatus.text}
          </p>
        </Panel>
      ) : null}
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
        onProcess={processImage}
      >
        <FormatControl
          value={outputFormat}
          onChange={(format) => {
            setSelectedPresetId(null);
            setOutputFormat(format);
          }}
        />
        {outputFormat !== "image/png" ? (
          <RangeControl
            label="Quality"
            max={100}
            min={1}
            suffix="%"
            value={quality}
            onChange={(value) => {
              setSelectedPresetId(null);
              setQuality(value);
            }}
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
