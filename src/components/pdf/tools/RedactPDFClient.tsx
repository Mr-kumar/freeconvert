"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  ensurePDFName,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import {
  NumberControl,
  Panel,
  PDFInfoPanel,
  RangeControl,
  TextControl,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function RedactPDFClient({}: { defaults: ToolDefaults }) {
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
  const [xPercent, setXPercent] = useState(20);
  const [yPercent, setYPercent] = useState(20);
  const [widthPercent, setWidthPercent] = useState(50);
  const [heightPercent, setHeightPercent] = useState(10);
  const [dpi, setDpi] = useState(144);
  const [fillColor, setFillColor] = useState("#000000");
  const [outputName, setOutputName] = useState("freeconvert-redact-pdf");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-redact-pdf.pdf"),
    [outputName],
  );

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      const { redactPDF } = await import("@/lib/pdfProcessor");
      const blob = await redactPDF(
        inputFile,
        {
          pages: selectedPages.length ? selectedPages : "all",
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          fillColor,
          dpi,
        },
        (nextProgress, step) => {
          setProgress(nextProgress);
          if (step) setCurrentStep(step);
        },
      );
      setOutputBlob(blob, downloadName);
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not redact this PDF.");
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
          <Panel title="Redaction area">
            <div className="grid grid-cols-2 gap-3">
              <NumberControl label="X %" max={100} min={0} value={xPercent} onChange={setXPercent} />
              <NumberControl label="Y %" max={100} min={0} value={yPercent} onChange={setYPercent} />
              <NumberControl label="Width %" max={100} min={1} value={widthPercent} onChange={setWidthPercent} />
              <NumberControl label="Height %" max={100} min={1} value={heightPercent} onChange={setHeightPercent} />
            </div>
            <label className="field-label">
              Fill color
              <input className="field-input h-11" type="color" value={fillColor} onChange={(event) => setFillColor(event.target.value)} />
            </label>
            <RangeControl label="Raster DPI" max={200} min={96} value={dpi} onChange={setDpi} />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      processLabel="Redact PDF"
      slug="redact-pdf"
      onProcess={processPDF}
    />
  );
}
