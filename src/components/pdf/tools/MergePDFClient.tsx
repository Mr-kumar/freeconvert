"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  BatchList,
  ensurePDFName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  NumberControl,
  Panel,
  PDFInfoPanel,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function MergePDFClient({ defaults }: { defaults: ToolDefaults }) {
  const {
    batchFiles,
    clearOutput,
    outputBatch,
    outputBlob,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName(String(defaults.outputName || "freeconvert-merge-pdf"), "freeconvert-merge-pdf.pdf"),
  );
  const [addBlankPage, setAddBlankPage] = useState(false);
  const [compressMerged, setCompressMerged] = useState(false);
  const [mergeTargetSizeKB, setMergeTargetSizeKB] = useState(0);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-merge-pdf.pdf"),
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
      if (batchFiles.length < 2) {
        throw new Error("Add at least two PDF files to merge.");
      }

      const { mergePDFs } = await import("@/lib/pdfProcessor");
      let blob = await mergePDFs(batchFiles, {
        files: batchFiles,
        outputName: downloadName,
        addBlankPageBetween: addBlankPage,
      });
      progress(35, "Merged PDF created.");

      if (compressMerged || mergeTargetSizeKB > 0) {
        const { compressPDF } = await import("@/lib/pdfProcessor");
        const mergedFile = new File([blob], downloadName, {
          type: "application/pdf",
          lastModified: Date.now(),
        });
        blob = await compressPDF(
          mergedFile,
          {
            quality: "medium",
            imageQuality: 0.62,
            customQuality: 0.62,
            downsampleImages: true,
            targetDPI: 96,
            targetSizeKB: mergeTargetSizeKB > 0 ? mergeTargetSizeKB : undefined,
          },
          (nextProgress, step) => progress(35 + nextProgress * 0.6, step),
        );
      }

      setOutputBlob(blob, downloadName);
      progress(100, "Merged PDF ready.");
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
          <Panel title="PDF files">
            <PDFUploader kind="pdf" label="Add PDFs" multiple />
            <BatchList />
          </Panel>
          <Panel title="Options">
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
            <ToggleButton active={addBlankPage} onClick={() => setAddBlankPage(!addBlankPage)}>
              Add blank page between files
            </ToggleButton>
            <ToggleButton active={compressMerged} onClick={() => setCompressMerged(!compressMerged)}>
              Compress after merge
            </ToggleButton>
            {compressMerged ? (
              <>
                <NumberControl
                  label="Target size (KB)"
                  max={512000}
                  min={0}
                  step={10}
                  value={mergeTargetSizeKB}
                  onChange={setMergeTargetSizeKB}
                />
                <p className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
                  Target size is best effort. Very long or scanned PDFs may not
                  reach a very small KB value without visible quality loss.
                </p>
              </>
            ) : null}
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<PDFPreview />}
      slug="merge-pdf"
      onProcess={processPDF}
    />
  );
}
