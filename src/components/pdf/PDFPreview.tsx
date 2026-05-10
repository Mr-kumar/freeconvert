"use client";

import { FileText } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { usePDFStore } from "@/store/usePDFStore";
import { PDFPageGrid } from "./PDFPageGrid";

export function PDFPreview() {
  const {
    inputFile,
    inputInfo,
    inputPreviewUrl,
    outputBatch,
    outputBlob,
    outputInfo,
    outputPreviewUrl,
    pageThumbnails,
    selectedPages,
    totalPages,
  } = usePDFStore();
  const previewUrl = outputPreviewUrl || inputPreviewUrl;
  const activeInfo = outputInfo || inputInfo;

  if (!inputFile && !outputBlob && outputBatch.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center sm:min-h-[560px]">
        <FileText className="h-10 w-10 text-[var(--accent)]" />
        <h2 className="mt-4 text-lg font-extrabold text-[var(--text)]">
          PDF preview
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
          Upload a PDF to preview pages, select ranges and download the processed file.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:grid-cols-3">
        {[
          ["File", activeInfo?.fileName || inputFile?.name || "Output"],
          ["Size", activeInfo ? formatBytes(activeInfo.fileSize) : "Ready"],
          [
            "Pages",
            activeInfo?.pageCount ? String(activeInfo.pageCount) : String(totalPages || "-"),
          ],
        ].map(([label, value]) => (
          <div className="min-w-0" key={label}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {label}
            </p>
            <p className="mt-1 truncate text-sm font-bold text-[var(--text)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {previewUrl ? (
        <iframe
          className="h-[440px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)]"
          src={previewUrl}
          title="PDF preview"
        />
      ) : null}

      {outputBatch.length > 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <h2 className="text-sm font-bold text-[var(--text)]">
            {outputBatch.length} files ready
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {outputBatch.slice(0, 10).map((item) => (
              <div
                className="truncate rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]"
                key={item.name}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {totalPages > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-[var(--text)]">Pages</h2>
            <p className="text-xs font-semibold text-[var(--muted)]">
              {selectedPages.length} selected
            </p>
          </div>
          <PDFPageGrid
            selectedPages={selectedPages}
            thumbnails={pageThumbnails}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
}
