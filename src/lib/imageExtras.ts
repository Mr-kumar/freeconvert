import type { ImageFormat } from "@/lib/types";
import { clamp, getExtensionFromMime, isCanvasSizeSafe } from "@/lib/utils";

export interface CanvasImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export async function loadImageForCanvas(file: Blob): Promise<CanvasImage> {
  const { convertImage } = await import("@/lib/imageProcessor");
  const normalized = await convertImage(file, {
    outputFormat: "image/png",
    quality: 0.92,
  });
  const url = URL.createObjectURL(normalized);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read this image."));
      img.src = url;
    });

    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function createSafeCanvas(width: number, height: number) {
  if (!isCanvasSizeSafe(width, height)) {
    throw new Error("This output is too large for browser canvas processing.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export async function canvasToImageBlob(
  canvas: HTMLCanvasElement,
  outputFormat: ImageFormat,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not export the image."));
          return;
        }
        resolve(blob);
      },
      outputFormat,
      clamp(quality, 0.05, 1),
    );
  });
}

export function imageOutputName(fileName: string | undefined, format: ImageFormat) {
  const base = (fileName || "freeconvert-output").replace(/\.[^/.]+$/, "");
  return `${base || "freeconvert-output"}.${getExtensionFromMime(format)}`;
}

export function sanitizeSvg(svg: string) {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s(href|xlink:href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
}

export function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function createIcoFromPngs(images: { size: number; bytes: Uint8Array }[]) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + images.length * entrySize;
  const totalSize =
    directorySize + images.reduce((sum, image) => sum + image.bytes.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const output = new Uint8Array(buffer);
  let imageOffset = directorySize;

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  images.forEach((image, index) => {
    const offset = headerSize + index * entrySize;
    const sizeByte = image.size >= 256 ? 0 : image.size;
    view.setUint8(offset, sizeByte);
    view.setUint8(offset + 1, sizeByte);
    view.setUint8(offset + 2, 0);
    view.setUint8(offset + 3, 0);
    view.setUint16(offset + 4, 1, true);
    view.setUint16(offset + 6, 32, true);
    view.setUint32(offset + 8, image.bytes.length, true);
    view.setUint32(offset + 12, imageOffset, true);
    output.set(image.bytes, imageOffset);
    imageOffset += image.bytes.length;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}
