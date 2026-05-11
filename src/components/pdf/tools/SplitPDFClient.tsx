"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  baseName,
  ensureZipName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  asPDFString,
  NumberControl,
  Panel,
  PDFInfoPanel,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function SplitPDFClient({ defaults }: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    setCurrentStep,
    setError,
    setOutputBatch,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();
  const [outputName, setOutputName] = useState("freeconvert-split-pdf");
  const [splitMode, setSplitMode] = useState(asPDFString(defaults.mode, "every-page"));
  const [fixedRange, setFixedRange] = useState(asPDFNumber(defaults.fixedRange, 1));
  const [rangeText, setRangeText] = useState("");
  const downloadName = useMemo(
    () => ensureZipName(outputName, "freeconvert-split-pdf.zip"),
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
      if (!inputFile) {
        throw new Error("Upload a PDF first.");
      }

      const { splitPDF } = await import("@/lib/pdfProcessor");
      const blobs = await splitPDF(inputFile, {
        mode: splitMode as "every-page" | "fixed-range" | "custom-ranges",
        fixedRange,
        customRanges: rangeText,
        outputNamePattern: outputName,
      });
      const rootName = baseName(inputFile.name, "split");
      setOutputBatch(
        blobs.map((blob, index) => ({
          blob,
          name: `${rootName}-part-${index + 1}.pdf`,
        })),
      );
      progress(100, "Split files ready.");
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
          <Panel title="Split mode">
            <div className="grid grid-cols-1 gap-2">
              {[
                ["every-page", "Every page"],
                ["fixed-range", "By range size"],
                ["custom-ranges", "Custom ranges"],
              ].map(([value, label]) => (
                <ToggleButton
                  active={splitMode === value}
                  key={value}
                  onClick={() => setSplitMode(value)}
                >
                  {label}
                </ToggleButton>
              ))}
            </div>
            {splitMode === "fixed-range" ? (
              <NumberControl label="Pages per file" min={1} value={fixedRange} onChange={setFixedRange} />
            ) : null}
            {splitMode === "custom-ranges" ? (
              <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            ) : null}
            <TextControl label="ZIP file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<PDFPreview />}
      slug="split-pdf"
      onProcess={processPDF}
    />
  );
}
