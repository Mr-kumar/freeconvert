"use client";

import { useCallback, useState } from "react";
import type { FileItem } from "@/types";

export type FlowStep = "upload" | "processing" | "download";

function createFileItem(file: File): FileItem {
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    name: file.name,
    size: file.size,
  };
}

export interface UseToolFlowOptions {
  minFiles?: number;
  maxFiles?: number;
  simulateDuration?: number;
}

export function useToolFlow(options: UseToolFlowOptions = {}) {
  const { minFiles = 1, simulateDuration = 2500 } = options;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [step, setStep] = useState<FlowStep>("upload");
  const [progress, setProgress] = useState(0);
  const [resultFileName, setResultFileName] = useState<string>("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const items = newFiles.map(createFileItem);
      const combined = [...prev, ...items];
      return combined.slice(0, 20);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const startProcessing = useCallback(() => {
    setStep("processing");
    setProgress(0);
    const name = files.length === 1 ? files[0].name : "merged-document.pdf";
    setResultFileName(name.replace(/\.[^.]+$/, "-converted.pdf"));

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setStep("download");
      }
    }, (simulateDuration ?? 2500) / 10);
  }, [files]);

  const reset = useCallback(() => {
    setFiles([]);
    setStep("upload");
    setProgress(0);
    setResultFileName("");
  }, []);

  const canSubmit = files.length >= minFiles;

  return {
    files,
    step,
    progress,
    resultFileName,
    addFiles,
    removeFile,
    startProcessing,
    reset,
    canSubmit,
  };
}
