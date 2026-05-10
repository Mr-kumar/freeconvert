"use client";

import { useEffect, useMemo, useState } from "react";
import { FileArchive, Loader2 } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import { formatBytes } from "@/lib/utils";
import {
  CodeBlock,
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  SegmentedChoice,
  StatCard,
  UtilityToolLayout,
} from "@/components/utility/shared";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createDigest(
  algorithm: HashAlgorithm,
  source: File | string,
) {
  const data =
    typeof source === "string"
      ? new TextEncoder().encode(source)
      : await source.arrayBuffer();
  const digest = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(digest);
}

export function FileHashChecksum({ tool }: { tool: UtilityToolConfig }) {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("FreeConvert");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const source = mode === "file" ? file : text;

  useEffect(() => {
    if (!source) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setIsHashing(true);
        setError("");
      }
    });

    createDigest(algorithm, source)
      .then((value) => {
        if (!cancelled) setHash(value);
      })
      .catch((err) => {
        if (!cancelled) {
          setHash("");
          setError(err instanceof Error ? err.message : "Could not calculate hash.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsHashing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [algorithm, source]);

  const sourceLabel =
    mode === "file" && file
      ? `${file.name} (${formatBytes(file.size)})`
      : mode === "text"
        ? `${text.length} characters`
        : "No file selected";
  const visibleHash = source ? hash : "";
  const visibleError = source ? error : "";
  const visibleIsHashing = Boolean(source && isHashing);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Source">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "File", value: "file" },
                { label: "Text", value: "text" },
              ]}
              value={mode}
            />
            {mode === "file" ? (
              <Field label="Choose file">
                <input
                  className="field-input"
                  type="file"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </Field>
            ) : (
              <Field label="Text">
                <textarea
                  className="field-input min-h-44 resize-y"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </Field>
            )}
          </ControlSection>
          <ControlSection title="Hash algorithm">
            <Field label="Algorithm">
              <select
                className="field-input"
                value={algorithm}
                onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}
              >
                {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell actions={<CopyButton value={visibleHash} />} title="Checksum">
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Algorithm" tone="accent" value={algorithm} />
            <StatCard label="Source" value={sourceLabel} />
            <StatCard
              label="Status"
              value={visibleIsHashing ? "Processing" : visibleHash ? "Ready" : "Waiting"}
            />
          </div>
          {visibleIsHashing ? (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-sm font-bold text-[var(--muted)]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--accent)]" />
              Calculating checksum
            </div>
          ) : visibleError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {visibleError}
            </p>
          ) : (
            <CodeBlock value={visibleHash} />
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

interface ExtractedFile {
  name: string;
  size: number;
  blob: Blob;
}

export function ZipExtractor({ tool }: { tool: UtilityToolConfig }) {
  const [mode, setMode] = useState<"create" | "extract">("create");
  const [files, setFiles] = useState<File[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [archiveBlob, setArchiveBlob] = useState<Blob | null>(null);
  const [extracted, setExtracted] = useState<ExtractedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const totalSize = useMemo(
    () => files.reduce((sum, item) => sum + item.size, 0),
    [files],
  );

  async function createArchive() {
    if (!files.length) return;
    setIsProcessing(true);
    setError("");
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      files.forEach((file) => {
        const name =
          (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
          file.name;
        zip.file(name, file);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      setArchiveBlob(blob);
    } catch (err) {
      setArchiveBlob(null);
      setError(err instanceof Error ? err.message : "Could not create ZIP archive.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function extractArchive() {
    if (!zipFile) return;
    setIsProcessing(true);
    setError("");
    setExtracted([]);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = await JSZip.loadAsync(zipFile);
      const items = await Promise.all(
        Object.values(zip.files)
          .filter((entry) => !entry.dir)
          .map(async (entry) => {
            const blob = await entry.async("blob");
            return { name: entry.name, size: blob.size, blob };
          }),
      );
      setExtracted(items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not read this ZIP file. Encrypted ZIP files are not supported.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Mode">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Create ZIP", value: "create" },
                { label: "Extract ZIP", value: "extract" },
              ]}
              value={mode}
            />
          </ControlSection>
          {mode === "create" ? (
            <ControlSection title="Create archive">
              <Field label="Choose files">
                <input
                  className="field-input"
                  multiple
                  type="file"
                  onChange={(event) => {
                    setFiles(Array.from(event.target.files ?? []));
                    setArchiveBlob(null);
                  }}
                />
              </Field>
              <button
                className="button-primary"
                disabled={!files.length || isProcessing}
                type="button"
                onClick={createArchive}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileArchive className="h-4 w-4" />
                )}
                {isProcessing ? "Creating..." : "Create ZIP"}
              </button>
            </ControlSection>
          ) : (
            <ControlSection title="Extract archive">
              <Field label="Choose ZIP file">
                <input
                  accept=".zip,application/zip,application/x-zip-compressed"
                  className="field-input"
                  type="file"
                  onChange={(event) => {
                    setZipFile(event.target.files?.[0] ?? null);
                    setExtracted([]);
                  }}
                />
              </Field>
              <button
                className="button-primary"
                disabled={!zipFile || isProcessing}
                type="button"
                onClick={extractArchive}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileArchive className="h-4 w-4" />
                )}
                {isProcessing ? "Extracting..." : "Extract ZIP"}
              </button>
            </ControlSection>
          )}
        </>
      }
      preview={
        <PreviewShell
          actions={
            mode === "create" ? (
              <DownloadButton blob={archiveBlob} filename="freeconvert-files.zip" />
            ) : (
              <DownloadButton
                batchBlobs={extracted.map((item) => ({
                  blob: item.blob,
                  name: item.name,
                }))}
                blob={null}
                filename="freeconvert-extracted.zip"
              />
            )
          }
          title={mode === "create" ? "ZIP archive" : "Extracted files"}
        >
          {error ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          {mode === "create" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Files" tone="accent" value={files.length} />
                <StatCard label="Input size" value={formatBytes(totalSize)} />
                <StatCard
                  label="Archive"
                  value={archiveBlob ? formatBytes(archiveBlob.size) : "Not created"}
                />
              </div>
              <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-[var(--surface-2)] text-xs uppercase text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-3">File</th>
                      <th className="px-4 py-3">Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-white">
                    {files.length ? (
                      files.map((file) => (
                        <tr key={`${file.name}-${file.size}`}>
                          <td className="px-4 py-3 font-semibold text-[var(--text)]">
                            {file.name}
                          </td>
                          <td className="px-4 py-3 text-[var(--muted)]">
                            {formatBytes(file.size)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-5 text-[var(--muted)]" colSpan={2}>
                          Choose files to create a ZIP archive.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="ZIP file" tone="accent" value={zipFile?.name ?? "None"} />
                <StatCard label="Files found" value={extracted.length} />
                <StatCard
                  label="Extracted size"
                  value={formatBytes(
                    extracted.reduce((sum, item) => sum + item.size, 0),
                  )}
                />
              </div>
              <div className="mt-5 grid gap-3">
                {extracted.length ? (
                  extracted.map((item) => (
                    <div
                      className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:grid-cols-[minmax(0,1fr)_150px]"
                      key={item.name}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text)]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {formatBytes(item.size)}
                        </p>
                      </div>
                      <DownloadButton
                        batchBlobs={[{ blob: item.blob, name: item.name }]}
                        blob={null}
                        filename={item.name}
                      />
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]">
                    Choose a ZIP file and extract it to see the files.
                  </p>
                )}
              </div>
            </>
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
