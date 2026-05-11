"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import {
  ensurePDFName,
  PDFToolShell,
  positionOptions,
  positionToPercent,
  WatermarkLivePreview,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  asPDFString,
  NumberControl,
  Panel,
  PDFInfoPanel,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { PDFPosition, ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function WatermarkPDFClient({ defaults }: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    pageThumbnails,
    selectedPages,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-add-watermark-to-pdf", "freeconvert-add-watermark-to-pdf.pdf"),
  );
  const [rangeText, setRangeText] = useState("");
  const [watermarkType, setWatermarkType] = useState<"text" | "image">(
    asPDFString(defaults.type, "text") === "image" ? "image" : "text",
  );
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("#e5322d");
  const [watermarkOpacity, setWatermarkOpacity] = useState(
    asPDFNumber(defaults.opacity, 30),
  );
  const [watermarkRotation, setWatermarkRotation] = useState(-35);
  const [watermarkPosition, setWatermarkPosition] = useState<PDFPosition>(
    asPDFString(defaults.position, "center") as PDFPosition,
  );
  const initialWatermarkPercent = positionToPercent(
    asPDFString(defaults.position, "center") as PDFPosition,
  );
  const [watermarkX, setWatermarkX] = useState(initialWatermarkPercent.x);
  const [watermarkY, setWatermarkY] = useState(initialWatermarkPercent.y);
  const [watermarkScale, setWatermarkScale] = useState(25);
  const activePages = useMemo(() => {
    if (!totalPages) return [];
    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-add-watermark-to-pdf.pdf"),
    [outputName],
  );

  function pageSelectionRange(nextValue: string, pages: number[]) {
    setRangeText(nextValue);
    setSelectedPages(pages);
  }

  function updateWatermarkPosition(position: PDFPosition) {
    const next = positionToPercent(position);
    setWatermarkPosition(position);
    setWatermarkX(next.x);
    setWatermarkY(next.y);
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
      if (watermarkType === "image" && !watermarkImage) {
        throw new Error("Upload a watermark image first.");
      }

      const { addWatermarkToPDF } = await import("@/lib/pdfProcessor");
      const blob = await addWatermarkToPDF(inputFile, {
        type: watermarkType,
        text: watermarkText,
        watermarkFile: watermarkImage || undefined,
        imageScale: watermarkScale / 100,
        fontSize: watermarkFontSize,
        fontFamily: "Helvetica",
        fontColor: watermarkColor,
        pages: activePages,
        position: watermarkPosition,
        customXPercent: watermarkX,
        customYPercent: watermarkY,
        opacity: watermarkOpacity / 100,
        rotation: watermarkRotation,
        layer: "above",
      });
      setOutputBlob(blob, downloadName);
      progress(100, "Watermarked PDF ready.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  return (
    <PDFToolShell
      controls={(
        <>
          <Panel title="PDF">
            <PDFUploader kind="pdf" label="Add PDF" />
          </Panel>
          <Panel title="Watermark">
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={watermarkType === "text"} onClick={() => setWatermarkType("text")}>
                Text
              </ToggleButton>
              <ToggleButton active={watermarkType === "image"} onClick={() => setWatermarkType("image")}>
                Image
              </ToggleButton>
            </div>
            {watermarkType === "text" ? (
              <>
                <TextControl label="Text" value={watermarkText} onChange={setWatermarkText} />
                <RangeControl label="Font size" max={160} min={10} suffix="pt" value={watermarkFontSize} onChange={setWatermarkFontSize} />
                <label className="field-label">
                  Color
                  <input className="field-input h-11" type="color" value={watermarkColor} onChange={(event) => setWatermarkColor(event.target.value)} />
                </label>
              </>
            ) : (
              <label className="field-label">
                Watermark image
                <input
                  className="field-input"
                  accept="image/png,image/jpeg"
                  type="file"
                  onChange={(event) => setWatermarkImage(event.target.files?.[0] || null)}
                />
              </label>
            )}
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <SelectControl label="Position" options={positionOptions} value={watermarkPosition} onChange={updateWatermarkPosition} />
            <div className="grid grid-cols-2 gap-3">
              <NumberControl label="X position (%)" max={100} min={0} value={Math.round(watermarkX)} onChange={setWatermarkX} />
              <NumberControl label="Y position (%)" max={100} min={0} value={Math.round(watermarkY)} onChange={setWatermarkY} />
            </div>
            <RangeControl label="Opacity" max={100} min={0} suffix="%" value={watermarkOpacity} onChange={setWatermarkOpacity} />
            <RangeControl label="Rotation" max={180} min={-180} suffix="deg" value={watermarkRotation} onChange={setWatermarkRotation} />
            {watermarkType === "image" ? (
              <RangeControl label="Image scale" max={80} min={5} suffix="%" value={watermarkScale} onChange={setWatermarkScale} />
            ) : null}
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={(
        <div className="space-y-5 p-4 sm:p-6">
          <WatermarkLivePreview
            imageFile={watermarkImage}
            opacity={watermarkOpacity}
            pageThumbnail={pageThumbnails[0]}
            rotation={watermarkRotation}
            scale={watermarkScale}
            text={watermarkText}
            textColor={watermarkColor}
            textSize={watermarkFontSize}
            type={watermarkType}
            x={watermarkX}
            y={watermarkY}
            onChange={({ x, y }) => {
              setWatermarkX(x);
              setWatermarkY(y);
            }}
          />
          <PDFPageGrid
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onSelectedPagesChange={setSelectedPages}
          />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
            Drag the watermark in the preview or adjust X/Y values. The same
            placement is applied to selected pages in the downloaded PDF.
          </div>
        </div>
      )}
      slug="add-watermark-to-pdf"
      onProcess={processPDF}
    />
  );
}
