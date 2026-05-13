"use client";

import { useMemo, useState } from "react";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import {
  ControlSection,
  Field,
  PreviewShell,
  SegmentedChoice,
  StatCard,
  UtilityToolLayout,
  formatCurrency,
  formatNumber,
} from "@/components/utility/shared";

function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function EmiCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [principal, setPrincipal] = useState(1_000_000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const months = Math.max(1, Math.round(years * 12));
    const monthlyRate = rate / 12 / 100;
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);
    const totalPayment = emi * months;
    const interest = totalPayment - principal;
    return { months, emi, totalPayment, interest };
  }, [principal, rate, years]);

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Loan details">
          <Field label="Loan amount">
            <input
              className="field-input"
              min={0}
              type="number"
              value={principal}
              onChange={(event) => setPrincipal(Number(event.target.value))}
            />
          </Field>
          <Field label="Annual interest rate (%)">
            <input
              className="field-input"
              min={0}
              step={0.1}
              type="number"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </Field>
          <Field label="Tenure (years)">
            <input
              className="field-input"
              min={0.1}
              step={0.1}
              type="number"
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell title="EMI estimate">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Monthly EMI" tone="accent" value={formatCurrency(result.emi)} />
            <StatCard label="Principal" value={formatCurrency(principal)} />
            <StatCard label="Interest" tone="warning" value={formatCurrency(result.interest)} />
            <StatCard label="Total payment" value={formatCurrency(result.totalPayment)} />
          </div>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">
                  Principal share
                </p>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full bg-[var(--success)]"
                    style={{
                      width: `${Math.min(
                        100,
                        (principal / Math.max(result.totalPayment, 1)) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">
                  Interest share
                </p>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{
                      width: `${Math.min(
                        100,
                        (result.interest / Math.max(result.totalPayment, 1)) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Tenure: {result.months} months. This is an estimate and excludes fees,
              insurance and taxes.
            </p>
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function GstCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    if (mode === "add") {
      const tax = (amount * rate) / 100;
      return { base: amount, tax, total: amount + tax };
    }

    const base = amount / (1 + rate / 100);
    return { base, tax: amount - base, total: amount };
  }, [amount, mode, rate]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="GST mode">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Add GST", value: "add" },
                { label: "Remove GST", value: "remove" },
              ]}
              value={mode}
            />
          </ControlSection>
          <ControlSection title="Amount">
            <Field label={mode === "add" ? "Base amount" : "GST-inclusive amount"}>
              <input
                className="field-input"
                min={0}
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
            </Field>
            <Field label="GST rate">
              <select
                className="field-input"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
              >
                {[0, 3, 5, 12, 18, 28].map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="GST result">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Base amount" value={formatCurrency(result.base)} />
            <StatCard label="GST amount" tone="accent" value={formatCurrency(result.tax)} />
            <StatCard label="Total amount" value={formatCurrency(result.total)} />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function PercentageCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [percent, setPercent] = useState(15);
  const [number, setNumber] = useState(2000);
  const [part, setPart] = useState(240);
  const [total, setTotal] = useState(1200);
  const [oldValue, setOldValue] = useState(800);
  const [newValue, setNewValue] = useState(1000);

  const percentOf = (percent / 100) * number;
  const share = total === 0 ? 0 : (part / total) * 100;
  const change = oldValue === 0 ? 0 : ((newValue - oldValue) / oldValue) * 100;

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Percent of a number">
            <Field label="Percent">
              <input
                className="field-input"
                type="number"
                value={percent}
                onChange={(event) => setPercent(Number(event.target.value))}
              />
            </Field>
            <Field label="Number">
              <input
                className="field-input"
                type="number"
                value={number}
                onChange={(event) => setNumber(Number(event.target.value))}
              />
            </Field>
          </ControlSection>
          <ControlSection title="Share of total">
            <Field label="Part">
              <input
                className="field-input"
                type="number"
                value={part}
                onChange={(event) => setPart(Number(event.target.value))}
              />
            </Field>
            <Field label="Total">
              <input
                className="field-input"
                type="number"
                value={total}
                onChange={(event) => setTotal(Number(event.target.value))}
              />
            </Field>
          </ControlSection>
          <ControlSection title="Percentage change">
            <Field label="Old value">
              <input
                className="field-input"
                type="number"
                value={oldValue}
                onChange={(event) => setOldValue(Number(event.target.value))}
              />
            </Field>
            <Field label="New value">
              <input
                className="field-input"
                type="number"
                value={newValue}
                onChange={(event) => setNewValue(Number(event.target.value))}
              />
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="Percentage results">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label={`${percent}% of ${formatNumber(number)}`}
              tone="accent"
              value={formatNumber(percentOf)}
            />
            <StatCard
              label={`${formatNumber(part)} out of ${formatNumber(total)}`}
              value={`${formatNumber(share)}%`}
            />
            <StatCard
              label="Percentage change"
              tone={change >= 0 ? "success" : "warning"}
              value={`${formatNumber(change)}%`}
            />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function AgeCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [asOfDate, setAsOfDate] = useState(todayInputValue());

  const result = useMemo(() => {
    const start = parseDateInput(birthDate);
    const end = parseDateInput(asOfDate);
    if (!start || !end || end < start) return null;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000);
    const nextBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBirthday < end) nextBirthday.setFullYear(end.getFullYear() + 1);
    const daysToBirthday = Math.ceil(
      (nextBirthday.getTime() - end.getTime()) / 86_400_000,
    );

    return { years, months, days, totalDays, daysToBirthday };
  }, [asOfDate, birthDate]);

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Dates">
          <Field label="Date of birth">
            <input
              className="field-input"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
            />
          </Field>
          <Field label="Age on date">
            <input
              className="field-input"
              type="date"
              value={asOfDate}
              onChange={(event) => setAsOfDate(event.target.value)}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell title="Age result">
          {result ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Years" tone="accent" value={result.years} />
              <StatCard label="Months" value={result.months} />
              <StatCard label="Days" value={result.days} />
              <StatCard label="Total days" value={formatNumber(result.totalDays)} />
              <StatCard
                label="Next birthday"
                tone="success"
                value={`${result.daysToBirthday} days`}
              />
            </div>
          ) : (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              Choose a valid birth date before the age-on date.
            </p>
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function BmiCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [heightIn, setHeightIn] = useState(69);
  const [weightLb, setWeightLb] = useState(160);

  const result = useMemo(() => {
    const heightMeters = unit === "metric" ? heightCm / 100 : heightIn * 0.0254;
    const weight = unit === "metric" ? weightKg : weightLb * 0.45359237;
    const bmi = heightMeters > 0 ? weight / heightMeters ** 2 : 0;
    const healthyLow = 18.5 * heightMeters ** 2;
    const healthyHigh = 24.9 * heightMeters ** 2;
    const category =
      bmi < 18.5
        ? "Underweight"
        : bmi < 25
          ? "Healthy"
          : bmi < 30
            ? "Overweight"
            : "Obesity";

    return { bmi, category, healthyLow, healthyHigh };
  }, [heightCm, heightIn, unit, weightKg, weightLb]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Units">
            <SegmentedChoice
              value={unit}
              options={[
                { label: "Metric", value: "metric" },
                { label: "Imperial", value: "imperial" },
              ]}
              onChange={setUnit}
            />
          </ControlSection>
          <ControlSection title="Body measurements">
            {unit === "metric" ? (
              <>
                <Field label="Height (cm)">
                  <input className="field-input" min={1} type="number" value={heightCm} onChange={(event) => setHeightCm(Number(event.target.value))} />
                </Field>
                <Field label="Weight (kg)">
                  <input className="field-input" min={1} type="number" value={weightKg} onChange={(event) => setWeightKg(Number(event.target.value))} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Height (inches)">
                  <input className="field-input" min={1} type="number" value={heightIn} onChange={(event) => setHeightIn(Number(event.target.value))} />
                </Field>
                <Field label="Weight (lb)">
                  <input className="field-input" min={1} type="number" value={weightLb} onChange={(event) => setWeightLb(Number(event.target.value))} />
                </Field>
              </>
            )}
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="BMI result">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="BMI" tone="accent" value={formatNumber(result.bmi, 1)} />
            <StatCard label="Category" value={result.category} />
            <StatCard
              label="Healthy low"
              value={unit === "metric" ? `${formatNumber(result.healthyLow, 1)} kg` : `${formatNumber(result.healthyLow / 0.45359237, 1)} lb`}
            />
            <StatCard
              label="Healthy high"
              value={unit === "metric" ? `${formatNumber(result.healthyHigh, 1)} kg` : `${formatNumber(result.healthyHigh / 0.45359237, 1)} lb`}
            />
          </div>
          <p className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
            BMI is a general screening estimate. It does not measure body fat or replace professional medical advice.
          </p>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

const fallbackZones = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function zoneOptions() {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }

  return fallbackZones;
}

function formatInZone(date: Date, timeZone: string, hour12: boolean) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12,
    timeZone,
  }).format(date);
}

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
  };
}

function zonedLocalTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const target = Date.UTC(year, month - 1, day, hour, minute);
  let guess = target;

  for (let index = 0; index < 3; index += 1) {
    const parts = partsInZone(new Date(guess), timeZone);
    const rendered = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
    );
    guess += target - rendered;
  }

  return new Date(guess);
}

export function TimeZoneConverter({ tool }: { tool: UtilityToolConfig }) {
  const [sourceZone, setSourceZone] = useState("Asia/Kolkata");
  const [targetZone, setTargetZone] = useState("America/New_York");
  const [date, setDate] = useState(todayInputValue());
  const [time, setTime] = useState("10:00");
  const [hour12, setHour12] = useState(true);
  const zones = useMemo(() => zoneOptions(), []);
  const selectedDate = useMemo(() => {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    return zonedLocalTimeToDate(year, month, day, hour, minute, sourceZone);
  }, [date, sourceZone, time]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Time">
            <Field label="Date">
              <input className="field-input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </Field>
            <Field label="Time">
              <input className="field-input" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </Field>
            <Field label="From time zone">
              <select className="field-input" value={sourceZone} onChange={(event) => setSourceZone(event.target.value)}>
                {zones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
              </select>
            </Field>
            <Field label="To time zone">
              <select className="field-input" value={targetZone} onChange={(event) => setTargetZone(event.target.value)}>
                {zones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
              </select>
            </Field>
            <SegmentedChoice
              value={hour12 ? "12" : "24"}
              options={[
                { label: "12 hour", value: "12" },
                { label: "24 hour", value: "24" },
              ]}
              onChange={(value) => setHour12(value === "12")}
            />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="Converted times">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard label={sourceZone} value={formatInZone(selectedDate, sourceZone, hour12)} />
            <StatCard label={targetZone} tone="accent" value={formatInZone(selectedDate, targetZone, hour12)} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[sourceZone, targetZone, "UTC", "Europe/London", "Asia/Singapore", "Australia/Sydney"].filter((zone, index, list) => list.indexOf(zone) === index).map((zone) => (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4" key={zone}>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">{zone}</p>
                <p className="mt-2 text-sm font-extrabold text-[var(--text)]">{formatInZone(selectedDate, zone, hour12)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
            This uses your browser time-zone database, including daylight saving rules where available.
          </p>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function SipCalculator({ tool }: { tool: UtilityToolConfig }) {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const months = Math.max(1, Math.round(years * 12));
    const monthlyRate = rate / 12 / 100;
    const invested = monthly * months;
    const futureValue =
      monthlyRate === 0
        ? invested
        : monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    return {
      months,
      invested,
      futureValue,
      gains: futureValue - invested,
    };
  }, [monthly, rate, years]);

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="SIP details">
          <Field label="Monthly investment">
            <input
              className="field-input"
              min={0}
              type="number"
              value={monthly}
              onChange={(event) => setMonthly(Number(event.target.value))}
            />
          </Field>
          <Field label="Expected annual return (%)">
            <input
              className="field-input"
              min={0}
              step={0.1}
              type="number"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </Field>
          <Field label="Investment period (years)">
            <input
              className="field-input"
              min={0.1}
              step={0.1}
              type="number"
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell title="SIP estimate">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Future value" tone="accent" value={formatCurrency(result.futureValue)} />
            <StatCard label="Invested" value={formatCurrency(result.invested)} />
            <StatCard label="Estimated gains" tone="success" value={formatCurrency(result.gains)} />
            <StatCard label="Months" value={result.months} />
          </div>
          <p className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
            This is an estimate based on a constant annual return. Real mutual fund
            returns can move up or down.
          </p>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
