"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import {
  ensureZipName,
  OutputBatchPreview,
  pagePatternName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  asPDFString,
  Panel,
  PDFInfoPanel,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function PDFToImageClient({ defaults }: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    pageThumbnails,
    selectedPages,
    setCurrentStep,
    setError,
    setOutputBatch,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();
  const [outputName, setOutputName] = useState("freeconvert-convert-pdf-to-image");
  const [rangeText, setRangeText] = useState("");
  const [imageFormat, setImageFormat] = useState(
    asPDFString(defaults.format, "jpeg") as "jpeg" | "png" | "webp",
  );
  const [imageQuality, setImageQuality] = useState(asPDFNumber(defaults.quality, 90));
  const [imageDPI, setImageDPI] = useState(asPDFNumber(defaults.dpi, 150));
  const [imageScale, setImageScale] = useState(1);
  const [imagePattern, setImagePattern] = useState("page-{n}");
  const activePages = useMemo(() => {
    if (!totalPages) return [];
    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);
  const downloadName = useMemo(
    () => ensureZipName(outputName, "freeconvert-convert-pdf-to-image.zip"),
    [outputName],
  );

  function pageSelectionRange(nextValue: string, pages: number[]) {
    setRangeText(nextValue);
    setSelectedPages(pages);
  }

  function progress(value: number, step?: string) {
    setProgress(value);
    if (step) setCurrentStep(step);
  }

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      if (!activePages.length) throw new Error("Select at least one page.");

      const { pdfToImages } = await import("@/lib/pdfProcessor");
      const blobs = await pdfToImages(
        inputFile,
        {
          format: imageFormat,
          quality: imageQuality / 100,
          dpi: imageDPI as 72 | 96 | 150 | 300 | 600,
          pages: activePages,
          scale: imageScale,
          outputNamePattern: imagePattern,
        },
        progress,
      );
      const extension = imageFormat === "jpeg" ? "jpg" : imageFormat;
      setOutputBatch(
        blobs.map((blob, index) => ({
          blob,
          name: pagePatternName(imagePattern, activePages[index] || index + 1, index, extension),
        })),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  const preview = outputBatch.length > 0 ? (
    <div className="space-y-5 p-4 sm:p-6">
      <OutputBatchPreview items={outputBatch} title="Converted images ready" />
      <PDFPageGrid
        selectedPages={selectedPages}
        thumbnails={pageThumbnails}
        totalPages={totalPages}
        onSelectedPagesChange={setSelectedPages}
      />
    </div>
  ) : (
    <div className="space-y-5 p-4 sm:p-6">
      <PDFPageGrid
        selectedPages={selectedPages}
        thumbnails={pageThumbnails}
        totalPages={totalPages}
        onSelectedPagesChange={setSelectedPages}
      />
    </div>
  );

  return (
    <PDFToolShell
      controls={(
        <>
          <Panel title="PDF">
            <PDFUploader kind="pdf" label="Add PDF" />
          </Panel>
          <Panel title="Images">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-3 gap-2">
              {(["jpeg", "png", "webp"] as const).map((value) => (
                <ToggleButton active={imageFormat === value} key={value} onClick={() => setImageFormat(value)}>
                  {value.toUpperCase()}
                </ToggleButton>
              ))}
            </div>
            {imageFormat !== "png" ? (
              <RangeControl label="Quality" max={100} min={10} suffix="%" value={imageQuality} onChange={setImageQuality} />
            ) : null}
            <SelectControl
              label="Resolution"
              options={[72, 96, 150, 300, 600].map((value) => ({
                label: `${value} DPI`,
                value: String(value),
              }))}
              value={String(imageDPI)}
              onChange={(value) => setImageDPI(Number(value))}
            />
            <SelectControl
              label="Scale"
              options={[1, 1.5, 2].map((value) => ({
                label: `${value}x`,
                value: String(value),
              }))}
              value={String(imageScale)}
              onChange={(value) => setImageScale(Number(value))}
            />
            <TextControl label="File name pattern" value={imagePattern} onChange={setImagePattern} />
            <TextControl label="ZIP file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={preview}
      slug="convert-pdf-to-image"
      onProcess={processPDF}
    />
  );
}
