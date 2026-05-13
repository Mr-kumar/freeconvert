"use client";

import { useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { CopyButton, TextDownloadButton } from "@/components/utility/shared";
import { Panel, PDFInfoPanel, PDFToolFrame } from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function PDFToTextClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    currentStep,
    error,
    inputFile,
    isProcessing,
    progress,
    setCurrentStep,
    setError,
    setProcessing,
    setProgress,
  } = usePDFStore();
  const [text, setText] = useState("");

  async function processPDF() {
    setError(null);
    clearOutput();
    setText("");
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      const { extractPDFText } = await import("@/lib/pdfProcessor");
      const result = await extractPDFText(inputFile, (nextProgress, step) => {
        setProgress(nextProgress);
        if (step) setCurrentStep(step);
      });
      setText(result);
      setProgress(100);
      setCurrentStep("Text ready.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not extract PDF text.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  return (
    <PDFToolFrame
      slug="pdf-to-text"
      controls={(
        <>
          <Panel title="PDF">
            <PDFUploader kind="pdf" label="Add PDF" />
          </Panel>
          <PDFInfoPanel />
          <Panel title="Export">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="h-2 bg-[var(--surface-2)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs font-bold text-[var(--muted)]">{currentStep}</p>
              </div>
            ) : null}
            {error ? <p className="border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
            <button className="button-primary w-full" disabled={isProcessing} type="button" onClick={processPDF}>
              Extract text
            </button>
            <TextDownloadButton filename="freeconvert-pdf-text.txt" text={text} />
          </Panel>
        </>
      )}
      preview={(
        <div className="flex h-full min-h-[360px] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
            <h2 className="text-sm font-extrabold text-[var(--text)]">Extracted text</h2>
            <CopyButton value={text} />
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
            <pre className="min-h-72 whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text)]">
              {text || "Selectable PDF text will appear here."}
            </pre>
          </div>
        </div>
      )}
    />
  );
}
