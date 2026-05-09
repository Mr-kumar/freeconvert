import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ImageFormat } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function getAspectRatio(width: number, height: number) {
  if (!width || !height) {
    return "0:0";
  }

  const divisor = gcd(width, height);
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

export function getExtensionFromMime(format: ImageFormat | string) {
  switch (format) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "png";
  }
}

export function replaceFileExtension(fileName: string, format: ImageFormat) {
  const base = fileName.replace(/\.[^/.]+$/, "") || "freeconvert-image";
  return `${base}.${getExtensionFromMime(format)}`;
}

export function mimeFromShortFormat(value?: string | string[]): ImageFormat {
  const normalized = Array.isArray(value) ? value[0] : value;

  switch ((normalized || "").toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

export function shortFormat(format: ImageFormat) {
  return format.replace("image/", "").replace("jpeg", "jpg").toUpperCase();
}

export function isImageFormat(format: string): format is ImageFormat {
  return (
    format === "image/jpeg" ||
    format === "image/png" ||
    format === "image/webp" ||
    format === "image/avif"
  );
}

export function isCanvasSizeSafe(width: number, height: number) {
  const maxSide = 32767;
  const maxArea = 268_000_000;
  return width <= maxSide && height <= maxSide && width * height <= maxArea;
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getNumber(value: unknown, fallback: number) {
  const normalized = Array.isArray(value) ? value[0] : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getString(value: unknown, fallback = "") {
  const normalized = Array.isArray(value) ? value[0] : value;
  return typeof normalized === "string" ? normalized : fallback;
}

export function getBoolean(value: unknown, fallback = false) {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (typeof normalized === "boolean") {
    return normalized;
  }

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return fallback;
}
