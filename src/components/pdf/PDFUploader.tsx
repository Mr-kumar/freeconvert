"use client";

import { useDropzone } from "react-dropzone";
import { File as FileIcon, FileImage, Upload } from "lucide-react";
import { validateImageFile, validatePDFFile, verifyMagicBytes, verifyPDFMagicBytes } from "@/lib/validateFile";
import { cn, formatBytes } from "@/lib/utils";
import { usePDFStore } from "@/store/usePDFStore";

interface PDFUploaderProps {
  kind?: "pdf" | "image";
  multiple?: boolean;
  label?: string;
}

export function PDFUploader({
  kind = "pdf",
  multiple = false,
  label = multiple ? "Add files" : "Add file",
}: PDFUploaderProps) {
  const {
    batchFiles,
    clearBatch,
    inputFile,
    addBatchFile,
    setError,
    setInputFile,
  } = usePDFStore();
  const isPDF = kind === "pdf";
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: isPDF
      ? { "application/pdf": [".pdf"] }
      : { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif"] },
    multiple,
    onDrop: async (files) => {
      async function validate(file: File) {
        const validation = isPDF ? validatePDFFile(file) : validateImageFile(file);

        if (!validation.valid) {
          setError(validation.error || "This file is not supported.");
          return false;
        }

        const magicBytesValid = isPDF
          ? await verifyPDFMagicBytes(file)
          : await verifyMagicBytes(file);

        if (!magicBytesValid) {
          setError(`This file does not look like a valid ${isPDF ? "PDF" : "image"}.`);
          return false;
        }

        return true;
      }

      if (multiple) {
        for (const file of files) {
          if (await validate(file)) {
            addBatchFile(file, isPDF);
          }
        }
        return;
      }

      if (files[0] && (await validate(files[0]))) {
        setInputFile(files[0]);
      }
    },
  });
  const activeFiles = multiple ? batchFiles : inputFile ? [inputFile] : [];
  const Icon = isPDF ? FileIcon : FileImage;

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] p-5 text-center transition-colors",
          isDragActive && "border-[var(--accent)] bg-[#fff1f0]",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-[var(--accent)]" />
        <p className="mt-4 text-sm font-bold text-[var(--text)]">{label}</p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Drop {isPDF ? "PDF" : "image"} here or click to browse
        </p>
      </div>

      {activeFiles.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
          {activeFiles.slice(0, 8).map((file, index) => (
            <div
              className="flex items-center gap-3 border-b border-[var(--border)] p-3 last:border-b-0"
              key={`${file.name}-${file.lastModified}-${index}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">
                  {file.name}
                </p>
                <p className="font-mono text-xs text-[var(--muted)]">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
          ))}
          {activeFiles.length > 8 ? (
            <p className="p-3 text-xs font-semibold text-[var(--muted)]">
              +{activeFiles.length - 8} more
            </p>
          ) : null}
        </div>
      ) : null}

      {multiple && batchFiles.length > 0 ? (
        <button
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
          type="button"
          onClick={clearBatch}
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
