"use client";

import { useMemo, useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import {
  ensurePDFName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  Panel,
  PDFInfoPanel,
  TextControl,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function ReorderPDFPagesClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    pageOrder,
    pageThumbnails,
    setCurrentStep,
    setError,
    setOutputBlob,
    setPageOrder,
    setProcessing,
    setProgress,
    totalPages,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-reorder-pdf-pages", "freeconvert-reorder-pdf-pages.pdf"),
  );
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-reorder-pdf-pages.pdf"),
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
      if (!inputFile) throw new Error("Upload a PDF first.");

      const order = pageOrder.length
        ? pageOrder
        : Array.from({ length: totalPages }, (_, index) => index + 1);
      const { reorderPages } = await import("@/lib/pdfProcessor");
      const blob = await reorderPages(inputFile, order);
      setOutputBlob(blob, downloadName);
      progress(100, "Reordered PDF ready.");
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
          <Panel title="Order">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="segmented-button"
                type="button"
                onClick={() => setPageOrder([...pageOrder].reverse())}
              >
                <RotateCcw className="h-4 w-4" />
                Reverse
              </button>
              <button
                className="segmented-button"
                type="button"
                onClick={() => setPageOrder(Array.from({ length: totalPages }, (_, index) => index + 1))}
              >
                <RotateCw className="h-4 w-4" />
                Reset
              </button>
            </div>
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
          <PDFPageGrid
            pageOrder={pageOrder}
            reorderMode
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onPageOrderChange={setPageOrder}
          />
        </div>
      )}
      slug="reorder-pdf-pages"
      onProcess={processPDF}
    />
  );
}
