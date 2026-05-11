"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import {
  BatchList,
  ensurePDFName,
  PDFToolShell,
  positionOptions,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  asPDFString,
  Panel,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type {
  ImageToPDFOptions,
  PDFOrientation,
  PDFPageSize,
  PDFPosition,
  ToolDefaults,
} from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function ImageToPDFClient({ defaults }: { defaults: ToolDefaults }) {
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
    ensurePDFName("freeconvert-convert-image-to-pdf", "freeconvert-convert-image-to-pdf.pdf"),
  );
  const [pageSize, setPageSize] = useState<PDFPageSize>(
    asPDFString(defaults.pageSize, "A4") as PDFPageSize,
  );
  const [orientation, setOrientation] = useState<PDFOrientation>(
    asPDFString(defaults.orientation, "portrait") as PDFOrientation,
  );
  const [margin, setMargin] = useState(asPDFNumber(defaults.margin, 10));
  const [imageFit, setImageFit] = useState<ImageToPDFOptions["imageFit"]>(
    asPDFString(defaults.fit, "contain") as ImageToPDFOptions["imageFit"],
  );
  const [imageAlign, setImageAlign] = useState<PDFPosition>("center");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [metadataTitle, setMetadataTitle] = useState("");
  const [metadataAuthor, setMetadataAuthor] = useState("");
  const [metadataSubject, setMetadataSubject] = useState("");
  const [metadataKeywords, setMetadataKeywords] = useState("");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-convert-image-to-pdf.pdf"),
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
      if (!batchFiles.length) {
        throw new Error("Add at least one image.");
      }

      const { imagesToPDF } = await import("@/lib/pdfProcessor");
      const blob = await imagesToPDF(batchFiles, {
        pageSize,
        orientation,
        margin,
        imageFit,
        imageAlign,
        backgroundColor,
        oneImagePerPage: true,
        title: metadataTitle,
        author: metadataAuthor,
        subject: metadataSubject,
        keywords: metadataKeywords,
      });
      setOutputBlob(blob, downloadName);
      progress(100, "PDF ready.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  const preview = (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <h2 className="text-sm font-bold text-[var(--text)]">
          {batchFiles.length} images selected
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {batchFiles.map((file) => (
            <div
              className="truncate rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]"
              key={`${file.name}-${file.lastModified}`}
            >
              {file.name}
            </div>
          ))}
        </div>
      </div>
      <PDFPreview />
    </div>
  );

  return (
    <PDFToolShell
      controls={(
        <>
          <Panel title="Images">
            <PDFUploader kind="image" label="Add images" multiple />
            <BatchList imageMode />
          </Panel>
          <Panel title="Page">
            <SelectControl
              label="Page size"
              options={[
                "A4",
                "A3",
                "A5",
                "Letter",
                "Legal",
                "Tabloid",
                "Match Image",
              ].map((value) => ({ label: value, value: value as PDFPageSize }))}
              value={pageSize}
              onChange={setPageSize}
            />
            <div className="grid grid-cols-3 gap-2">
              {(["portrait", "landscape", "auto"] as PDFOrientation[]).map((value) => (
                <ToggleButton
                  active={orientation === value}
                  key={value}
                  onClick={() => setOrientation(value)}
                >
                  {value}
                </ToggleButton>
              ))}
            </div>
            <RangeControl label="Margin" max={50} min={0} suffix="mm" value={margin} onChange={setMargin} />
            <SelectControl
              label="Image fit"
              options={[
                { label: "Contain", value: "contain" },
                { label: "Cover", value: "cover" },
                { label: "Fill", value: "fill" },
                { label: "Actual size", value: "actual-size" },
              ]}
              value={imageFit}
              onChange={setImageFit}
            />
            <SelectControl
              label="Image alignment"
              options={positionOptions}
              value={imageAlign}
              onChange={setImageAlign}
            />
            <label className="field-label">
              Background
              <input
                className="field-input h-11"
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
              />
            </label>
          </Panel>
          <Panel title="Metadata">
            <TextControl label="Title" value={metadataTitle} onChange={setMetadataTitle} />
            <TextControl label="Author" value={metadataAuthor} onChange={setMetadataAuthor} />
            <TextControl label="Subject" value={metadataSubject} onChange={setMetadataSubject} />
            <TextControl label="Keywords" value={metadataKeywords} onChange={setMetadataKeywords} />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={preview}
      slug="convert-image-to-pdf"
      onProcess={processPDF}
    />
  );
}
