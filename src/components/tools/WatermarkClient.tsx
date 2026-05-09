"use client";

import { useMemo, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type {
  ImageFormat,
  ToolDefaults,
  ToolSlug,
  WatermarkPosition,
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
  outputName,
  Panel,
  RangeControl,
  SelectControl,
  ToggleButton,
  ToolActions,
  ToolFrame,
  UploadPanel,
  useAvifSupport,
} from "./shared";

export function WatermarkClient({
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
  const [type, setType] = useState<"text" | "image">(
    asString(defaults.type, "text") === "image" ? "image" : "text",
  );
  const [text, setText] = useState(asString(defaults.text, "FreeConvert"));
  const [fontColor, setFontColor] = useState("#111111");
  const [watermarkFile, setWatermarkFile] = useState<File | undefined>();
  const [position, setPosition] = useState<WatermarkPosition>(
    asBoolean(defaults.tile, false)
      ? "tile"
      : (asString(defaults.position, "bottom-right") as WatermarkPosition),
  );
  const [opacity, setOpacity] = useState(asNumber(defaults.opacity, 50));
  const [fontSize, setFontSize] = useState(48);
  const [scale, setScale] = useState(20);
  const [rotation, setRotation] = useState(0);
  const [padding, setPadding] = useState(32);
  const [tileGap, setTileGap] = useState(96);
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

    if (type === "image" && !watermarkFile) {
      setError("Upload a logo image first.");
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
      const { addWatermark } = await import("@/lib/imageProcessor");
      const blob = await addWatermark(inputFile, {
        type,
        text,
        fontSize,
        fontFamily: "Arial",
        fontColor,
        fontWeight: "bold",
        watermarkFile,
        scale: scale / 100,
        position,
        opacity: opacity / 100,
        rotation,
        padding,
        tileGap,
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
      <Panel title="Watermark">
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton active={type === "text"} onClick={() => setType("text")}>
            Text
          </ToggleButton>
          <ToggleButton active={type === "image"} onClick={() => setType("image")}>
            Image
          </ToggleButton>
        </div>
        {type === "text" ? (
          <>
            <label className="field-label">
              Text
              <input
                className="field-input"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </label>
            <RangeControl
              label="Font size"
              max={200}
              min={10}
              suffix="px"
              value={fontSize}
              onChange={setFontSize}
            />
            <label className="field-label">
              Text color
              <input
                className="field-input h-11"
                type="color"
                value={fontColor}
                onChange={(event) => setFontColor(event.target.value)}
              />
            </label>
          </>
        ) : (
          <label className="field-label">
            Logo image
            <input
              className="field-input"
              type="file"
              accept="image/*"
              onChange={(event) => setWatermarkFile(event.target.files?.[0])}
            />
          </label>
        )}
        <SelectControl
          label="Position"
          options={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "center",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
            "tile",
          ].map((value) => ({ label: value, value }))}
          value={position}
          onChange={(value) => setPosition(value as WatermarkPosition)}
        />
        {type === "image" ? (
          <RangeControl
            label="Logo scale"
            max={60}
            min={5}
            suffix="%"
            value={scale}
            onChange={setScale}
          />
        ) : null}
        <RangeControl
          label="Opacity"
          max={100}
          min={0}
          suffix="%"
          value={opacity}
          onChange={setOpacity}
        />
        <RangeControl
          label="Rotation"
          max={180}
          min={-180}
          suffix="deg"
          value={rotation}
          onChange={setRotation}
        />
        <RangeControl
          label="Padding"
          max={120}
          min={0}
          suffix="px"
          value={padding}
          onChange={setPadding}
        />
        {position === "tile" ? (
          <RangeControl
            label="Tile gap"
            max={240}
            min={20}
            suffix="px"
            value={tileGap}
            onChange={setTileGap}
          />
        ) : null}
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
