"use client";

import { UploadZone } from "@/components/UploadZone";
import { FileList } from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { ProgressStepper, type StepKey } from "@/components/ProgressStepper";
import { ProcessingCard } from "@/components/ProcessingCard";
import { SuccessScreen } from "@/components/SuccessScreen";
import type { FileItem } from "@/types";

export interface ToolFlowViewProps {
  step: "upload" | "processing" | "download" | "error";
  progress: number;
  resultFileName: string;
  files: FileItem[];
  accept?: string;
  multiple?: boolean;
  fileListType?: "pdf" | "image";
  primaryLabel: string;
  onFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onPrimary: () => void;
  onReset: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  errorMessage?: string;
  canSubmit: boolean;
}

const stepToKey: Record<string, StepKey> = {
  upload: "upload",
  processing: "processing",
  download: "download",
  error: "upload", // Show upload step on error
};

export function ToolFlowView({
  step,
  progress,
  resultFileName,
  files,
  accept,
  multiple = true,
  fileListType = "pdf",
  primaryLabel,
  onFiles,
  onRemove,
  onPrimary,
  onReset,
  onRetry,
  onDownload,
  errorMessage,
  canSubmit,
}: ToolFlowViewProps) {
  if (step === "processing") {
    return (
      <div className="space-y-6">
        <ProgressStepper activeStep={stepToKey[step]} />
        <ProcessingCard fileName={files[0]?.name} progress={progress} />
      </div>
    );
  }

  if (step === "download") {
    return (
      <div className="space-y-6">
        <ProgressStepper activeStep="download" />
        <SuccessScreen
          fileName={resultFileName}
          onDownload={onDownload}
          onReset={onReset}
        />
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="space-y-6">
        <ProgressStepper activeStep="upload" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-red-600 font-medium mb-2">
            ❌ Processing Failed
          </div>
          <div className="text-red-700 text-sm mb-4">
            {errorMessage || "An error occurred during processing"}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
            <Button onClick={onReset}>Start Over</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressStepper activeStep={stepToKey[step]} />
      <UploadZone accept={accept} multiple={multiple} onFiles={onFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={onRemove} type={fileListType} />
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          <Button className="w-full" onClick={onPrimary} disabled={!canSubmit}>
            {primaryLabel}
          </Button>
        </>
      )}
    </div>
  );
}
