const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
];

const MAX_FILE_SIZE_MB = 50;
const MAX_PDF_FILE_SIZE_MB = 100;
const suspiciousFileName = /[<>:"/\\|?*\x00-\x1F]/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  const hasAllowedExtension = /\.(jpe?g|png|webp|avif|gif|bmp|tiff?|heic|heif)$/i.test(
    file.name,
  );

  if (!ALLOWED_TYPES.includes(file.type) && !hasAllowedExtension) {
    return {
      valid: false,
      error: `File type "${file.type || "unknown"}" is not supported.`,
    };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMB.toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  if (suspiciousFileName.test(file.name)) {
    return {
      valid: false,
      error: "File name contains invalid characters.",
    };
  }

  return { valid: true };
}

export function validatePDFFile(file: File): ValidationResult {
  const hasPDFExtension = /\.pdf$/i.test(file.name);

  if (file.type !== "application/pdf" && !hasPDFExtension) {
    return {
      valid: false,
      error: `File type "${file.type || "unknown"}" is not a PDF.`,
    };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_PDF_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `PDF is too large (${sizeMB.toFixed(1)}MB). Maximum is ${MAX_PDF_FILE_SIZE_MB}MB for browser processing.`,
    };
  }

  if (suspiciousFileName.test(file.name)) {
    return {
      valid: false,
      error: "File name contains invalid characters.",
    };
  }

  return { valid: true };
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

export async function verifyMagicBytes(file: File) {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return true;
  }

  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47])) {
    return true;
  }

  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return true;
  }

  if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38])) {
    return true;
  }

  if (startsWith(bytes, [0x42, 0x4d])) {
    return true;
  }

  if (
    startsWith(bytes, [0x49, 0x49, 0x2a, 0x00]) ||
    startsWith(bytes, [0x4d, 0x4d, 0x00, 0x2a])
  ) {
    return true;
  }

  if (
    String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" &&
    ["avif", "heic", "heif", "mif1", "msf1"].includes(
      String.fromCharCode(...bytes.slice(8, 12)).toLowerCase(),
    )
  ) {
    return true;
  }

  return false;
}

export async function verifyPDFMagicBytes(file: File) {
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
}
