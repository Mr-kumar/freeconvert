"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileVideo, Upload } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import { cn, formatBytes } from "@/lib/utils";
import {
  ControlSection,
  Field,
  PreviewShell,
  SegmentedChoice,
  StatCard,
  UtilityToolLayout,
} from "@/components/utility/shared";

const limits = {
  "video-compressor": 50,
  "mp4-to-mp3": 50,
  "mp4-to-gif": 50,
  "audio-converter": 20,
};

function validateMediaFile(file: File, limitMB: number) {
  if (file.size > limitMB * 1024 * 1024) {
    return `File is too large (${formatBytes(file.size)}). Maximum is ${limitMB} MB for browser processing.`;
  }

  return "";
}

function MediaUploader({
  file,
  accept,
  limitMB,
  onChange,
  onError,
}: {
  file: File | null;
  accept: string;
  limitMB: number;
  onChange: (file: File) => void;
  onError: (error: string) => void;
}) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: accept
      .split(",")
      .reduce<Record<string, string[]>>((accepted, item) => {
        accepted[item.trim()] = [];
        return accepted;
      }, {}),
    multiple: false,
    onDrop: (files) => {
      const nextFile = files[0];

      if (!nextFile) {
        return;
      }

      const error = validateMediaFile(nextFile, limitMB);

      if (error) {
        onError(error);
        return;
      }

      onChange(nextFile);
    },
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] p-5 text-center transition-colors hover:border-[var(--accent)]",
          isDragActive && "border-[var(--accent)] bg-[#fff1f0]",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-[var(--accent)]" />
        <span className="mt-4 text-sm font-bold text-[var(--text)]">Add media file</span>
        <span className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Drop media here or click to browse. Browser limit: {limitMB} MB
        </span>
      </div>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <FileVideo className="h-4 w-4 text-[var(--accent)]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text)]">{file.name}</p>
            <p className="font-mono text-xs text-[var(--muted)]">{formatBytes(file.size)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MediaTool({ tool }: { tool: UtilityToolConfig }) {
  const limitMB = limits[tool.slug as keyof typeof limits] || 80;
  const isAudio = tool.slug === "audio-converter";
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState("freeconvert-media.mp4");
  const [videoFormat, setVideoFormat] = useState<"mp4" | "webm">("mp4");
  const [audioFormat, setAudioFormat] = useState<"mp3" | "wav" | "m4a" | "ogg">("mp3");
  const [crf, setCrf] = useState(30);
  const [width, setWidth] = useState(tool.slug === "mp4-to-gif" ? 480 : 720);
  const [fps, setFps] = useState(tool.slug === "mp4-to-gif" ? 12 : 24);
  const [bitrate, setBitrate] = useState(128);
  const [start, setStart] = useState(0);
  const [duration, setDuration] = useState(tool.slug === "mp4-to-gif" ? 4 : 0);

  async function process() {
    setError("");
    setOutputBlob(null);

    if (!file) {
      setError("Add a media file first.");
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStep("Preparing...");

    try {
      const onProgress = (nextProgress: number, nextStep?: string) => {
        setProgress(nextProgress);
        if (nextStep) setStep(nextStep);
      };
      const processor = await import("@/lib/mediaProcessor");
      const result =
        tool.slug === "video-compressor"
          ? await processor.compressVideo(file, { format: videoFormat, crf, maxWidth: width, fps }, onProgress)
          : tool.slug === "mp4-to-gif"
            ? await processor.videoToGIF(file, { start, duration, width, fps }, onProgress)
            : tool.slug === "audio-converter"
              ? await processor.convertAudio(file, { format: audioFormat, bitrate, start, duration }, onProgress)
              : await processor.videoToMP3(file, { bitrate, start, duration }, onProgress);
      setOutputBlob(result.blob);
      setOutputName(result.name);
      setProgress(100);
      setStep("Done.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught || "Could not process this media file."));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="File">
            <MediaUploader
              accept={isAudio ? "audio/*,video/*" : "video/*"}
              file={file}
              limitMB={limitMB}
              onChange={(nextFile) => {
                setFile(nextFile);
                setError("");
                setOutputBlob(null);
              }}
              onError={setError}
            />
          </ControlSection>
          {tool.slug === "video-compressor" ? (
            <ControlSection title="Compression">
              <SegmentedChoice
                value={videoFormat}
                options={[
                  { label: "MP4", value: "mp4" },
                  { label: "WebM", value: "webm" },
                ]}
                onChange={setVideoFormat}
              />
              <Field label="CRF quality">
                <input className="field-input" max={40} min={18} type="number" value={crf} onChange={(event) => setCrf(Number(event.target.value))} />
              </Field>
              <Field label="Max width">
                <input className="field-input" max={1920} min={240} step={2} type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              </Field>
              <Field label="FPS">
                <input className="field-input" max={60} min={8} type="number" value={fps} onChange={(event) => setFps(Number(event.target.value))} />
              </Field>
            </ControlSection>
          ) : null}
          {tool.slug === "mp4-to-gif" ? (
            <ControlSection title="GIF clip">
              <Field label="Start second">
                <input className="field-input" min={0} type="number" value={start} onChange={(event) => setStart(Number(event.target.value))} />
              </Field>
              <Field label="Duration seconds">
                <input className="field-input" max={12} min={1} type="number" value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
              </Field>
              <Field label="Width">
                <input className="field-input" max={900} min={160} step={2} type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              </Field>
              <Field label="FPS">
                <input className="field-input" max={20} min={4} type="number" value={fps} onChange={(event) => setFps(Number(event.target.value))} />
              </Field>
            </ControlSection>
          ) : null}
          {tool.slug === "mp4-to-mp3" || tool.slug === "audio-converter" ? (
            <ControlSection title="Audio">
              {tool.slug === "audio-converter" ? (
                <SegmentedChoice
                  value={audioFormat}
                  options={[
                    { label: "MP3", value: "mp3" },
                    { label: "WAV", value: "wav" },
                    { label: "M4A", value: "m4a" },
                    { label: "OGG", value: "ogg" },
                  ]}
                  onChange={setAudioFormat}
                />
              ) : null}
              <Field label="Bitrate kbps">
                <input className="field-input" max={320} min={64} step={16} type="number" value={bitrate} onChange={(event) => setBitrate(Number(event.target.value))} />
              </Field>
              <Field label="Start second">
                <input className="field-input" min={0} type="number" value={start} onChange={(event) => setStart(Number(event.target.value))} />
              </Field>
              <Field label="Duration seconds (0 = full)">
                <input className="field-input" min={0} type="number" value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
              </Field>
            </ControlSection>
          ) : null}
          <ControlSection title="Export">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs font-bold text-[var(--muted)]">{step}</p>
              </div>
            ) : null}
            {error ? <p className="rounded-lg border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
            <button className="button-primary w-full" disabled={isProcessing} type="button" onClick={process}>
              Process media
            </button>
            <DownloadButton blob={outputBlob} filename={outputName} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="Media output">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Input size" value={file ? formatBytes(file.size) : "No file"} />
            <StatCard label="Output size" tone="accent" value={outputBlob ? formatBytes(outputBlob.size) : "Not ready"} />
            <StatCard label="Limit" value={`${limitMB} MB`} />
            <StatCard label="Engine" value="ffmpeg.wasm" />
          </div>
          <p className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
            The ffmpeg WebAssembly engine loads only on this page and only after you start processing.
          </p>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
