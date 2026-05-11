"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  ensurePDFName,
  PDFToolShell,
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
import { PDFPreview } from "@/components/pdf/PDFPreview";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function CompressPDFClient({ defaults }: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-compress-pdf", "freeconvert-compress-pdf.pdf"),
  );
  const [compressionLevel, setCompressionLevel] = useState(
    asPDFString(defaults.quality, "medium"),
  );
  const defaultTargetSizeKB = asPDFNumber(defaults.targetSizeKB, 0);
  const [targetSizeKB, setTargetSizeKB] = useState<number | null>(
    defaultTargetSizeKB > 0 ? defaultTargetSizeKB : null,
  );
  const [customImageQuality, setCustomImageQuality] = useState(
    asPDFNumber(defaults.imageQuality, 60),
  );
  const [targetDPI, setTargetDPI] = useState(asPDFNumber(defaults.dpi, 96));
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-compress-pdf.pdf"),
    [outputName],
  );

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
      if (!inputFile) {
        throw new Error("Upload a PDF first.");
      }

      const level = compressionLevel as "low" | "medium" | "high" | "custom";
      const qualityMap = {
        low: 0.42,
        medium: 0.62,
        high: 0.82,
        custom: customImageQuality / 100,
      };
      const dpiMap = {
        low: 72,
        medium: 96,
        high: 150,
        custom: targetDPI,
      };
      const { compressPDF } = await import("@/lib/pdfProcessor");
      const blob = await compressPDF(
        inputFile,
        {
          quality: level,
          imageQuality: qualityMap[level],
          customQuality: customImageQuality / 100,
          downsampleImages: true,
          targetDPI: dpiMap[level] as 72 | 96 | 150 | 300,
          targetSizeKB: targetSizeKB && targetSizeKB > 0 ? targetSizeKB : undefined,
        },
        progress,
      );
      setOutputBlob(blob, downloadName);
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
          <Panel title="Compression">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["low", "Low"],
                ["medium", "Balanced"],
                ["high", "High"],
                ["custom", "Custom"],
              ].map(([value, label]) => (
                <ToggleButton
                  active={compressionLevel === value}
                  key={value}
                  onClick={() => setCompressionLevel(value)}
                >
                  {label}
                </ToggleButton>
              ))}
            </div>
            <NumberControl
              allowEmpty
              label="Target size (KB)"
              max={512000}
              min={0}
              step={10}
              value={targetSizeKB}
              onChange={setTargetSizeKB}
            />
            {compressionLevel === "custom" ? (
              <>
                <RangeControl label="Image quality" max={100} min={10} suffix="%" value={customImageQuality} onChange={setCustomImageQuality} />
                <SelectControl
                  label="Target DPI"
                  options={[72, 96, 150, 300].map((value) => ({
                    label: `${value} DPI`,
                    value: String(value),
                  }))}
                  value={String(targetDPI)}
                  onChange={(value) => setTargetDPI(Number(value))}
                />
              </>
            ) : null}
            <p className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
              Compression rasterizes PDF pages. Text in the compressed PDF may not be selectable. Target size is best effort.
            </p>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<PDFPreview />}
      slug="compress-pdf"
      onProcess={processPDF}
    />
  );
}
