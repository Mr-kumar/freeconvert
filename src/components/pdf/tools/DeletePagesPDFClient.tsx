"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  ensurePDFName,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import { Panel, PDFInfoPanel, TextControl } from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function DeletePagesPDFClient({}: { defaults: ToolDefaults }) {
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
  const [outputName, setOutputName] = useState("freeconvert-delete-pages");
  const pagesToDelete = useMemo(() => selectedPages, [selectedPages]);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-delete-pages.pdf"),
    [outputName],
  );

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      if (!pagesToDelete.length) throw new Error("Select at least one page to delete.");

      const { deletePDFPages } = await import("@/lib/pdfProcessor");
      const blob = await deletePDFPages(inputFile, pagesToDelete);
      setOutputBlob(blob, downloadName);
      setCurrentStep("PDF ready.");
      setProgress(100);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete PDF pages.");
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
          <Panel title="Delete pages">
            <PageRangeInput
              totalPages={totalPages}
              value={rangeText}
              onChange={(nextValue, pages) => {
                setRangeText(nextValue);
                setSelectedPages(pages);
              }}
            />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      processLabel="Delete selected pages"
      slug="delete-pages-from-pdf"
      onProcess={processPDF}
    />
  );
}
