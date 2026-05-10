"use client";

import { useMemo, useState } from "react";
import type { UtilityToolConfig, UtilityToolSlug } from "@/lib/utilityTools";
import {
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  StatCard,
  UtilityToolLayout,
  formatNumber,
} from "@/components/utility/shared";

interface UnitDefinition {
  label: string;
  symbol: string;
  toBase: number;
}

const converterDefinitions: Record<
  Extract<UtilityToolSlug, "length-converter" | "weight-converter" | "area-converter">,
  {
    defaultValue: number;
    defaultFrom: string;
    defaultTo: string;
    baseLabel: string;
    units: Record<string, UnitDefinition>;
  }
> = {
  "length-converter": {
    defaultValue: 100,
    defaultFrom: "cm",
    defaultTo: "inch",
    baseLabel: "Meter",
    units: {
      m: { label: "Meter", symbol: "m", toBase: 1 },
      km: { label: "Kilometer", symbol: "km", toBase: 1000 },
      cm: { label: "Centimeter", symbol: "cm", toBase: 0.01 },
      mm: { label: "Millimeter", symbol: "mm", toBase: 0.001 },
      inch: { label: "Inch", symbol: "in", toBase: 0.0254 },
      foot: { label: "Foot", symbol: "ft", toBase: 0.3048 },
      yard: { label: "Yard", symbol: "yd", toBase: 0.9144 },
      mile: { label: "Mile", symbol: "mi", toBase: 1609.344 },
    },
  },
  "weight-converter": {
    defaultValue: 1,
    defaultFrom: "kg",
    defaultTo: "lb",
    baseLabel: "Kilogram",
    units: {
      kg: { label: "Kilogram", symbol: "kg", toBase: 1 },
      g: { label: "Gram", symbol: "g", toBase: 0.001 },
      mg: { label: "Milligram", symbol: "mg", toBase: 0.000001 },
      tonne: { label: "Tonne", symbol: "t", toBase: 1000 },
      lb: { label: "Pound", symbol: "lb", toBase: 0.45359237 },
      oz: { label: "Ounce", symbol: "oz", toBase: 0.028349523125 },
      stone: { label: "Stone", symbol: "st", toBase: 6.35029318 },
    },
  },
  "area-converter": {
    defaultValue: 1000,
    defaultFrom: "sqft",
    defaultTo: "sqm",
    baseLabel: "Square meter",
    units: {
      sqm: { label: "Square meter", symbol: "m2", toBase: 1 },
      sqcm: { label: "Square centimeter", symbol: "cm2", toBase: 0.0001 },
      sqft: { label: "Square foot", symbol: "ft2", toBase: 0.09290304 },
      sqyd: { label: "Square yard", symbol: "yd2", toBase: 0.83612736 },
      acre: { label: "Acre", symbol: "acre", toBase: 4046.8564224 },
      hectare: { label: "Hectare", symbol: "ha", toBase: 10000 },
      sqkm: { label: "Square kilometer", symbol: "km2", toBase: 1_000_000 },
    },
  },
};

function convert(value: number, from: UnitDefinition, to: UnitDefinition) {
  return (value * from.toBase) / to.toBase;
}

export function UnitConverterTool({
  tool,
}: {
  tool: UtilityToolConfig & {
    slug: "length-converter" | "weight-converter" | "area-converter";
  };
}) {
  const definition = converterDefinitions[tool.slug];
  const unitEntries = Object.entries(definition.units);
  const [value, setValue] = useState(definition.defaultValue);
  const [fromUnit, setFromUnit] = useState(definition.defaultFrom);
  const [toUnit, setToUnit] = useState(definition.defaultTo);

  const result = useMemo(() => {
    const from = definition.units[fromUnit];
    const to = definition.units[toUnit];
    const converted = convert(value, from, to);
    const all = unitEntries.map(([key, unit]) => ({
      key,
      unit,
      value: convert(value, from, unit),
    }));
    return { from, to, converted, all };
  }, [definition.units, fromUnit, toUnit, unitEntries, value]);

  const summary = `${formatNumber(value, 8)} ${result.from.symbol} = ${formatNumber(
    result.converted,
    8,
  )} ${result.to.symbol}`;

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Convert">
          <Field label="Value">
            <input
              className="field-input"
              type="number"
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
            />
          </Field>
          <Field label="From">
            <select
              className="field-input"
              value={fromUnit}
              onChange={(event) => setFromUnit(event.target.value)}
            >
              {unitEntries.map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="To">
            <select
              className="field-input"
              value={toUnit}
              onChange={(event) => setToUnit(event.target.value)}
            >
              {unitEntries.map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </Field>
          <button
            className="segmented-button justify-center"
            type="button"
            onClick={() => {
              setFromUnit(toUnit);
              setToUnit(fromUnit);
            }}
          >
            Swap units
          </button>
        </ControlSection>
      }
      preview={
        <PreviewShell actions={<CopyButton value={summary} />} title="Conversion result">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Input" value={`${formatNumber(value, 8)} ${result.from.symbol}`} />
            <StatCard
              label="Converted"
              tone="accent"
              value={`${formatNumber(result.converted, 8)} ${result.to.symbol}`}
            />
            <StatCard label="Base unit" value={definition.baseLabel} />
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-[var(--surface-2)] text-xs uppercase text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Symbol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-white">
                {result.all.map(({ key, unit, value: convertedValue }) => (
                  <tr key={key}>
                    <td className="px-4 py-3 font-semibold text-[var(--text)]">
                      {unit.label}
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--text)]">
                      {formatNumber(convertedValue, 8)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{unit.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
