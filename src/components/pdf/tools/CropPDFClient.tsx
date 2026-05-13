"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  ensurePDFName,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import { NumberControl, Panel, PDFInfoPanel, TextControl } from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function CropPDFClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    selectedPages,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();
  const [rangeText, setRangeText] = useState("");
  const [topMM, setTopMM] = useState(10);
  const [rightMM, setRightMM] = useState(10);
  const [bottomMM, setBottomMM] = useState(10);
  const [leftMM, setLeftMM] = useState(10);
  const [outputName, setOutputName] = useState("freeconvert-crop-pdf");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-crop-pdf.pdf"),
    [outputName],
  );

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      const { cropPDFPages } = await import("@/lib/pdfProcessor");
      const blob = await cropPDFPages(inputFile, {
        pages: selectedPages.length ? selectedPages : "all",
        topMM,
        rightMM,
        bottomMM,
        leftMM,
      });
      setOutputBlob(blob, downloadName);
      setCurrentStep("Cropped PDF ready.");
      setProgress(100);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not crop this PDF.");
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
          <Panel title="Pages">
            <PageRangeInput
              totalPages={totalPages}
              value={rangeText}
              onChange={(nextValue, pages) => {
                setRangeText(nextValue);
                setSelectedPages(pages);
              }}
            />
          </Panel>
          <Panel title="Crop margins">
            <div className="grid grid-cols-2 gap-3">
              <NumberControl label="Top (mm)" max={100} min={0} value={topMM} onChange={setTopMM} />
              <NumberControl label="Right (mm)" max={100} min={0} value={rightMM} onChange={setRightMM} />
              <NumberControl label="Bottom (mm)" max={100} min={0} value={bottomMM} onChange={setBottomMM} />
              <NumberControl label="Left (mm)" max={100} min={0} value={leftMM} onChange={setLeftMM} />
            </div>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      processLabel="Crop PDF"
      slug="crop-pdf"
      onProcess={processPDF}
    />
  );
}
