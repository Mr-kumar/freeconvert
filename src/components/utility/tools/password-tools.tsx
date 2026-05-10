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
  ToggleRow,
  UtilityToolLayout,
  clampNumber,
  formatNumber,
} from "@/components/utility/shared";

const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()-_=+[]{};:,.?/|";
const ambiguousChars = new Set(["0", "O", "o", "1", "l", "I"]);
const defaultPasswordOptions = {
  length: 18,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: true,
};

function randomIndex(max: number) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

function generatePassword(options: {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}) {
  const groups = [
    options.lowercase ? lowerChars : "",
    options.uppercase ? upperChars : "",
    options.numbers ? numberChars : "",
    options.symbols ? symbolChars : "",
  ]
    .map((group) =>
      options.avoidAmbiguous
        ? group
            .split("")
            .filter((char) => !ambiguousChars.has(char))
            .join("")
        : group,
    )
    .filter(Boolean);

  const pool = groups.join("");
  if (!pool) return "";

  const password = groups.map((group) => group[randomIndex(group.length)]);
  while (password.length < options.length) {
    password.push(pool[randomIndex(pool.length)]);
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1);
    [password[index], password[swap]] = [password[swap], password[index]];
  }

  return password.join("");
}

function passwordAnalysis(password: string) {
  const charsets = [
    /[a-z]/.test(password) ? 26 : 0,
    /[A-Z]/.test(password) ? 26 : 0,
    /\d/.test(password) ? 10 : 0,
    /[^a-zA-Z0-9]/.test(password) ? 32 : 0,
  ];
  const poolSize = charsets.reduce((sum, value) => sum + value, 0);
  const entropy = password.length * Math.log2(Math.max(poolSize, 1));
  const hasRepeat = /(.)\1{2,}/.test(password);
  const hasSequence = /(0123|1234|abcd|qwer|password|admin|welcome)/i.test(password);
  let score = 0;
  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 20;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  if (entropy >= 80) score += 10;
  if (hasRepeat) score -= 15;
  if (hasSequence) score -= 20;
  score = clampNumber(score, 0, 100);

  const label =
    score >= 85 ? "Strong" : score >= 65 ? "Good" : score >= 40 ? "Weak" : "Very weak";
  const hints = [
    password.length < 12 ? "Use at least 12 characters." : "",
    !/[a-z]/.test(password) ? "Add lowercase letters." : "",
    !/[A-Z]/.test(password) ? "Add uppercase letters." : "",
    !/\d/.test(password) ? "Add numbers." : "",
    !/[^a-zA-Z0-9]/.test(password) ? "Add symbols." : "",
    hasRepeat ? "Avoid repeated character runs." : "",
    hasSequence ? "Avoid common words or sequences." : "",
  ].filter(Boolean);

  return { entropy, score, label, hints };
}

export function PasswordGenerator({ tool }: { tool: UtilityToolConfig }) {
  const [length, setLength] = useState(defaultPasswordOptions.length);
  const [lowercase, setLowercase] = useState(defaultPasswordOptions.lowercase);
  const [uppercase, setUppercase] = useState(defaultPasswordOptions.uppercase);
  const [numbers, setNumbers] = useState(defaultPasswordOptions.numbers);
  const [symbols, setSymbols] = useState(defaultPasswordOptions.symbols);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(
    defaultPasswordOptions.avoidAmbiguous,
  );
  const [password, setPassword] = useState(() =>
    generatePassword(defaultPasswordOptions),
  );

  const options = useMemo(
    () => ({
      length,
      lowercase,
      uppercase,
      numbers,
      symbols,
      avoidAmbiguous,
    }),
    [avoidAmbiguous, length, lowercase, numbers, symbols, uppercase],
  );
  const analysis = useMemo(() => passwordAnalysis(password), [password]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Password options">
            <Field label={`Length: ${length}`}>
              <input
                className="range-input"
                max={64}
                min={8}
                type="range"
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
            </Field>
            <ToggleRow checked={lowercase} label="Lowercase" onChange={setLowercase} />
            <ToggleRow checked={uppercase} label="Uppercase" onChange={setUppercase} />
            <ToggleRow checked={numbers} label="Numbers" onChange={setNumbers} />
            <ToggleRow checked={symbols} label="Symbols" onChange={setSymbols} />
            <ToggleRow
              checked={avoidAmbiguous}
              label="Avoid ambiguous"
              onChange={setAvoidAmbiguous}
            />
          </ControlSection>
          <ControlSection title="Generate">
            <button
              className="button-primary"
              type="button"
              onClick={() => setPassword(generatePassword(options))}
            >
              Generate password
            </button>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell actions={<CopyButton value={password} />} title="Generated password">
          <CodeBlock value={password} />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatCard label="Strength" tone="accent" value={analysis.label} />
            <StatCard label="Score" value={`${analysis.score}/100`} />
            <StatCard
              label="Entropy"
              value={`${formatNumber(analysis.entropy, 1)} bits`}
            />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function PasswordStrengthChecker({ tool }: { tool: UtilityToolConfig }) {
  const [password, setPassword] = useState("");
  const analysis = useMemo(() => passwordAnalysis(password), [password]);

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="Password">
          <Field label="Enter password">
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field label="Show for checking">
            <textarea
              className="field-input min-h-24 resize-y font-mono"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
        </ControlSection>
      }
      preview={
        <PreviewShell title="Strength result">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Strength" tone="accent" value={password ? analysis.label : "Empty"} />
            <StatCard label="Score" value={`${analysis.score}/100`} />
            <StatCard
              label="Entropy"
              value={`${formatNumber(analysis.entropy, 1)} bits`}
            />
          </div>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: `${analysis.score}%` }}
              />
            </div>
            <h3 className="mt-5 text-sm font-extrabold text-[var(--text)]">
              Suggestions
            </h3>
            {analysis.hints.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                {analysis.hints.map((hint) => (
                  <li className="flex gap-2" key={hint}>
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                This password has a good basic structure. Use a password manager
                and avoid reusing it across accounts.
              </p>
            )}
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}
