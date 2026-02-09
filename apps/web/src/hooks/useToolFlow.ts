"use client";

import { useCallback, useState } from "react";
import type { FileItem } from "@/types";
import {
  api,
  type JobStatusResponse,
  type StartJobRequest,
} from "@/services/api";

export type FlowStep = "upload" | "processing" | "download" | "error";

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
  toolType: "merge" | "compress" | "reduce" | "jpg-to-pdf";
  compressionLevel?: "low" | "medium" | "high";
}

export function useToolFlow(options: UseToolFlowOptions) {
  const {
    minFiles = 1,
    maxFiles = 20,
    toolType,
    compressionLevel = "medium",
  } = options;

  const [files, setFiles] = useState<FileItem[]>([]);
  const [step, setStep] = useState<FlowStep>("upload");
  const [progress, setProgress] = useState(0);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const addFiles = useCallback(
    (newFiles: File[]) => {
      setFiles((prev) => {
        const items = newFiles.map(createFileItem);
        const combined = [...prev, ...items];
        return combined.slice(0, maxFiles);
      });
      setStep("upload");
      setErrorMessage("");
    },
    [maxFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFiles = useCallback(async (): Promise<string[]> => {
    const fileKeys: string[] = [];

    for (const fileItem of files) {
      try {
        console.log(`[FileUpload] Processing: ${fileItem.name}`);

        // Determine file type with fallback
        let fileType = fileItem.file.type;
        if (!fileType) {
          const fileName = fileItem.name.toLowerCase();
          if (fileName.endsWith(".pdf")) {
            fileType = "application/pdf";
          } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            fileType = "image/jpeg";
          } else if (fileName.endsWith(".png")) {
            fileType = "image/png";
          } else {
            fileType = "application/octet-stream";
          }
        }

        // Get presigned upload URL
        const presignedData = await api.getPresignedUploadUrl({
          file_name: fileItem.name,
          file_type: fileType,
          file_size: fileItem.size,
        });

        // Upload file to S3
        await api.uploadFileToS3(fileItem.file, presignedData);

        // Confirm upload
        await api.confirmUpload(presignedData.file_key);

        fileKeys.push(presignedData.file_key);
      } catch (error) {
        console.error("Failed to upload file:", error);
        throw new Error(
          `Failed to upload ${fileItem.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return fileKeys;
  }, [files]);

  const startProcessing = useCallback(async () => {
    if (files.length < minFiles) {
      setErrorMessage("Please upload at least " + minFiles + " file(s)");
      setStep("error");
      return;
    }

    try {
      setStep("processing");
      setProgress(0);
      setErrorMessage("");

      // Upload files to S3
      const fileKeys = await uploadFiles();
      setProgress(25);

      // Start job
      const jobRequest: StartJobRequest = {
        tool_type: toolType,
        file_keys: fileKeys,
        compression_level:
          toolType === "reduce" || toolType === "compress"
            ? compressionLevel
            : undefined,
      };

      const jobResponse = await api.startJob(jobRequest);
      setJobId(jobResponse.job_id);
      setProgress(50);

      // Generate result filename
      let resultName = "";
      if (toolType === "merge") {
        resultName = "merged-document.pdf";
      } else if (toolType === "compress") {
        resultName = files[0].name.replace(/\.[^.]+$/, "-compressed.jpg");
      } else if (toolType === "reduce") {
        resultName = files[0].name.replace(/\.[^.]+$/, "-reduced.pdf");
      } else if (toolType === "jpg-to-pdf") {
        resultName = "converted.pdf";
      }
      setResultFileName(resultName);

      // Poll job status
      await api.pollJobStatus(
        jobResponse.job_id,
        (status: JobStatusResponse) => {
          if (status.status === "PROCESSING") {
            setProgress(75);
          }
        }
      );

      // Get download URL
      const downloadResponse = await api.getDownloadUrl(jobResponse.job_id);
      setDownloadUrl(downloadResponse.download_url);
      setProgress(100);
      setStep("download");
    } catch (error) {
      console.error("Processing failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Processing failed"
      );
      setStep("error");
    }
  }, [files, minFiles, toolType, compressionLevel, uploadFiles]);

  const reset = useCallback(() => {
    setFiles([]);
    setStep("upload");
    setProgress(0);
    setResultFileName("");
    setJobId("");
    setDownloadUrl("");
    setErrorMessage("");
  }, []);

  const retry = useCallback(() => {
    setErrorMessage("");
    setStep("upload");
  }, []);

  const canSubmit = files.length >= minFiles && step !== "processing";

  return {
    files,
    step,
    progress,
    resultFileName,
    jobId,
    downloadUrl,
    errorMessage,
    addFiles,
    removeFile,
    startProcessing,
    reset,
    retry,
    canSubmit,
  };
}
