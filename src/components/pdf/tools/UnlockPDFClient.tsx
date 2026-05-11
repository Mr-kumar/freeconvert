"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  ensurePDFName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  Panel,
  PDFInfoPanel,
  TextControl,
} from "@/components/pdf/shared";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function UnlockPDFClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    inputInfo,
    outputBatch,
    outputBlob,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-unlock-pdf", "freeconvert-unlock-pdf.pdf"),
  );
  const [password, setPassword] = useState("");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-unlock-pdf.pdf"),
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

      const { unlockPDF } = await import("@/lib/pdfProcessor");
      const blob = await unlockPDF(inputFile, password, progress);
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
          <Panel title="Unlock">
            <div className="rounded-lg border border-[var(--warning)] bg-white p-3 text-xs leading-5 text-[var(--warning)]">
              You must know the current password. This tool does not crack, bypass or remove security without decryption support.
            </div>
            {inputInfo ? (
              <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm font-semibold text-[var(--text)]">
                This PDF is {inputInfo.isEncrypted ? "password protected" : "not password protected"}.
              </p>
            ) : null}
            <TextControl
              label="Current password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<PDFPreview />}
      processLabel="Unlock PDF"
      slug="unlock-pdf"
      onProcess={processPDF}
    />
  );
}
