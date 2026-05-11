import { describe, expect, it } from "vitest";
import {
  validateImageFile,
  validatePDFFile,
  verifyMagicBytes,
  verifyPDFMagicBytes,
} from "./validateFile";

function fileFromBytes(bytes: number[], name: string, type: string) {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("validateImageFile", () => {
  it("accepts supported image types and rejects invalid names", () => {
    expect(validateImageFile(new File(["x"], "photo.png", { type: "image/png" }))).toEqual({
      valid: true,
    });
    expect(validateImageFile(new File(["x"], "bad/name.png", { type: "image/png" }))).toEqual({
      valid: false,
      error: "File name contains invalid characters.",
    });
  });

  it("rejects unsupported image types without an allowed extension", () => {
    expect(validateImageFile(new File(["x"], "file.txt", { type: "text/plain" })).valid).toBe(
      false,
    );
  });
});

describe("validatePDFFile", () => {
  it("accepts PDFs by MIME or extension", () => {
    expect(validatePDFFile(new File(["x"], "doc.pdf", { type: "application/pdf" }))).toEqual({
      valid: true,
    });
    expect(validatePDFFile(new File(["x"], "doc.pdf", { type: "" }))).toEqual({
      valid: true,
    });
  });

  it("rejects non-PDF inputs", () => {
    expect(validatePDFFile(new File(["x"], "doc.txt", { type: "text/plain" })).valid).toBe(
      false,
    );
  });
});

describe("magic byte verification", () => {
  it("recognizes supported image signatures", async () => {
    await expect(
      verifyMagicBytes(fileFromBytes([0xff, 0xd8, 0xff, 0x00], "photo.jpg", "image/jpeg")),
    ).resolves.toBe(true);
    await expect(
      verifyMagicBytes(fileFromBytes([0x89, 0x50, 0x4e, 0x47], "photo.png", "image/png")),
    ).resolves.toBe(true);
  });

  it("rejects unknown image signatures", async () => {
    await expect(
      verifyMagicBytes(fileFromBytes([0x00, 0x01, 0x02, 0x03], "photo.png", "image/png")),
    ).resolves.toBe(false);
  });

  it("recognizes PDF headers", async () => {
    await expect(
      verifyPDFMagicBytes(fileFromBytes([0x25, 0x50, 0x44, 0x46, 0x2d], "doc.pdf", "application/pdf")),
    ).resolves.toBe(true);
    await expect(
      verifyPDFMagicBytes(fileFromBytes([0x50, 0x44, 0x46, 0x2d], "doc.pdf", "application/pdf")),
    ).resolves.toBe(false);
  });
});
