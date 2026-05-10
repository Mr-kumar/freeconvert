"use client";

import { useMemo, useState } from "react";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import {
  CodeBlock,
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  StatCard,
  TextDownloadButton,
  ToggleRow,
  UtilityToolLayout,
  formatNumber,
} from "@/components/utility/shared";

const sampleText =
  "FreeConvert helps you resize images, merge PDF files, count words and clean text directly in your browser.";

function normalizeWords(text: string) {
  return text
    .toLowerCase()
    .match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? [];
}

function titleCase(text: string) {
  return text.toLowerCase().replace(/\b[a-z0-9]/g, (char) => char.toUpperCase());
}

function sentenceCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function wordsFromText(text: string) {
  return normalizeWords(text).map((word) => word.replace(/[^a-z0-9]/g, ""));
}

function toCamel(text: string) {
  const words = wordsFromText(text);
  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
}

function toPascal(text: string) {
  return wordsFromText(text)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function keywordFrequency(text: string) {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "you",
    "your",
    "this",
    "that",
    "from",
    "are",
    "can",
    "into",
    "online",
  ]);
  const counts = new Map<string, number>();
  normalizeWords(text)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);
}

export function WordCounter({ tool }: { tool: UtilityToolConfig }) {
  const [text, setText] = useState(sampleText);
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = normalizeWords(text);
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((item) => item.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((item) => item.trim().length > 0).length
      : 0;

    return {
      words: words.length,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      lines: text ? text.split(/\r\n|\r|\n/).length : 0,
      readingTime: Math.max(1, Math.ceil(words.length / 225)),
      speakingTime: Math.max(1, Math.ceil(words.length / 150)),
      keywords: keywordFrequency(text),
    };
  }, [text]);

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Text">
          <Field label="Paste or type text">
            <textarea
              className="field-input min-h-80 resize-y"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </Field>
          <button
            className="segmented-button justify-center"
            type="button"
            onClick={() => setText("")}
          >
            Clear text
          </button>
        </ControlSection>
      }
      preview={
        <PreviewShell title="Text statistics">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Words" tone="accent" value={formatNumber(stats.words)} />
            <StatCard
              label="Characters"
              value={formatNumber(stats.characters)}
            />
            <StatCard
              label="Without spaces"
              value={formatNumber(stats.charactersNoSpaces)}
            />
            <StatCard label="Sentences" value={formatNumber(stats.sentences)} />
            <StatCard label="Paragraphs" value={formatNumber(stats.paragraphs)} />
            <StatCard label="Lines" value={formatNumber(stats.lines)} />
            <StatCard label="Read time" value={`${stats.readingTime} min`} />
            <StatCard label="Speak time" value={`${stats.speakingTime} min`} />
          </div>
          <section className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <h3 className="text-sm font-extrabold text-[var(--text)]">
              Top keywords
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {stats.keywords.length ? (
                stats.keywords.map(([word, count]) => (
                  <span
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[var(--text)] ring-1 ring-[var(--border)]"
                    key={word}
                  >
                    {word} ({count})
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  Add more text to see keyword frequency.
                </p>
              )}
            </div>
          </section>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function TextCaseConverter({ tool }: { tool: UtilityToolConfig }) {
  const [input, setInput] = useState("free online tools for image pdf and text");
  const [output, setOutput] = useState(titleCase(input));

  const actions = [
    ["Uppercase", () => input.toUpperCase()],
    ["Lowercase", () => input.toLowerCase()],
    ["Title Case", () => titleCase(input)],
    ["Sentence case", () => sentenceCase(input)],
    ["camelCase", () => toCamel(input)],
    ["PascalCase", () => toPascal(input)],
    ["snake_case", () => wordsFromText(input).join("_")],
    ["kebab-case", () => wordsFromText(input).join("-")],
  ] as const;

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Input text">
            <Field label="Text">
              <textarea
                className="field-input min-h-56 resize-y"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setOutput(titleCase(event.target.value));
                }}
              />
            </Field>
          </ControlSection>
          <ControlSection title="Convert to">
            <div className="grid grid-cols-2 gap-2">
              {actions.map(([label, transform]) => (
                <button
                  className="segmented-button justify-center"
                  key={label}
                  type="button"
                  onClick={() => setOutput(transform())}
                >
                  {label}
                </button>
              ))}
            </div>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={output} />
              <TextDownloadButton filename="converted-text.txt" text={output} />
            </>
          }
          title="Converted text"
        >
          <CodeBlock value={output} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function RemoveDuplicateLines({ tool }: { tool: UtilityToolConfig }) {
  const [input, setInput] = useState("apple\nbanana\nApple\norange\nbanana\n");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortLines, setSortLines] = useState(false);

  const result = useMemo(() => {
    const originalLines = input.split(/\r\n|\r|\n/);
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const rawLine of originalLines) {
      const outputLine = trimLines ? rawLine.trim() : rawLine;
      if (removeEmpty && outputLine.length === 0) continue;

      const key = caseSensitive ? outputLine : outputLine.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(outputLine);
    }

    const outputLines = sortLines ? [...unique].sort((a, b) => a.localeCompare(b)) : unique;
    return {
      output: outputLines.join("\n"),
      originalCount: originalLines.filter((line) => !removeEmpty || line.trim()).length,
      uniqueCount: unique.length,
    };
  }, [caseSensitive, input, removeEmpty, sortLines, trimLines]);

  const removed = Math.max(0, result.originalCount - result.uniqueCount);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Lines">
            <Field label="Paste list">
              <textarea
                className="field-input min-h-72 resize-y"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </Field>
          </ControlSection>
          <ControlSection title="Options">
            <ToggleRow
              checked={caseSensitive}
              label="Case-sensitive match"
              onChange={setCaseSensitive}
            />
            <ToggleRow checked={trimLines} label="Trim whitespace" onChange={setTrimLines} />
            <ToggleRow
              checked={removeEmpty}
              label="Remove empty lines"
              onChange={setRemoveEmpty}
            />
            <ToggleRow checked={sortLines} label="Sort output" onChange={setSortLines} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={result.output} />
              <TextDownloadButton filename="unique-lines.txt" text={result.output} />
            </>
          }
          title="Unique lines"
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Input lines" value={result.originalCount} />
            <StatCard label="Unique lines" tone="accent" value={result.uniqueCount} />
            <StatCard label="Removed" tone="success" value={removed} />
          </div>
          <CodeBlock value={result.output} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
