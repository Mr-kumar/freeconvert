"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, X } from "lucide-react";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  batchBlobs?: { blob: Blob; name: string }[];
}

function extensionOf(name: string) {
  const match = name.match(/(\.[a-z0-9]+)$/i);
  return match?.[1] ?? "";
}

function ensureFileExtension(name: string, fallbackName: string) {
  const trimmed = name.trim() || fallbackName;
  const extension = extensionOf(fallbackName);

  if (!extension || extensionOf(trimmed)) {
    return trimmed;
  }

  return `${trimmed}${extension}`;
}

function ensureZipExtension(name: string) {
  const trimmed = name.trim() || "freeconvert-output.zip";
  return `${trimmed.replace(/\.[a-z0-9]+$/i, "")}.zip`;
}

export function DownloadButton({
  blob,
  filename,
  batchBlobs,
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = !blob && (!batchBlobs || batchBlobs.length === 0);
  const defaultName = useMemo(() => {
    if (batchBlobs?.length === 1) {
      return batchBlobs[0]?.name || filename;
    }

    if (batchBlobs?.length && batchBlobs.length > 1) {
      return filename.endsWith(".zip") ? filename : `${filename}.zip`;
    }

    return filename;
  }, [batchBlobs, filename]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [isOpen]);

  async function download(downloadName: string) {
    if (batchBlobs?.length) {
      if (batchBlobs.length === 1) {
        const [item] = batchBlobs;
        const url = URL.createObjectURL(item.blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = ensureFileExtension(downloadName, item.name);
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        return;
      }

      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();
      batchBlobs.forEach((item) => zip.file(item.name, item.blob));
      const archive = await zip.generateAsync({ type: "blob" });
      saveAs(archive, ensureZipExtension(downloadName));
      return;
    }

    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = ensureFileExtension(downloadName, filename);
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function confirmDownload() {
    setIsPreparing(true);
    try {
      await download(draftName);
      setIsOpen(false);
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <>
      <button
        className="button-primary w-full"
        disabled={disabled}
        type="button"
        onClick={() => {
          setDraftName(defaultName);
          setIsOpen(true);
        }}
      >
        <Download className="h-4 w-4" />
        Download
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  Name your download
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Change the file name before the download starts.
                </p>
              </div>
              <button
                aria-label="Close"
                className="icon-button"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="field-label mt-5">
              File name
              <input
                ref={inputRef}
                className="field-input"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
              />
            </label>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                className="segmented-button justify-center"
                disabled={isPreparing}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="button-primary justify-center"
                disabled={isPreparing}
                type="button"
                onClick={confirmDownload}
              >
                {isPreparing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isPreparing ? "Preparing..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
