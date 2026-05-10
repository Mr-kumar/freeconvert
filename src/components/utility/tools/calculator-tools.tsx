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
