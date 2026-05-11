"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import {
  CodeBlock,
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  UtilityToolLayout,
} from "@/components/utility/shared";

type QrLevel = "L" | "M" | "Q" | "H";

interface QrOptions {
  size: number;
  margin: number;
  dark: string;
  light: string;
  level: QrLevel;
}

function dataUrlToBlob(dataUrl: string) {
  const separatorIndex = dataUrl.indexOf(",");
  if (separatorIndex === -1) {
    throw new Error("Could not prepare QR code download.");
  }

  const header = dataUrl.slice(0, separatorIndex);
  const data = dataUrl.slice(separatorIndex + 1);
  const mimeType = header.match(/^data:([^;,]+)/)?.[1] ?? "application/octet-stream";
  const isBase64 = header.includes(";base64");
  const binary = isBase64 ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

function useQrCode(value: string, options: QrOptions) {
  const hasPayload = Boolean(value.trim());
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const payload = value.trim();
    if (!payload) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setIsGenerating(true);
        setError("");
      }
    });

    async function generate() {
      try {
        const QRCode = await import("qrcode");
        const qrOptions = {
          errorCorrectionLevel: options.level,
          margin: options.margin,
          width: options.size,
          color: {
            dark: options.dark,
            light: options.light,
          },
        };
        const nextDataUrl = await QRCode.toDataURL(payload, qrOptions);
        const nextSvg = await QRCode.toString(payload, {
          ...qrOptions,
          type: "svg",
        });
        const nextBlob = dataUrlToBlob(nextDataUrl);

        if (!cancelled) {
          setDataUrl(nextDataUrl);
          setSvg(nextSvg);
          setBlob(nextBlob);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not generate QR code.");
          setDataUrl("");
          setSvg("");
          setBlob(null);
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [options.dark, options.level, options.light, options.margin, options.size, value]);

  if (!hasPayload) {
    return { dataUrl: "", svg: "", blob: null, error: "", isGenerating: false };
  }

  return { dataUrl, svg, blob, error, isGenerating };
}

function QrControls({
  value,
  setValue,
  options,
  setOptions,
}: {
  value: string;
  setValue: (value: string) => void;
  options: QrOptions;
  setOptions: (options: QrOptions) => void;
}) {
  return (
    <>
      <ControlSection title="QR content">
        <Field label="Text, URL or contact detail">
          <textarea
            className="field-input min-h-36 resize-y"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
      </ControlSection>
      <ControlSection title="Design">
        <Field label={`Size: ${options.size}px`}>
          <input
            className="range-input"
            max={1024}
            min={160}
            step={16}
            type="range"
            value={options.size}
            onChange={(event) =>
              setOptions({ ...options, size: Number(event.target.value) })
            }
          />
        </Field>
        <Field label={`Margin: ${options.margin}`}>
          <input
            className="range-input"
            max={8}
            min={0}
            type="range"
            value={options.margin}
            onChange={(event) =>
              setOptions({ ...options, margin: Number(event.target.value) })
            }
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="QR color">
            <input
              className="field-input h-12 p-1"
              type="color"
              value={options.dark}
              onChange={(event) =>
                setOptions({ ...options, dark: event.target.value })
              }
            />
          </Field>
          <Field label="Background">
            <input
              className="field-input h-12 p-1"
              type="color"
              value={options.light}
              onChange={(event) =>
                setOptions({ ...options, light: event.target.value })
              }
            />
          </Field>
        </div>
        <Field label="Error correction">
          <select
            className="field-input"
            value={options.level}
            onChange={(event) =>
              setOptions({ ...options, level: event.target.value as QrLevel })
            }
          >
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="Q">Quartile</option>
            <option value="H">High</option>
          </select>
        </Field>
      </ControlSection>
    </>
  );
}

function QrPreview({
  title,
  dataUrl,
  svg,
  blob,
  error,
  isGenerating,
  filename,
}: {
  title: string;
  dataUrl: string;
  svg: string;
  blob: Blob | null;
  error: string;
  isGenerating: boolean;
  filename: string;
}) {
  const svgBlob = useMemo(
    () => (svg ? new Blob([svg], { type: "image/svg+xml" }) : null),
    [svg],
  );

  return (
    <PreviewShell
      actions={
        <>
          <DownloadButton blob={blob} filename={`${filename}.png`} />
          <DownloadButton blob={svgBlob} filename={`${filename}.svg`} />
        </>
      }
      title={title}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="flex min-h-80 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 text-sm font-bold text-[var(--muted)]">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
              Generating QR code
            </div>
          ) : dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Generated QR code"
              className="h-auto max-h-80 w-full max-w-80 rounded-lg bg-white object-contain"
              src={dataUrl}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center text-sm font-semibold text-[var(--muted)]">
              <QrCode className="h-10 w-10 text-[var(--accent)]" />
              Add content to generate a QR code.
            </div>
          )}
        </div>
        <div className="min-w-0">
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <h3 className="mt-1 text-sm font-extrabold text-[var(--text)]">
            SVG output
          </h3>
          <div className="mt-3">
            <CodeBlock value={svg} />
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

export function QrCodeGenerator({ tool }: { tool: UtilityToolConfig }) {
  const [value, setValue] = useState("https://freeconvert.in");
  const [options, setOptions] = useState<QrOptions>({
    size: 512,
    margin: 3,
    dark: "#111827",
    light: "#ffffff",
    level: "M",
  });
  const qr = useQrCode(value, options);

  return (
    <UtilityToolLayout
      controls={
        <QrControls
          options={options}
          setOptions={setOptions}
          setValue={setValue}
          value={value}
        />
      }
      preview={
        <QrPreview
          blob={qr.blob}
          dataUrl={qr.dataUrl}
          error={qr.error}
          filename="freeconvert-qr-code"
          isGenerating={qr.isGenerating}
          svg={qr.svg}
          title="Generated QR code"
        />
      }
      tool={tool}
    />
  );
}

export function UpiQrCodeGenerator({ tool }: { tool: UtilityToolConfig }) {
  const [upiId, setUpiId] = useState("name@upi");
  const [payeeName, setPayeeName] = useState("FreeConvert");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("Payment");
  const [reference, setReference] = useState("");
  const [options, setOptions] = useState<QrOptions>({
    size: 512,
    margin: 3,
    dark: "#111827",
    light: "#ffffff",
    level: "M",
  });

  const isValidUpi = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z0-9.\-_]{2,}$/.test(
    upiId.trim(),
  );
  const upiUri = useMemo(() => {
    if (!isValidUpi) return "";
    const params = new URLSearchParams();
    params.set("pa", upiId.trim());
    if (payeeName.trim()) params.set("pn", payeeName.trim());
    if (amount.trim() && Number(amount) > 0) params.set("am", amount.trim());
    params.set("cu", "INR");
    if (note.trim()) params.set("tn", note.trim());
    if (reference.trim()) params.set("tr", reference.trim());
    return `upi://pay?${params.toString()}`;
  }, [amount, isValidUpi, note, payeeName, reference, upiId]);

  const qr = useQrCode(upiUri, options);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Payment details">
            <Field
              hint={isValidUpi ? undefined : "Use a valid VPA like name@bank."}
              label="UPI ID"
            >
              <input
                className="field-input"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
              />
            </Field>
            <Field label="Payee name">
              <input
                className="field-input"
                value={payeeName}
                onChange={(event) => setPayeeName(event.target.value)}
              />
            </Field>
            <Field label="Amount (optional)">
              <input
                className="field-input"
                min={0}
                placeholder="Leave blank for editable amount"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Field>
            <Field label="Payment note">
              <input
                className="field-input"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </Field>
            <Field label="Reference ID (optional)">
              <input
                className="field-input"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </Field>
          </ControlSection>
          <ControlSection title="QR style">
            <Field label={`Size: ${options.size}px`}>
              <input
                className="range-input"
                max={1024}
                min={160}
                step={16}
                type="range"
                value={options.size}
                onChange={(event) =>
                  setOptions({ ...options, size: Number(event.target.value) })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="QR color">
                <input
                  className="field-input h-12 p-1"
                  type="color"
                  value={options.dark}
                  onChange={(event) =>
                    setOptions({ ...options, dark: event.target.value })
                  }
                />
              </Field>
              <Field label="Background">
                <input
                  className="field-input h-12 p-1"
                  type="color"
                  value={options.light}
                  onChange={(event) =>
                    setOptions({ ...options, light: event.target.value })
                  }
                />
              </Field>
            </div>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={upiUri} />
              <DownloadButton blob={qr.blob} filename="freeconvert-upi-qr.png" />
            </>
          }
          title="UPI QR code"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div className="flex min-h-80 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
              {qr.isGenerating ? (
                <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
              ) : qr.dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Generated UPI QR code"
                  className="h-auto max-h-80 w-full max-w-80 rounded-lg bg-white object-contain"
                  src={qr.dataUrl}
                />
              ) : (
                <p className="text-center text-sm font-semibold text-[var(--muted)]">
                  Enter a valid UPI ID to generate the QR code.
                </p>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-[var(--text)]">
                Payment URI
              </h3>
              <div className="mt-3">
                <CodeBlock value={upiUri} />
              </div>
              {qr.error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {qr.error}
                </p>
              ) : null}
            </div>
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
