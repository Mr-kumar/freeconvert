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
export type ResizeUnit = "px" | "percent" | "cm";
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

export type PDFToolSlug =
  | "merge-pdf"
  | "compress-pdf"
  | "split-pdf"
  | "convert-pdf-to-image"
  | "convert-image-to-pdf"
  | "rotate-pdf"
  | "add-watermark-to-pdf"
  | "protect-pdf"
  | "unlock-pdf"
  | "extract-pdf-pages"
  | "reorder-pdf-pages"
  | "add-page-numbers-to-pdf"
  | "view-pdf-metadata";

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
  dpi?: number;
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

export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  orientation: "portrait" | "landscape";
  sizeName?: string;
}

export interface PDFInfo {
  fileName: string;
  fileSize: number;
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  isEncrypted: boolean;
  isLinearized?: boolean;
  pdfVersion?: string;
  pages: PDFPageInfo[];
}

export type PDFPageSize =
  | "A4"
  | "A3"
  | "A5"
  | "Letter"
  | "Legal"
  | "Tabloid"
  | "Match Image"
  | "Custom";

export type PDFOrientation = "portrait" | "landscape" | "auto";

export type PDFPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface MergePDFOptions {
  files: File[];
  outputName: string;
  addBlankPageBetween?: boolean;
}

export interface CompressPDFOptions {
  quality: "low" | "medium" | "high" | "custom";
  customQuality?: number;
  imageQuality: number;
  downsampleImages: boolean;
  targetDPI: 72 | 96 | 150 | 300;
  targetSizeKB?: number;
}

export interface SplitPDFOptions {
  mode: "every-page" | "fixed-range" | "custom-ranges";
  fixedRange?: number;
  customRanges?: string;
  outputNamePattern: string;
}

export interface PDFToImageOptions {
  format: "jpeg" | "png" | "webp";
  quality: number;
  dpi: 72 | 96 | 150 | 300 | 600;
  pages: "all" | number[];
  scale: number;
  outputNamePattern: string;
}

export interface ImageToPDFOptions {
  pageSize: PDFPageSize;
  orientation: PDFOrientation;
  customWidth?: number;
  customHeight?: number;
  margin: number;
  imageFit: "contain" | "cover" | "fill" | "actual-size";
  imageAlign: PDFPosition;
  backgroundColor: string;
  oneImagePerPage: boolean;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

export interface RotatePDFOptions {
  pages: "all" | number[];
  degrees: 90 | 180 | 270;
}

export interface WatermarkPDFOptions {
  type: "text" | "image";
  text?: string;
  fontSize?: number;
  fontFamily?: "Helvetica" | "Times-Roman" | "Courier";
  fontColor?: string;
  watermarkFile?: File;
  imageScale?: number;
  pages: "all" | number[];
  position: PDFPosition;
  customXPercent?: number;
  customYPercent?: number;
  opacity: number;
  rotation: number;
  layer: "above" | "below";
}

export interface ProtectPDFOptions {
  userPassword: string;
  ownerPassword?: string;
  allowPrinting: boolean;
  allowCopying: boolean;
  allowEditing: boolean;
  encryptionLevel: 128 | 256;
}

export interface PageNumberOptions {
  pages: "all" | number[];
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  startFrom: number;
  prefix: string;
  suffix: string;
  fontSize: number;
  fontColor: string;
  fontFamily: "Helvetica" | "Times-Roman" | "Courier";
  margin: number;
  skipFirstPage: boolean;
}

export interface ExtractPagesOptions {
  pages: number[];
  outputNamePattern: string;
  asSingleFile: boolean;
}
