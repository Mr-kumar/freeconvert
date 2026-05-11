"use client";

import { useMemo, useState } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  ensurePDFName,
  pageNumberPositions,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import {
  asPDFNumber,
  asPDFString,
  NumberControl,
  Panel,
  PDFInfoPanel,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { PageNumberOptions, ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function PageNumbersPDFClient({ defaults }: { defaults: ToolDefaults }) {
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
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-add-page-numbers-to-pdf", "freeconvert-add-page-numbers-to-pdf.pdf"),
  );
  const [rangeText, setRangeText] = useState("");
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberOptions["position"]>(
    asPDFString(defaults.position, "bottom-center") as PageNumberOptions["position"],
  );
  const [numberFormat, setNumberFormat] = useState("Page {n}");
  const [numberStart, setNumberStart] = useState(asPDFNumber(defaults.start, 1));
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [pageNumberFontSize, setPageNumberFontSize] = useState(11);
  const [pageNumberColor, setPageNumberColor] = useState("#333333");
  const [pageNumberMargin, setPageNumberMargin] = useState(24);
  const activePages = useMemo(() => {
    if (!totalPages) return [];
    return selectedPages.length > 0
      ? selectedPages
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [selectedPages, totalPages]);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-add-page-numbers-to-pdf.pdf"),
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

      const prefix = numberFormat.includes("{n}")
        ? numberFormat.split("{n}")[0]
        : "";
      const suffix = numberFormat.includes("{n}")
        ? numberFormat.split("{n}").slice(1).join("{n}")
        : numberFormat === "1 of {total}"
          ? " of {total}"
          : "";
      const { addPageNumbers } = await import("@/lib/pdfProcessor");
      const blob = await addPageNumbers(
        inputFile,
        {
          pages: activePages,
          position: pageNumberPosition,
          startFrom: numberStart,
          prefix,
          suffix,
          fontSize: pageNumberFontSize,
          fontColor: pageNumberColor,
          fontFamily: "Helvetica",
          margin: pageNumberMargin,
          skipFirstPage,
        },
        progress,
      );
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
          <Panel title="Numbering">
            <PageRangeInput totalPages={totalPages} value={rangeText} onChange={pageSelectionRange} />
            <SelectControl
              label="Position"
              options={pageNumberPositions.map((value) => ({
                label: value.replace("-", " "),
                value,
              }))}
              value={pageNumberPosition}
              onChange={setPageNumberPosition}
            />
            <SelectControl
              label="Format"
              options={[
                { label: "1", value: "{n}" },
                { label: "Page 1", value: "Page {n}" },
                { label: "1 of total", value: "{n} of {total}" },
                { label: "- 1 -", value: "- {n} -" },
              ]}
              value={numberFormat}
              onChange={setNumberFormat}
            />
            <NumberControl label="Start from" min={0} value={numberStart} onChange={setNumberStart} />
            <ToggleButton active={skipFirstPage} onClick={() => setSkipFirstPage(!skipFirstPage)}>
              Skip first page
            </ToggleButton>
            <RangeControl label="Font size" max={24} min={6} suffix="pt" value={pageNumberFontSize} onChange={setPageNumberFontSize} />
            <RangeControl label="Margin" max={50} min={5} suffix="pt" value={pageNumberMargin} onChange={setPageNumberMargin} />
            <label className="field-label">
              Color
              <input className="field-input h-11" type="color" value={pageNumberColor} onChange={(event) => setPageNumberColor(event.target.value)} />
            </label>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      slug="add-page-numbers-to-pdf"
      onProcess={processPDF}
    />
  );
}
