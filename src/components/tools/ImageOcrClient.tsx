"use client";

import { useState } from "react";
import { CopyButton, TextDownloadButton } from "@/components/utility/shared";
import { ToolDefaults, ToolSlug } from "@/lib/types";
import { useImageStore } from "@/store/useImageStore";
import {
  Panel,
  SelectControl,
  ToolActions,
  ToolFrame,
  UploadPanel,
} from "./shared";

const languages = [
  { label: "English", value: "eng" },
  { label: "Hindi", value: "hin" },
  { label: "English + Hindi", value: "eng+hin" },
  { label: "Spanish", value: "spa" },
  { label: "French", value: "fra" },
];

export function ImageOcrClient({
  slug,
}: {
  slug: ToolSlug;
  defaults: ToolDefaults;
}) {
  const { inputFile, error, outputBlob, clearOutput, setError, setProcessing, setProgress } =
    useImageStore();
  const [language, setLanguage] = useState("eng");
  const [text, setText] = useState("");

  async function runOCR() {
    setError(null);
    clearOutput();
    setText("");

    if (!inputFile) {
      setError("Add an image first.");
      return;
    }

    setProcessing(true);
    setProgress(8);

    try {
      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker(language, undefined, {
        workerPath: "/tesseract/worker.min.js",
        corePath: "/tesseract/tesseract-core-simd-lstm.js",
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
        logger: (message) => {
          if (message.status) {
            setProgress(Math.max(10, Math.round((message.progress || 0) * 95)));
          }
        },
      });
      const result = await worker.recognize(inputFile);
      await worker.terminate();
      setText(result.data.text.trim());
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not extract text from this image.");
    } finally {
      setProcessing(false);
    }
  }

  const controls = (
    <>
      <UploadPanel />
      <Panel title="OCR">
        <SelectControl
          label="Language"
          options={languages}
          value={language}
          onChange={setLanguage}
        />
        <p className="text-xs leading-5 text-[var(--muted)]">
          OCR models load only when you run extraction. Clear, high-contrast text gives the best result.
        </p>
      </Panel>
      <ToolActions
        downloadName="freeconvert-ocr.txt"
        outputBlob={outputBlob}
        processLabel="Extract text"
        onProcess={runOCR}
      >
        <TextDownloadButton filename="freeconvert-ocr.txt" text={text} />
      </ToolActions>
    </>
  );

  const preview = (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <h2 className="text-sm font-extrabold text-[var(--text)]">Extracted text</h2>
        <CopyButton value={text} />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
        {error ? null : (
          <pre className="min-h-72 whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text)]">
            {text || "Recognized text will appear here."}
          </pre>
        )}
      </div>
    </div>
  );

  return <ToolFrame controls={controls} preview={preview} slug={slug} />;
}
