export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

export function safeNumber(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(firstParam(value));

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

export function safeBoolean(
  value: string | string[] | undefined,
  fallback: boolean,
) {
  const normalized = firstParam(value);

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return fallback;
}

export function safeString(
  value: string | string[] | undefined,
  fallback = "",
  maxLength = 120,
) {
  const normalized = firstParam(value);

  if (!normalized) {
    return fallback;
  }

  return stripHtml(normalized).slice(0, maxLength);
}

export function safeEnum<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T,
) {
  const normalized = firstParam(value);
  return normalized && allowed.includes(normalized as T)
    ? (normalized as T)
    : fallback;
}

export function safeColor(
  value: string | string[] | undefined,
  fallback = "#ffffff",
) {
  const normalized = firstParam(value);

  if (normalized === "transparent") {
    return normalized;
  }

  if (normalized && /^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized;
  }

  return fallback;
}
