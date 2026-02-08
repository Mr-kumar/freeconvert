"use client";

import { UploadZone } from "@/components/UploadZone";
import { FileList } from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { ProgressStepper, type StepKey } from "@/components/ProgressStepper";
import { ProcessingCard } from "@/components/ProcessingCard";
import { SuccessScreen } from "@/components/SuccessScreen";
import type { FileItem } from "@/types";

export interface ToolFlowViewProps {
  step: "upload" | "processing" | "download";
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
  onDownload?: () => void;
  canSubmit: boolean;
}

const stepToKey: Record<string, StepKey> = {
  upload: "upload",
  processing: "processing",
  download: "download",
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
  onDownload,
  canSubmit,
}: ToolFlowViewProps) {
  if (step === "processing") {
    return (
      <div className="space-y-6">
        <ProgressStepper activeStep={stepToKey[step]} />
        <ProcessingCard
          fileName={files[0]?.name}
          progress={progress}
        />
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

  return (
    <div className="space-y-6">
      <UploadZone
        accept={accept}
        multiple={multiple}
        onFiles={onFiles}
      />
      {files.length > 0 && (
        <>
          <FileList
            files={files}
            onRemove={onRemove}
            type={fileListType}
          />
          <Button
            className="w-full"
            onClick={onPrimary}
            disabled={!canSubmit}
          >
            {primaryLabel}
          </Button>
        </>
      )}
    </div>
  );
}
