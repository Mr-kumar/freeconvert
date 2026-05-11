"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  baseName,
  ensurePDFName,
  ensureZipName,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import {
  Panel,
  PDFInfoPanel,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function ExtractPDFPagesClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    selectedPages,
    setCurrentStep,
    setError,
    setOutputBatch,
    setOutputBlob,
    setProcessing,
    setProgress,
    setSelectedPages,
    totalPages,
  } = usePDFStore();
  const [outputName, setOutputName] = useState("freeconvert-extract-pdf-pages");
  const [rangeText, setRangeText] = useState("");
  const [extractAsSingle, setExtractAsSingle] = useState(true);
  const activePages = useMemo(() => {
    if (!totalPages) return [];
    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);
  const downloadName = useMemo(() => {
    if (!extractAsSingle) {
      return ensureZipName(outputName, "extracted-pages.zip");
    }

    return ensurePDFName(outputName, "freeconvert-extract-pdf-pages.pdf");
  }, [extractAsSingle, outputName]);

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

      const { extractPages } = await import("@/lib/pdfProcessor");
      const result = await extractPages(inputFile, {
        pages: activePages,
        outputNamePattern: outputName,
        asSingleFile: extractAsSingle,
      });

      if (Array.isArray(result)) {
        const rootName = baseName(inputFile.name, "extracted");
        setOutputBatch(
          result.map((blob, index) => ({
            blob,
            name: `${rootName}-page-${activePages[index]}.pdf`,
          })),
        );
      } else {
        setOutputBlob(result, downloadName);
      }

      progress(100, "Extracted pages ready.");
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
          <Panel title="Extract">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={extractAsSingle} onClick={() => setExtractAsSingle(true)}>
                Single PDF
              </ToggleButton>
              <ToggleButton active={!extractAsSingle} onClick={() => setExtractAsSingle(false)}>
                Separate PDFs
              </ToggleButton>
            </div>
            <TextControl label={extractAsSingle ? "Output file name" : "ZIP file name"} value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      slug="extract-pdf-pages"
      onProcess={processPDF}
    />
  );
}
