export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

export type FlipDirection = "horizontal" | "vertical";

export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "tile";

export type MergeDirection = "horizontal" | "vertical" | "grid";
export type ResizeUnit = "px" | "percent";
export type ToolSlug =
  | "resize"
  | "compress"
  | "convert"
  | "crop"
  | "rotate-flip"
  | "background-removal"
  | "watermark"
  | "merge"
  | "filters"
  | "metadata";

export interface ImageInfo {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  aspectRatio: string;
  megapixels: number;
  fileName: string;
  lastModified: Date;
  exif?: Record<string, unknown>;
}

export interface SerializableImageInfo extends Omit<ImageInfo, "lastModified"> {
  lastModified: string;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  unit: ResizeUnit;
  quality: number;
  outputFormat: ImageFormat;
  targetSizeKB?: number;
}

export interface CompressOptions {
  quality: number;
  maxWidthOrHeight?: number;
  outputFormat: ImageFormat;
  targetSizeKB?: number;
}

export interface ConvertOptions {
  outputFormat: ImageFormat;
  quality: number;
}

export interface RotateOptions {
  degrees: number;
  flipH: boolean;
  flipV: boolean;
  fillColor: string;
  outputFormat: ImageFormat;
  quality: number;
}

export interface FilterOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: number;
  opacity: number;
  sharpness: number;
  outputFormat: ImageFormat;
  quality: number;
}

export interface WatermarkOptions {
  type: "text" | "image";
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  watermarkFile?: File;
  scale?: number;
  position: WatermarkPosition;
  opacity: number;
  rotation?: number;
  padding?: number;
  tileGap?: number;
  outputFormat: ImageFormat;
  quality: number;
}

export interface MergeOptions {
  direction: MergeDirection;
  gap: number;
  backgroundColor: string;
  columns?: number;
  align: "start" | "center" | "end";
  resizeToMatch: boolean;
  outputFormat: ImageFormat;
  quality: number;
}

export interface CropOptions {
  outputFormat: ImageFormat;
  quality: number;
}

export interface CropResult {
  blob: Blob;
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ToolDefaults = Record<
  string,
  string | number | boolean | undefined
>;
