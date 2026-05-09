"use client";

import { useMemo, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import type { ToolDefaults, ToolSlug } from "@/lib/types";
import { replaceFileExtension } from "@/lib/utils";
import { useImageStore } from "@/store/useImageStore";
import {
  asString,
  InfoPanel,
  Panel,
  SelectControl,
  ToolActions,
  ToolFrame,
  UploadPanel,
} from "./shared";

export function BackgroundRemovalClient({
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
  const [replacementColor, setReplacementColor] = useState(
    asString(defaults.replacementColor, "transparent"),
  );
  const downloadName = useMemo(
    () => replaceFileExtension(inputFile?.name || "background-removed.png", "image/png"),
    [inputFile?.name],
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
      const {
        removeBackgroundFromImage,
        replaceTransparentBackground,
      } = await import("@/lib/imageProcessor");
      const removed = await removeBackgroundFromImage(inputFile, setProgress);
      const blob = await replaceTransparentBackground(removed, replacementColor);
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
      <Panel title="Background">
        <p className="border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-5 text-[var(--muted)]">
          First run downloads the AI model to this browser. Later runs reuse
          the cached model.
        </p>
        <SelectControl
          label="Replacement"
          options={[
            { label: "Transparent", value: "transparent" },
            { label: "White", value: "#ffffff" },
            { label: "Black", value: "#000000" },
            { label: "Lime", value: "#b4ff47" },
          ]}
          value={replacementColor}
          onChange={setReplacementColor}
        />
      </Panel>
      <InfoPanel />
      <ToolActions
        downloadName={downloadName}
        outputBlob={outputBlob}
        processLabel="Remove background"
        onProcess={processImage}
      />
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
