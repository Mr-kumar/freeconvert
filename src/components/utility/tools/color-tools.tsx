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
  UtilityToolLayout,
  formatNumber,
} from "@/components/utility/shared";

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value.padEnd(6, "0").slice(0, 6);
  const parsed = Number.parseInt(full, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case nr:
        h = (ng - nb) / d + (ng < nb ? 6 : 0);
        break;
      case ng:
        h = (nb - nr) / d + 2;
        break;
      default:
        h = (nr - ng) / d + 4;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const k = 1 - Math.max(nr, ng, nb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - nr - k) / (1 - k)) * 100),
    m: Math.round(((1 - ng - k) / (1 - k)) * 100),
    y: Math.round(((1 - nb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function luminanceChannel(value: number) {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * luminanceChannel(r) +
    0.7152 * luminanceChannel(g) +
    0.0722 * luminanceChannel(b)
  );
}

function contrastRatio(foreground: string, background: string) {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function ColorPickerTool({ tool }: { tool: UtilityToolConfig }) {
  const [color, setColor] = useState("#008ee9");
  const values = useMemo(() => {
    const { r, g, b } = hexToRgb(color);
    const hsl = rgbToHsl(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);
    return {
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    };
  }, [color]);
  const output = Object.entries(values)
    .map(([label, value]) => `${label.toUpperCase()}: ${value}`)
    .join("\n");

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Pick color">
          <Field label="Color">
            <input
              className="field-input h-16 p-1"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </Field>
          <Field label="HEX">
            <input
              className="field-input font-mono"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell actions={<CopyButton value={output} />} title="Color values">
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div
              className="min-h-56 rounded-xl border border-[var(--border)]"
              style={{ backgroundColor: color }}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="HEX" tone="accent" value={values.hex} />
              <StatCard label="RGB" value={values.rgb} />
              <StatCard label="HSL" value={values.hsl} />
              <StatCard label="CMYK" value={values.cmyk} />
            </div>
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function ColorContrastChecker({ tool }: { tool: UtilityToolConfig }) {
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const ratio = useMemo(
    () => contrastRatio(foreground, background),
    [background, foreground],
  );
  const normalAA = ratio >= 4.5;
  const largeAA = ratio >= 3;
  const normalAAA = ratio >= 7;
  const largeAAA = ratio >= 4.5;
  const summary = [
    `Foreground: ${foreground}`,
    `Background: ${background}`,
    `Contrast ratio: ${formatNumber(ratio, 2)}:1`,
    `Normal text AA: ${normalAA ? "Pass" : "Fail"}`,
    `Large text AA: ${largeAA ? "Pass" : "Fail"}`,
    `Normal text AAA: ${normalAAA ? "Pass" : "Fail"}`,
    `Large text AAA: ${largeAAA ? "Pass" : "Fail"}`,
  ].join("\n");

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Colors">
          <Field label="Text color">
            <input
              className="field-input h-14 p-1"
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
            />
          </Field>
          <Field label="Background color">
            <input
              className="field-input h-14 p-1"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell actions={<CopyButton value={summary} />} title="Contrast result">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
            <div
              className="rounded-xl border border-[var(--border)] p-8"
              style={{ backgroundColor: background, color: foreground }}
            >
              <p className="text-3xl font-extrabold">Readable text preview</p>
              <p className="mt-4 text-base leading-7">
                Use this preview to check body text, button labels and headings
                before publishing your design.
              </p>
              <button
                className="mt-6 rounded-lg px-4 py-3 text-sm font-bold"
                style={{ backgroundColor: foreground, color: background }}
                type="button"
              >
                Button preview
              </button>
            </div>
            <div className="grid gap-4">
              <StatCard
                label="Contrast ratio"
                tone={normalAA ? "success" : "warning"}
                value={`${formatNumber(ratio, 2)}:1`}
              />
              <StatCard label="Normal text AA" value={normalAA ? "Pass" : "Fail"} />
              <StatCard label="Large text AA" value={largeAA ? "Pass" : "Fail"} />
              <StatCard label="Normal text AAA" value={normalAAA ? "Pass" : "Fail"} />
              <StatCard label="Large text AAA" value={largeAAA ? "Pass" : "Fail"} />
            </div>
          </div>
          <div className="mt-5">
            <CodeBlock value={summary} />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
