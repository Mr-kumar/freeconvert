"use client";

import { useMemo, useState } from "react";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import {
  CodeBlock,
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  SegmentedChoice,
  StatCard,
  TextDownloadButton,
  UtilityToolLayout,
} from "@/components/utility/shared";

function bytesToBase64(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToText(value: string) {
  const binary = atob(value.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function JsonFormatter({ tool }: { tool: UtilityToolConfig }) {
  const [input, setInput] = useState(
    '{"site":"FreeConvert","tools":["image","pdf","qr","text"],"free":true}',
  );
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const output =
        mode === "format" ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);
      return { output, error: "", valid: true };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid JSON",
        valid: false,
      };
    }
  }, [indent, input, mode]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="JSON input">
            <Field label="Paste JSON">
              <textarea
                className="field-input min-h-72 resize-y font-mono"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </Field>
          </ControlSection>
          <ControlSection title="Output">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Format", value: "format" },
                { label: "Minify", value: "minify" },
              ]}
              value={mode}
            />
            <Field label="Indent spaces">
              <select
                className="field-input"
                disabled={mode === "minify"}
                value={indent}
                onChange={(event) => setIndent(Number(event.target.value))}
              >
                {[2, 4, 8].map((value) => (
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
        <PreviewShell
          actions={
            <>
              <CopyButton value={result.output} />
              <TextDownloadButton filename="formatted.json" text={result.output} />
            </>
          }
          title="Formatted JSON"
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Status"
              tone={result.valid ? "success" : "warning"}
              value={result.valid ? "Valid JSON" : "Invalid JSON"}
            />
            <StatCard label="Input size" value={`${input.length} chars`} />
          </div>
          {result.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {result.error}
            </p>
          ) : (
            <CodeBlock value={result.output} />
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function Base64EncoderDecoder({ tool }: { tool: UtilityToolConfig }) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("FreeConvert browser tools");

  const result = useMemo(() => {
    try {
      if (mode === "encode") {
        return {
          output: bytesToBase64(new TextEncoder().encode(input)),
          error: "",
        };
      }

      return { output: base64ToText(input), error: "" };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Could not decode Base64.",
      };
    }
  }, [input, mode]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Mode">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Encode", value: "encode" },
                { label: "Decode", value: "decode" },
              ]}
              value={mode}
            />
          </ControlSection>
          <ControlSection title="Input">
            <Field label={mode === "encode" ? "Text" : "Base64"}>
              <textarea
                className="field-input min-h-72 resize-y font-mono"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={result.output} />
              <TextDownloadButton filename="base64-output.txt" text={result.output} />
            </>
          }
          title="Output"
        >
          {result.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {result.error}
            </p>
          ) : (
            <CodeBlock value={result.output} />
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function UrlEncoderDecoder({ tool }: { tool: UtilityToolConfig }) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("https://freeconvert.in/search?q=merge pdf");

  const result = useMemo(() => {
    try {
      const output =
        mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      let parsed: URL | null = null;
      try {
        parsed = new URL(mode === "encode" ? input : output);
      } catch {
        parsed = null;
      }
      return { output, error: "", parsed };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Could not process URL text.",
        parsed: null,
      };
    }
  }, [input, mode]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Mode">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Encode", value: "encode" },
                { label: "Decode", value: "decode" },
              ]}
              value={mode}
            />
          </ControlSection>
          <ControlSection title="Input">
            <Field label={mode === "encode" ? "URL text" : "Encoded URL text"}>
              <textarea
                className="field-input min-h-72 resize-y font-mono"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={result.output} />
              <TextDownloadButton filename="url-output.txt" text={result.output} />
            </>
          }
          title="Output"
        >
          {result.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {result.error}
            </p>
          ) : (
            <>
              <CodeBlock value={result.output} />
              {result.parsed ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <StatCard label="Protocol" value={result.parsed.protocol || "-"} />
                  <StatCard label="Host" value={result.parsed.host || "-"} />
                  <StatCard label="Path" value={result.parsed.pathname || "-"} />
                  <StatCard label="Query" value={result.parsed.search || "-"} />
                </div>
              ) : null}
            </>
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
