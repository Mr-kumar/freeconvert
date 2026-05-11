"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import { PDFPageGrid } from "@/components/pdf/PDFPageGrid";
import {
  ensurePDFName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  Panel,
  PDFInfoPanel,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function RotatePDFClient({ defaults }: { defaults: ToolDefaults }) {
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
    ensurePDFName("freeconvert-rotate-pdf", "freeconvert-rotate-pdf.pdf"),
  );
  const [rangeText, setRangeText] = useState("");
  const [rotationDegrees, setRotationDegrees] = useState<90 | 180 | 270>(
    asPDFNumber(defaults.degrees, 90) === 180
      ? 180
      : asPDFNumber(defaults.degrees, 90) === 270
        ? 270
        : 90,
  );
  const [previewRotations, setPreviewRotations] = useState<Record<number, number>>({});
  const activePages = useMemo(() => {
    if (!totalPages) return [];
    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-rotate-pdf.pdf"),
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

      const { rotatePDF } = await import("@/lib/pdfProcessor");
      const blob = await rotatePDF(inputFile, {
        pages: activePages,
        degrees: rotationDegrees,
      });
      setOutputBlob(blob, downloadName);
      setPreviewRotations((state) => {
        const next = { ...state };
        activePages.forEach((page) => {
          next[page] = ((next[page] || 0) + rotationDegrees) % 360;
        });
        return next;
      });
      progress(100, "Rotated PDF ready.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  const rotations = { ...previewRotations };
  activePages.forEach((page) => {
    rotations[page] = rotationDegrees;
  });

  return (
    <PDFToolShell
      controls={(
        <>
          <Panel title="PDF">
            <PDFUploader kind="pdf" label="Add PDF" />
          </Panel>
          <Panel title="Rotate">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <div className="grid grid-cols-3 gap-2">
              {([
                [90, "Right 90"],
                [180, "180"],
                [270, "Left 90"],
              ] as const).map(([value, label]) => (
                <ToggleButton active={rotationDegrees === value} key={value} onClick={() => setRotationDegrees(value)}>
                  {label}
                </ToggleButton>
              ))}
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
          <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
            The preview shows the selected rotation before export. Select pages,
            choose an angle, then process the PDF.
          </p>
          <PDFPageGrid
            rotations={rotations}
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
            onSelectedPagesChange={setSelectedPages}
          />
        </div>
      )}
      slug="rotate-pdf"
      onProcess={processPDF}
    />
  );
}
