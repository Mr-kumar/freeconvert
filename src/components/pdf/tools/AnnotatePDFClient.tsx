"use client";

import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PageRangeInput } from "@/components/pdf/PageRangeInput";
import {
  ensurePDFName,
  PDFToolShell,
  SelectablePagePreview,
} from "@/components/pdf/PDFToolClientParts";
import {
  NumberControl,
  Panel,
  PDFInfoPanel,
  RangeControl,
  SelectControl,
  TextControl,
} from "@/components/pdf/shared";
import type { PDFToolSlug, ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

type EditMode = "text" | "highlight" | "box" | "signature";

export function AnnotatePDFClient({
  slug,
}: {
  slug: PDFToolSlug;
  defaults: ToolDefaults;
}) {
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
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [rangeText, setRangeText] = useState("");
  const [mode, setMode] = useState<EditMode>(slug === "sign-pdf" ? "signature" : "text");
  const [text, setText] = useState("Approved");
  const [signatureFile, setSignatureFile] = useState<File | Blob | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [xPercent, setXPercent] = useState(18);
  const [yPercent, setYPercent] = useState(18);
  const [widthPercent, setWidthPercent] = useState(38);
  const [heightPercent, setHeightPercent] = useState(8);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState(slug === "sign-pdf" ? "#111111" : "#facc15");
  const [opacity, setOpacity] = useState(80);
  const [outputName, setOutputName] = useState(slug === "sign-pdf" ? "freeconvert-sign-pdf" : "freeconvert-edit-pdf");
  const downloadName = useMemo(
    () => ensurePDFName(outputName, `${slug}.pdf`),
    [outputName, slug],
  );

  function draw(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const context = canvas?.getContext("2d");
    if (!canvas || !rect || !context) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (!drawing) {
      context.beginPath();
      context.moveTo(x, y);
      return;
    }
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#111111";
    context.lineTo(x, y);
    context.stroke();
  }

  async function captureSignature() {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return null;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) setSignatureFile(blob);
    return blob;
  }

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      const activeSignatureFile =
        mode === "signature" && !signatureFile
          ? await captureSignature()
          : signatureFile;
      const { annotatePDF } = await import("@/lib/pdfProcessor");
      const blob = await annotatePDF(inputFile, {
        pages: selectedPages.length ? selectedPages : "all",
        mode,
        text,
        signatureFile: activeSignatureFile,
        xPercent,
        yPercent,
        widthPercent,
        heightPercent,
        fontSize,
        color,
        opacity: opacity / 100,
      });
      setOutputBlob(blob, downloadName);
      setCurrentStep("PDF ready.");
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not edit this PDF.");
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
          <Panel title="Pages">
            <PageRangeInput
              totalPages={totalPages}
              value={rangeText}
              onChange={(nextValue, pages) => {
                setRangeText(nextValue);
                setSelectedPages(pages);
              }}
            />
          </Panel>
          <Panel title="Edit">
            <SelectControl
              label="Mode"
              options={[
                { label: "Text", value: "text" },
                { label: "Highlight", value: "highlight" },
                { label: "Box", value: "box" },
                { label: "Signature", value: "signature" },
              ]}
              value={mode}
              onChange={setMode}
            />
            {mode === "text" ? <TextControl label="Text" value={text} onChange={setText} /> : null}
            {mode === "signature" ? (
              <div className="space-y-3">
                <label className="field-label">
                  Signature image
                  <input
                    accept="image/png,image/jpeg"
                    className="field-input"
                    type="file"
                    onChange={(event) => setSignatureFile(event.target.files?.[0] || null)}
                  />
                </label>
                <canvas
                  ref={signatureCanvasRef}
                  className="h-32 w-full touch-none rounded-lg border border-[var(--border)] bg-white"
                  height={160}
                  width={320}
                  onPointerDown={(event) => {
                    setDrawing(true);
                    event.currentTarget.setPointerCapture(event.pointerId);
                    draw(event);
                  }}
                  onPointerMove={draw}
                  onPointerUp={() => {
                    setDrawing(false);
                    captureSignature();
                  }}
                />
                <button
                  className="segmented-button justify-center"
                  type="button"
                  onClick={() => {
                    const canvas = signatureCanvasRef.current;
                    const context = canvas?.getContext("2d");
                    if (canvas && context) {
                      context.clearRect(0, 0, canvas.width, canvas.height);
                      setSignatureFile(null);
                    }
                  }}
                >
                  Clear drawing
                </button>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <NumberControl label="X %" max={100} min={0} value={xPercent} onChange={setXPercent} />
              <NumberControl label="Y %" max={100} min={0} value={yPercent} onChange={setYPercent} />
              <NumberControl label="Width %" max={100} min={1} value={widthPercent} onChange={setWidthPercent} />
              <NumberControl label="Height %" max={100} min={1} value={heightPercent} onChange={setHeightPercent} />
            </div>
            <NumberControl label="Font size" max={96} min={6} value={fontSize} onChange={setFontSize} />
            <label className="field-label">
              Color
              <input className="field-input h-11" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
            </label>
            <RangeControl label="Opacity" max={100} min={5} suffix="%" value={opacity} onChange={setOpacity} />
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<SelectablePagePreview />}
      processLabel={slug === "sign-pdf" ? "Sign PDF" : "Edit PDF"}
      slug={slug}
      onProcess={processPDF}
    />
  );
}
