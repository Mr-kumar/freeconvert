"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  ensurePDFName,
  MetadataPreview,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import {
  Panel,
  PDFInfoPanel,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function MetadataPDFClient({}: { defaults: ToolDefaults }) {
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
    ensurePDFName("freeconvert-view-pdf-metadata", "freeconvert-view-pdf-metadata.pdf"),
  );
  const [metadataAction, setMetadataAction] = useState<"strip" | "save">("strip");
  const [metadataTitle, setMetadataTitle] = useState("");
  const [metadataAuthor, setMetadataAuthor] = useState("");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-view-pdf-metadata.pdf"),
    [outputName],
  );

  function progress(value: number, step?: string) {
    setProgress(value);
    if (step) setCurrentStep(step);
  }

  function copyMetadataJSON() {
    if (!inputInfo) {
      setError("Upload a PDF first.");
      return;
    }

    navigator.clipboard
      .writeText(JSON.stringify(inputInfo, null, 2))
      .then(() => setCurrentStep("Metadata copied."))
      .catch(() => setError("Could not copy metadata."));
  }

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");

      const { stripPDFMetadata, updatePDFMetadata } = await import("@/lib/pdfProcessor");
      const blob =
        metadataAction === "strip"
          ? await stripPDFMetadata(inputFile)
          : await updatePDFMetadata(inputFile, {
              title: metadataTitle,
              author: metadataAuthor,
            });
      setOutputBlob(blob, downloadName);
      progress(100, "Metadata PDF ready.");
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
          <Panel title="Metadata">
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={metadataAction === "strip"} onClick={() => setMetadataAction("strip")}>
                Strip
              </ToggleButton>
              <ToggleButton active={metadataAction === "save"} onClick={() => setMetadataAction("save")}>
                Save fields
              </ToggleButton>
            </div>
            {metadataAction === "save" ? (
              <>
                <TextControl label="Title" value={metadataTitle} onChange={setMetadataTitle} />
                <TextControl label="Author" value={metadataAuthor} onChange={setMetadataAuthor} />
              </>
            ) : null}
            <button className="segmented-button w-full" type="button" onClick={copyMetadataJSON}>
              <Copy className="h-4 w-4" />
              Copy JSON
            </button>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<MetadataPreview />}
      processLabel={metadataAction === "strip" ? "Strip metadata" : "Save metadata"}
      slug="view-pdf-metadata"
      onProcess={processPDF}
    />
  );
}
