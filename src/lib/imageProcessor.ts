import type {
  CompressOptions,
  ConvertOptions,
  FilterOptions,
  ImageFormat,
  ImageInfo,
  MergeOptions,
  ResizeOptions,
  RotateOptions,
  WatermarkOptions,
  WatermarkPosition,
} from "@/lib/types";
import {
  clamp,
  getAspectRatio,
  isCanvasSizeSafe,
  isImageFormat,
} from "@/lib/utils";

interface LoadedImage {
  source: HTMLImageElement;
  width: number;
  height: number;
}

async function loadImage(file: Blob): Promise<LoadedImage> {
  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load this image."));
      image.src = url;
    });

    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function createCanvas(width: number, height: number) {
  if (!isCanvasSizeSafe(width, height)) {
    throw new Error(
      "This image is too large for browser canvas processing. Try a smaller image.",
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ImageFormat,
  quality: number,
  release = true,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          if (release) {
            releaseCanvas(canvas);
          }
          reject(new Error("Could not export the image."));
          return;
        }

        if (release) {
          releaseCanvas(canvas);
        }
        resolve(blob);
      },
      type,
      clamp(quality, 0, 1),
    );
  });
}

async function canvasToTargetSizeBlob(
  canvas: HTMLCanvasElement,
  type: ImageFormat,
  quality: number,
  targetSizeKB?: number,
): Promise<Blob> {
  const maxQuality = clamp(quality, 0.05, 1);

  if (!targetSizeKB || type === "image/png") {
    return canvasToBlob(canvas, type, maxQuality);
  }

  const targetBytes = targetSizeKB * 1024;
  let low = 0.05;
  let high = maxQuality;
  let bestUnderTarget: Blob | null = null;
  let smallest: Blob | null = null;

  try {
    for (let i = 0; i < 8; i += 1) {
      const trialQuality = (low + high) / 2;
      const blob = await canvasToBlob(canvas, type, trialQuality, false);

      if (!smallest || blob.size < smallest.size) {
        smallest = blob;
      }

      if (blob.size <= targetBytes) {
        bestUnderTarget = blob;
        low = trialQuality;
      } else {
        high = trialQuality;
      }
    }

    return bestUnderTarget ?? smallest ?? canvasToBlob(canvas, type, 0.05, false);
  } finally {
    releaseCanvas(canvas);
  }
}

function fillIfNeeded(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fillColor: string,
) {
  if (fillColor && fillColor !== "transparent") {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, width, height);
  }
}

function safeOutputFormat(format: string): ImageFormat {
  return isImageFormat(format) ? format : "image/png";
}

export async function getImageInfo(file: File): Promise<ImageInfo> {
  const image = await loadImage(file);
  let exif: Record<string, unknown> | undefined;

  try {
    const exifr = await import("exifr");
    const parsed = await exifr.parse(file, {
      gps: true,
      translateKeys: true,
      translateValues: true,
    });
    exif = parsed ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    exif = undefined;
  }

  return {
    width: image.width,
    height: image.height,
    fileSize: file.size,
    format: file.type || "image/unknown",
    aspectRatio: getAspectRatio(image.width, image.height),
    megapixels: Number(((image.width * image.height) / 1_000_000).toFixed(2)),
    fileName: file.name,
    lastModified: new Date(file.lastModified),
    exif,
  };
}

export async function resizeImage(
  file: File,
  opts: ResizeOptions,
): Promise<Blob> {
  const image = await loadImage(file);
  const aspect = image.width / image.height;
  let width = opts.width;
  let height = opts.height;

  if (opts.unit === "percent") {
    width = image.width * ((opts.width || 100) / 100);
    height = image.height * ((opts.height || opts.width || 100) / 100);
  }

  if (!width && !height) {
    width = image.width;
    height = image.height;
  } else if (opts.maintainAspectRatio) {
    if (width && !height) {
      height = width / aspect;
    } else if (!width && height) {
      width = height * aspect;
    } else if (width && height) {
      height = width / aspect;
    }
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(
    ctx,
    canvas.width,
    canvas.height,
    opts.outputFormat === "image/jpeg" ? "#ffffff" : "transparent",
  );
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image.source, 0, 0, canvas.width, canvas.height);

  return canvasToTargetSizeBlob(
    canvas,
    opts.outputFormat,
    opts.quality,
    opts.targetSizeKB,
  );
}

export async function compressImage(
  file: File,
  opts: CompressOptions,
): Promise<Blob> {
  const { default: imageCompression } = await import("browser-image-compression");
  const baseOptions = {
    maxWidthOrHeight: opts.maxWidthOrHeight || undefined,
    useWebWorker: true,
    fileType: opts.outputFormat,
    alwaysKeepResolution: !opts.maxWidthOrHeight,
  };

  if (!opts.targetSizeKB) {
    return imageCompression(file, {
      ...baseOptions,
      maxSizeMB: 50,
      initialQuality: clamp(opts.quality, 0.05, 1),
    });
  }

  let best: Blob | null = null;
  let low = 0.05;
  let high = clamp(opts.quality, 0.05, 1);
  const targetBytes = opts.targetSizeKB * 1024;

  for (let i = 0; i < 7; i += 1) {
    const quality = (low + high) / 2;
    const result = await imageCompression(file, {
      ...baseOptions,
      maxSizeMB: Math.max(opts.targetSizeKB / 1024, 0.01),
      initialQuality: quality,
      maxIteration: 8,
    });

    if (result.size <= targetBytes) {
      best = result;
      low = quality;
    } else {
      high = quality;
    }
  }

  return best ?? imageCompression(file, {
    ...baseOptions,
    maxSizeMB: Math.max(opts.targetSizeKB / 1024, 0.01),
    initialQuality: 0.05,
  });
}

export async function convertImage(
  file: Blob,
  opts: ConvertOptions,
): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(
    ctx,
    canvas.width,
    canvas.height,
    opts.outputFormat === "image/jpeg" ? "#ffffff" : "transparent",
  );
  ctx.drawImage(image.source, 0, 0);

  return canvasToBlob(canvas, opts.outputFormat, opts.quality);
}

export function supportsAvifExport() {
  if (typeof document === "undefined") {
    return false;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const supported = canvas.toDataURL("image/avif").startsWith("data:image/avif");
  releaseCanvas(canvas);
  return supported;
}

export async function rotateImage(
  file: File,
  opts: RotateOptions,
): Promise<Blob> {
  const image = await loadImage(file);
  const radians = (opts.degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const width = image.width * cos + image.height * sin;
  const height = image.width * sin + image.height * cos;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(
    ctx,
    canvas.width,
    canvas.height,
    opts.outputFormat === "image/jpeg" ? opts.fillColor || "#ffffff" : opts.fillColor,
  );

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image.source, -image.width / 2, -image.height / 2);

  return canvasToBlob(canvas, opts.outputFormat, opts.quality);
}

function applySharpen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
) {
  if (amount <= 0) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const src = imageData.data;
  const out = new Uint8ClampedArray(src);
  const strength = clamp(amount / 10, 0, 1);
  const kernel = [0, -strength, 0, -strength, 1 + 4 * strength, -strength, 0, -strength, 0];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        let sum = 0;
        let index = 0;

        for (let ky = -1; ky <= 1; ky += 1) {
          for (let kx = -1; kx <= 1; kx += 1) {
            const pixel = ((y + ky) * width + (x + kx)) * 4 + channel;
            sum += src[pixel] * kernel[index];
            index += 1;
          }
        }

        out[(y * width + x) * 4 + channel] = clamp(sum, 0, 255);
      }
    }
  }

  imageData.data.set(out);
  ctx.putImageData(imageData, 0, 0);
}

export async function applyFilters(
  file: File,
  opts: FilterOptions,
): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(
    ctx,
    canvas.width,
    canvas.height,
    opts.outputFormat === "image/jpeg" ? "#ffffff" : "transparent",
  );
  ctx.filter = [
    `brightness(${opts.brightness}%)`,
    `contrast(${opts.contrast}%)`,
    `saturate(${opts.saturation}%)`,
    `hue-rotate(${opts.hue}deg)`,
    `blur(${opts.blur}px)`,
    `sepia(${opts.sepia}%)`,
    `grayscale(${opts.grayscale}%)`,
    `invert(${opts.invert}%)`,
    `opacity(${opts.opacity}%)`,
  ].join(" ");
  ctx.drawImage(image.source, 0, 0);
  ctx.filter = "none";
  applySharpen(ctx, canvas.width, canvas.height, opts.sharpness);

  return canvasToBlob(canvas, opts.outputFormat, opts.quality);
}

function measureWatermarkText(
  ctx: CanvasRenderingContext2D,
  opts: WatermarkOptions,
) {
  const fontSize = opts.fontSize || 48;
  const fontWeight = opts.fontWeight || "bold";
  const fontStyle = opts.fontStyle || "normal";
  const fontFamily = opts.fontFamily || "Arial";
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  const text = opts.text || "FreeConvert";
  const metrics = ctx.measureText(text);

  return {
    text,
    width: metrics.width,
    height: fontSize,
  };
}

function getPosition(
  position: WatermarkPosition,
  canvasWidth: number,
  canvasHeight: number,
  markWidth: number,
  markHeight: number,
  padding: number,
) {
  const xMap = {
    left: padding,
    center: (canvasWidth - markWidth) / 2,
    right: canvasWidth - markWidth - padding,
  };
  const yMap = {
    top: padding,
    middle: (canvasHeight - markHeight) / 2,
    bottom: canvasHeight - markHeight - padding,
  };

  if (position === "center") {
    return { x: xMap.center, y: yMap.middle };
  }

  const [vertical, horizontal] = position.split("-") as [
    "top" | "middle" | "bottom",
    "left" | "center" | "right",
  ];

  return {
    x: xMap[horizontal],
    y: yMap[vertical],
  };
}

export async function addWatermark(
  file: File,
  opts: WatermarkOptions,
): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(
    ctx,
    canvas.width,
    canvas.height,
    opts.outputFormat === "image/jpeg" ? "#ffffff" : "transparent",
  );
  ctx.drawImage(image.source, 0, 0);
  ctx.save();
  ctx.globalAlpha = clamp(opts.opacity, 0, 1);

  const padding = opts.padding ?? 32;
  const rotation = ((opts.rotation || 0) * Math.PI) / 180;

  if (opts.type === "image" && opts.watermarkFile) {
    const watermark = await loadImage(opts.watermarkFile);
    const markWidth = canvas.width * clamp(opts.scale || 0.2, 0.05, 0.6);
    const markHeight = markWidth * (watermark.height / watermark.width);
    const drawAt = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + markWidth / 2, y + markHeight / 2);
      ctx.rotate(rotation);
      ctx.drawImage(
        watermark.source,
        -markWidth / 2,
        -markHeight / 2,
        markWidth,
        markHeight,
      );
      ctx.restore();
    };

    if (opts.position === "tile") {
      const gap = opts.tileGap ?? 80;
      for (let y = -markHeight; y < canvas.height + markHeight; y += markHeight + gap) {
        for (let x = -markWidth; x < canvas.width + markWidth; x += markWidth + gap) {
          drawAt(x, y);
        }
      }
    } else {
      const point = getPosition(
        opts.position,
        canvas.width,
        canvas.height,
        markWidth,
        markHeight,
        padding,
      );
      drawAt(point.x, point.y);
    }
  } else {
    const mark = measureWatermarkText(ctx, opts);
    ctx.fillStyle = opts.fontColor || "#ffffff";
    ctx.textBaseline = "top";
    const drawAt = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + mark.width / 2, y + mark.height / 2);
      ctx.rotate(rotation);
      ctx.fillText(mark.text, -mark.width / 2, -mark.height / 2);
      ctx.restore();
    };

    if (opts.position === "tile") {
      const gap = opts.tileGap ?? 96;
      for (let y = -mark.height; y < canvas.height + mark.height; y += mark.height + gap) {
        for (let x = -mark.width; x < canvas.width + mark.width; x += mark.width + gap) {
          drawAt(x, y);
        }
      }
    } else {
      const point = getPosition(
        opts.position,
        canvas.width,
        canvas.height,
        mark.width,
        mark.height,
        padding,
      );
      drawAt(point.x, point.y);
    }
  }

  ctx.restore();
  return canvasToBlob(canvas, opts.outputFormat, opts.quality);
}

export async function mergeImages(
  files: File[],
  opts: MergeOptions,
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error("Add at least one image.");
  }

  const images = await Promise.all(files.map(loadImage));
  const gap = Math.max(0, opts.gap);
  const columns = Math.max(1, opts.columns || 2);
  const normalized = images.map((image) => ({ ...image }));

  if (opts.resizeToMatch && opts.direction !== "grid") {
    const target =
      opts.direction === "horizontal"
        ? Math.max(...normalized.map((image) => image.height))
        : Math.max(...normalized.map((image) => image.width));

    normalized.forEach((image) => {
      const ratio = image.width / image.height;
      if (opts.direction === "horizontal") {
        image.height = target;
        image.width = target * ratio;
      } else {
        image.width = target;
        image.height = target / ratio;
      }
    });
  }

  let width = 0;
  let height = 0;
  const positions: { x: number; y: number; width: number; height: number }[] = [];

  if (opts.direction === "horizontal") {
    width = normalized.reduce((sum, image) => sum + image.width, 0) + gap * (normalized.length - 1);
    height = Math.max(...normalized.map((image) => image.height));
    let x = 0;
    normalized.forEach((image) => {
      const y =
        opts.align === "start"
          ? 0
          : opts.align === "end"
            ? height - image.height
            : (height - image.height) / 2;
      positions.push({ x, y, width: image.width, height: image.height });
      x += image.width + gap;
    });
  } else if (opts.direction === "vertical") {
    width = Math.max(...normalized.map((image) => image.width));
    height = normalized.reduce((sum, image) => sum + image.height, 0) + gap * (normalized.length - 1);
    let y = 0;
    normalized.forEach((image) => {
      const x =
        opts.align === "start"
          ? 0
          : opts.align === "end"
            ? width - image.width
            : (width - image.width) / 2;
      positions.push({ x, y, width: image.width, height: image.height });
      y += image.height + gap;
    });
  } else {
    const cellWidth = Math.max(...normalized.map((image) => image.width));
    const cellHeight = Math.max(...normalized.map((image) => image.height));
    const rows = Math.ceil(normalized.length / columns);
    width = cellWidth * columns + gap * (columns - 1);
    height = cellHeight * rows + gap * (rows - 1);

    normalized.forEach((image, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * (cellWidth + gap) + (cellWidth - image.width) / 2;
      const y = row * (cellHeight + gap) + (cellHeight - image.height) / 2;
      positions.push({ x, y, width: image.width, height: image.height });
    });
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  fillIfNeeded(ctx, canvas.width, canvas.height, opts.backgroundColor);
  normalized.forEach((image, index) => {
    const position = positions[index];
    ctx.drawImage(
      image.source,
      position.x,
      position.y,
      position.width,
      position.height,
    );
  });

  return canvasToBlob(canvas, opts.outputFormat, opts.quality);
}

export async function removeBackgroundFromImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const mod = await import("@imgly/background-removal");
  return mod.removeBackground(file, {
    model: "isnet_quint8",
    output: { format: "image/png", quality: 1 },
    progress: (_key, current, total) => {
      if (total > 0) {
        onProgress?.(Math.round((current / total) * 100));
      }
    },
  });
}

export async function replaceTransparentBackground(
  blob: Blob,
  fillColor: string,
): Promise<Blob> {
  if (!fillColor || fillColor === "transparent") {
    return blob;
  }

  const image = await loadImage(blob);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image.source, 0, 0);

  return canvasToBlob(canvas, "image/png", 1);
}

export async function getImagePalette(file: File, colorCount = 6) {
  const image = await loadImage(file);
  const size = 64;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  ctx.drawImage(image.source, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  releaseCanvas(canvas);
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 128) {
      continue;
    }

    const r = Math.round(data[index] / 32) * 32;
    const g = Math.round(data[index + 1] / 32) * 32;
    const b = Math.round(data[index + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    bucket.count += 1;
    bucket.r += data[index];
    bucket.g += data[index + 1];
    bucket.b += data[index + 2];
    buckets.set(key, bucket);
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount)
    .map((bucket) => {
      const r = Math.round(bucket.r / bucket.count);
      const g = Math.round(bucket.g / bucket.count);
      const b = Math.round(bucket.b / bucket.count);
      return `#${[r, g, b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")}`;
    });
}

export function normalizeExportFormat(fileType: string): ImageFormat {
  return safeOutputFormat(fileType);
}
