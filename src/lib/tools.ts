import type { Metadata } from "next";
import type { PDFToolSlug, ToolDefaults, ToolSlug } from "@/lib/types";
import {
  mimeFromShortFormat,
} from "@/lib/utils";
import {
  safeBoolean,
  safeColor,
  safeEnum,
  safeNumber,
  safeString,
} from "@/lib/sanitize";
import { getImageToolFaqs, getPdfToolFaqs } from "@/lib/toolFaqs";

export const BASE_URL = "https://freeconvert.in";

export interface ToolConfig {
  slug: ToolSlug;
  name: string;
  shortName: string;
  title: string;
  description: string;
  homeDescription: string;
  href: string;
  priority: number;
  keywords: string[];
  features: string[];
}

export interface PDFToolConfig {
  slug: PDFToolSlug;
  name: string;
  shortName: string;
  title: string;
  description: string;
  homeDescription: string;
  href: string;
  priority: number;
  keywords: string[];
  features: string[];
  popular?: boolean;
}

export const toolConfigs: Record<ToolSlug, ToolConfig> = {
  resize: {
    slug: "resize",
    name: "Resize Image",
    shortName: "Resize",
    title: "Resize Image Online Free - freeconvert.in",
    description:
      "Set exact width and height in px, cm or percent. Includes exam photo presets and target KB export. Runs in your browser.",
    homeDescription: "Set exact dimensions, cm, px or percent",
    href: "/resize-image",
    priority: 0.9,
    keywords: [
      "resize image online free",
      "image resizer",
      "photo resize online free india",
      "resize jpg png webp free",
    ],
    features: [
      "Resize by pixel, cm or percentage",
      "Government exam photo presets",
      "Optional target size",
      "Export JPEG, PNG, WebP or AVIF",
      "Files stay on your device",
    ],
  },
  compress: {
    slug: "compress",
    name: "Compress Image",
    shortName: "Compress",
    title: "Compress Image Online Free - Reduce File Size",
    description:
      "Reduce image file size without uploading. JPEG, PNG and WebP compression runs locally in your browser.",
    homeDescription: "Reduce file size, keep quality",
    href: "/compress-image",
    priority: 0.9,
    keywords: [
      "compress image online free",
      "image size reducer online india",
      "jpg compressor",
      "webp compressor",
    ],
    features: [
      "Quality slider",
      "Optional target size",
      "Optional max width or height",
      "Web Worker compression",
    ],
  },
  convert: {
    slug: "convert",
    name: "Convert Image",
    shortName: "Convert",
    title: "Convert Image Format Free - JPEG PNG WebP AVIF",
    description:
      "Convert JPEG, PNG, WebP and AVIF images instantly in your browser. No signup and no upload.",
    homeDescription: "JPEG, PNG, WebP, AVIF",
    href: "/convert-image",
    priority: 0.9,
    keywords: [
      "convert image format free",
      "jpeg to png converter",
      "png to webp converter",
      "image converter online",
    ],
    features: [
      "JPEG, PNG, WebP and AVIF output",
      "Quality control",
      "Transparent PNG support",
      "Client-side export",
    ],
  },
  crop: {
    slug: "crop",
    name: "Crop Image",
    shortName: "Crop",
    title: "Crop Image Online Free - Any Size or Ratio",
    description:
      "Crop images to freeform selections or fixed aspect ratios. Everything runs in the browser.",
    homeDescription: "Crop to any size or ratio",
    href: "/crop-image",
    priority: 0.8,
    keywords: [
      "crop image online free",
      "photo cropper",
      "crop image ratio",
      "crop jpg png webp",
    ],
    features: [
      "Freeform crop",
      "Common aspect ratios",
      "Precise output dimensions",
      "No upload required",
    ],
  },
  "rotate-flip": {
    slug: "rotate-flip",
    name: "Rotate & Flip Image",
    shortName: "Rotate",
    title: "Rotate & Flip Image Online Free",
    description:
      "Rotate images by 90, 180, 270 degrees or a custom angle. Flip horizontal or vertical for free.",
    homeDescription: "Rotate, mirror, straighten",
    href: "/rotate-image",
    priority: 0.8,
    keywords: [
      "rotate image online",
      "flip image online",
      "mirror image free",
      "straighten photo online",
    ],
    features: [
      "90 degree quick actions",
      "Custom angle slider",
      "Horizontal and vertical flip",
      "Fill color for angled rotations",
    ],
  },
  "background-removal": {
    slug: "background-removal",
    name: "Remove Background",
    shortName: "Remove BG",
    title: "Remove Background from Image Free - AI Powered",
    description:
      "Remove image backgrounds with AI directly in your browser. Your image is not uploaded.",
    homeDescription: "AI background removal in browser",
    href: "/remove-background",
    priority: 0.9,
    keywords: [
      "remove background from image free",
      "background remove free india",
      "ai background remover",
      "transparent background image",
    ],
    features: [
      "Browser-based AI model",
      "Transparent PNG output",
      "Progress indicator",
      "No server upload",
    ],
  },
  watermark: {
    slug: "watermark",
    name: "Add Watermark",
    shortName: "Watermark",
    title: "Add Watermark to Image Free - Text or Logo",
    description:
      "Add a text or image watermark with custom position, opacity, rotation and tiling.",
    homeDescription: "Text or image watermark",
    href: "/add-watermark-to-image",
    priority: 0.8,
    keywords: [
      "add watermark to image free",
      "photo watermark online",
      "text watermark image",
      "logo watermark image",
    ],
    features: [
      "Text and logo watermark",
      "Nine position controls",
      "Opacity and rotation",
      "Tile watermark mode",
    ],
  },
  merge: {
    slug: "merge",
    name: "Merge Images",
    shortName: "Merge",
    title: "Merge Images Online Free - Combine Photos",
    description:
      "Combine multiple images side by side, vertically or in a grid. Runs locally with no upload.",
    homeDescription: "Combine multiple images",
    href: "/merge-images",
    priority: 0.8,
    keywords: [
      "merge images online",
      "combine photos online",
      "join images side by side",
      "image grid maker",
    ],
    features: [
      "Horizontal, vertical and grid layout",
      "Gap and background controls",
      "Alignment controls",
      "Single combined download",
    ],
  },
  filters: {
    slug: "filters",
    name: "Image Filters",
    shortName: "Filters",
    title: "Image Filters & Adjustments Free Online",
    description:
      "Adjust brightness, contrast, saturation and apply presets to images in your browser.",
    homeDescription: "Adjust and enhance photos",
    href: "/image-filters",
    priority: 0.7,
    keywords: [
      "image filters online",
      "photo adjustments online",
      "brightness contrast saturation image",
      "free image editor online",
    ],
    features: [
      "Brightness, contrast and saturation",
      "Hue, blur and grayscale",
      "Preset looks",
      "Canvas export",
    ],
  },
  metadata: {
    slug: "metadata",
    name: "Image Metadata",
    shortName: "Metadata",
    title: "View Image Metadata & EXIF Data Free",
    description:
      "View EXIF data, camera details, image dimensions and dominant color palette. Strip metadata locally.",
    homeDescription: "View EXIF, strip metadata, palette",
    href: "/image-metadata",
    priority: 0.7,
    keywords: [
      "image metadata viewer",
      "exif data viewer online",
      "strip image metadata",
      "image color palette",
    ],
    features: [
      "EXIF viewer",
      "Dominant color palette",
      "Copy metadata as JSON",
      "Strip metadata by re-exporting",
    ],
  },
};

export const tools = Object.values(toolConfigs);

export const pdfToolConfigs: Record<PDFToolSlug, PDFToolConfig> = {
  "merge-pdf": {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortName: "Merge PDF",
    title: "Merge PDF Online Free - Combine PDF Files",
    description:
      "Combine multiple PDF files into one document directly in your browser. No upload, no signup and no watermark.",
    homeDescription: "Combine PDF files in order",
    href: "/merge-pdf",
    priority: 0.95,
    popular: true,
    keywords: [
      "merge pdf online free",
      "combine pdf files",
      "join pdf free",
      "pdf merge free india",
    ],
    features: [
      "Merge multiple PDFs",
      "Reorder files before export",
      "Optional blank pages",
      "Runs in your browser",
    ],
  },
  "compress-pdf": {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortName: "Compress PDF",
    title: "Compress PDF Online Free - Reduce PDF Size",
    description:
      "Reduce PDF file size in your browser by rebuilding pages at a lower resolution, with an optional target KB size.",
    homeDescription: "Reduce PDF size to target KB",
    href: "/compress-pdf",
    priority: 0.95,
    popular: true,
    keywords: [
      "compress pdf online free",
      "reduce pdf size",
      "pdf ka size kam kaise kare",
      "pdf compress kaise kare",
    ],
    features: [
      "Low, balanced and high quality modes",
      "Optional target KB size",
      "Custom DPI and image quality",
      "Per-page progress",
      "Private browser processing",
    ],
  },
  "split-pdf": {
    slug: "split-pdf",
    name: "Split PDF",
    shortName: "Split PDF",
    title: "Split PDF Online Free - Extract PDF Parts",
    description:
      "Split a PDF into individual pages, fixed page ranges or custom page ranges. Download the results as a ZIP.",
    homeDescription: "Break PDFs into parts",
    href: "/split-pdf",
    priority: 0.9,
    keywords: [
      "split pdf online free",
      "separate pdf pages",
      "pdf splitter",
      "extract pdf ranges",
    ],
    features: [
      "Split every page",
      "Split by fixed ranges",
      "Custom range input",
      "ZIP download",
    ],
  },
  "convert-pdf-to-image": {
    slug: "convert-pdf-to-image",
    name: "Convert PDF to Image",
    shortName: "PDF to Image",
    title: "PDF to JPG PNG Converter Online Free",
    description:
      "Convert PDF pages to JPG, PNG or WebP images locally in your browser with page selection and DPI control.",
    homeDescription: "Export PDF pages as images",
    href: "/convert-pdf-to-image",
    priority: 0.92,
    popular: true,
    keywords: [
      "pdf to jpg online free",
      "pdf to png converter",
      "pdf to image converter free",
      "pdf pages to jpg",
    ],
    features: [
      "JPG, PNG and WebP output",
      "Page selection",
      "DPI and scale controls",
      "ZIP for multiple pages",
    ],
  },
  "convert-image-to-pdf": {
    slug: "convert-image-to-pdf",
    name: "Convert Image to PDF",
    shortName: "Image to PDF",
    title: "Image to PDF Online Free - JPG PNG to PDF",
    description:
      "Convert JPG, PNG, WebP and AVIF images into a PDF with page size, margin and fit controls.",
    homeDescription: "Turn images into a PDF",
    href: "/convert-image-to-pdf",
    priority: 0.9,
    keywords: [
      "jpg to pdf online free",
      "image to pdf banana",
      "png to pdf converter",
      "images to pdf online",
    ],
    features: [
      "Multiple images",
      "A4, Letter and match image sizes",
      "Margin and fit controls",
      "Metadata fields",
    ],
  },
  "rotate-pdf": {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortName: "Rotate PDF",
    title: "Rotate PDF Online Free",
    description:
      "Rotate all PDF pages or selected pages by 90, 180 or 270 degrees directly in your browser.",
    homeDescription: "Rotate selected pages",
    href: "/rotate-pdf",
    priority: 0.82,
    keywords: [
      "rotate pdf online",
      "rotate pdf pages",
      "pdf rotate free",
      "turn pdf pages",
    ],
    features: [
      "Rotate selected pages",
      "90, 180 and 270 degree actions",
      "Thumbnail selection",
      "No upload required",
    ],
  },
  "add-watermark-to-pdf": {
    slug: "add-watermark-to-pdf",
    name: "Add Watermark to PDF",
    shortName: "Watermark PDF",
    title: "Add Watermark to PDF Online Free",
    description:
      "Add a text or image watermark to selected PDF pages with position, opacity and rotation controls.",
    homeDescription: "Text or logo watermark",
    href: "/add-watermark-to-pdf",
    priority: 0.8,
    keywords: [
      "pdf watermark online free",
      "add watermark to pdf",
      "pdf me watermark kaise lagaye",
      "confidential watermark pdf",
    ],
    features: [
      "Text and image watermarks",
      "Page range controls",
      "Opacity and rotation",
      "Nine positions",
    ],
  },
  "protect-pdf": {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortName: "Protect PDF",
    title: "Protect PDF Online - Add Password",
    description:
      "Add an open password and permissions to a PDF in your browser with qpdf WebAssembly encryption.",
    homeDescription: "Add a PDF password",
    href: "/protect-pdf",
    priority: 0.7,
    keywords: [
      "protect pdf with password",
      "password protect pdf",
      "encrypt pdf online",
      "secure pdf",
    ],
    features: [
      "Open password",
      "Printing, copying and editing permissions",
      "128-bit or 256-bit encryption",
      "Private browser processing",
    ],
  },
  "unlock-pdf": {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortName: "Unlock PDF",
    title: "Unlock PDF Online - Remove Known Password",
    description:
      "Remove PDF password protection in your browser when you know the current password. This tool does not crack or bypass security.",
    homeDescription: "Remove a known PDF password",
    href: "/unlock-pdf",
    priority: 0.7,
    keywords: [
      "remove pdf password online",
      "unlock pdf",
      "pdf password remove",
      "decrypt pdf with password",
    ],
    features: [
      "Encrypted PDF detection",
      "Password input",
      "Decrypt with known password",
      "Clear legal notice",
    ],
  },
  "extract-pdf-pages": {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    shortName: "Extract Pages",
    title: "Extract Pages from PDF Online Free",
    description:
      "Select specific pages visually or with a page range and export them as one PDF or separate PDF files.",
    homeDescription: "Pull selected pages out",
    href: "/extract-pdf-pages",
    priority: 0.84,
    keywords: [
      "extract pages from pdf",
      "extract pdf pages online",
      "save selected pdf pages",
      "pdf page extractor",
    ],
    features: [
      "Visual page selection",
      "Page range input",
      "Single PDF or separate PDFs",
      "ZIP download",
    ],
  },
  "reorder-pdf-pages": {
    slug: "reorder-pdf-pages",
    name: "Reorder PDF Pages",
    shortName: "Reorder Pages",
    title: "Reorder PDF Pages Online Free",
    description:
      "Move PDF pages into a new order, reverse all pages or reset back to the original page order before download.",
    homeDescription: "Change page order",
    href: "/reorder-pdf-pages",
    priority: 0.76,
    keywords: [
      "reorder pdf pages online",
      "organize pdf pages",
      "move pdf pages",
      "reverse pdf pages",
    ],
    features: [
      "Page thumbnails",
      "Move pages up or down",
      "Reverse order",
      "Reset order",
    ],
  },
  "add-page-numbers-to-pdf": {
    slug: "add-page-numbers-to-pdf",
    name: "Add Page Numbers to PDF",
    shortName: "Page Numbers",
    title: "Add Page Numbers to PDF Online Free",
    description:
      "Add page numbers to a PDF with position, start number, prefix, suffix, font and margin controls.",
    homeDescription: "Number PDF pages",
    href: "/add-page-numbers-to-pdf",
    priority: 0.78,
    keywords: [
      "add page numbers to pdf",
      "number pdf pages",
      "pdf page numbering",
      "add footer page number pdf",
    ],
    features: [
      "Six number positions",
      "Custom number formats",
      "Skip first page",
      "Font and color controls",
    ],
  },
  "view-pdf-metadata": {
    slug: "view-pdf-metadata",
    name: "View PDF Metadata",
    shortName: "PDF Metadata",
    title: "PDF Metadata Viewer Online Free",
    description:
      "View PDF document metadata, page sizes, version, encryption status and strip or edit metadata locally.",
    homeDescription: "View and clean PDF info",
    href: "/view-pdf-metadata",
    priority: 0.72,
    keywords: [
      "pdf metadata viewer",
      "view pdf properties",
      "strip pdf metadata",
      "pdf info online",
    ],
    features: [
      "Document info table",
      "Page size details",
      "Copy JSON",
      "Edit or strip metadata",
    ],
  },
};

export const pdfTools = Object.values(pdfToolConfigs);
export const allToolConfigs = [...tools, ...pdfTools];

export function buildToolMetadata(slug: ToolSlug): Metadata {
  const tool = toolConfigs[slug];
  const url = `${BASE_URL}${tool.href}`;

  return {
    title: tool.title,
    description: `${tool.description} Free, private and client-side on freeconvert.in.`,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | FreeConvert.in`,
      description: tool.description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | FreeConvert.in`,
      description: tool.description,
      images: ["/opengraph-image"],
    },
  };
}

export function buildPDFToolMetadata(slug: PDFToolSlug): Metadata {
  const tool = pdfToolConfigs[slug];
  const url = `${BASE_URL}${tool.href}`;

  return {
    title: tool.title,
    description: `${tool.description} Free, private and client-side on freeconvert.in.`,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | FreeConvert.in`,
      description: tool.description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | FreeConvert.in`,
      description: tool.description,
      images: ["/opengraph-image"],
    },
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

export function getToolDefaults(slug: ToolSlug, params: SearchParams) {
  const q = safeNumber(params.q, slug === "compress" ? 75 : 90, 1, 100);
  const format = mimeFromShortFormat(
    safeEnum(params.format, ["jpeg", "jpg", "png", "webp", "avif"], "jpeg"),
  );
  const to = mimeFromShortFormat(
    safeEnum(params.to, ["jpeg", "jpg", "png", "webp", "avif"], "jpeg"),
  );

  const defaults: Record<ToolSlug, ToolDefaults> = {
    resize: {
      width: safeNumber(params.w, 0, 0, 16000),
      height: safeNumber(params.h, 0, 0, 16000),
      unit: (() => {
        const unit = safeEnum(params.unit, ["px", "%", "percent", "cm"], "px");
        return unit === "%" ? "percent" : unit;
      })(),
      dpi: safeNumber(params.dpi, 300, 1, 1200),
      maintainAspectRatio: safeBoolean(params.ar, false),
      outputFormat: format,
      quality: q,
      targetSizeKB: safeNumber(params.target, 0, 0, 51200),
    },
    compress: {
      quality: q,
      outputFormat: format,
      targetSizeKB: safeNumber(params.target, 0, 0, 51200),
      maxWidthOrHeight: safeNumber(params.maxwh, 0, 0, 16000),
    },
    convert: {
      outputFormat: to,
      quality: q,
    },
    crop: {
      ratio: safeEnum(
        params.ratio,
        ["free", "1:1", "4:3", "16:9", "3:4", "9:16"],
        "free",
      ),
      outputFormat: format,
      quality: q,
    },
    "rotate-flip": {
      degrees: safeNumber(params.deg, 0, -180, 180),
      flipH: safeBoolean(params.fliph, false),
      flipV: safeBoolean(params.flipv, false),
      fillColor: safeColor(params.fill, "transparent"),
      outputFormat: format,
      quality: q,
    },
    "background-removal": {
      replacementColor: safeColor(params.bg, "transparent"),
    },
    watermark: {
      type: safeEnum(params.type, ["text", "image"], "text"),
      position: safeEnum(
        params.pos,
        [
          "top-left",
          "top-center",
          "top-right",
          "middle-left",
          "center",
          "middle-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
          "tile",
        ],
        "bottom-right",
      ),
      opacity: safeNumber(params.opacity, 50, 0, 100),
      text: safeString(params.text, "FreeConvert", 80),
      tile: safeBoolean(params.tile, false),
      outputFormat: format,
      quality: q,
    },
    merge: {
      direction: safeEnum(
        params.dir,
        ["horizontal", "vertical", "grid"],
        "horizontal",
      ),
      gap: safeNumber(params.gap, 0, 0, 100),
      backgroundColor: safeColor(params.bg, "#ffffff"),
      columns: safeNumber(params.cols, 2, 1, 8),
      align: safeEnum(params.align, ["start", "center", "end"], "center"),
      outputFormat: format,
      quality: q,
    },
    filters: {
      preset: safeString(params.preset, "", 30),
      brightness: safeNumber(params.br, 100, 0, 200),
      contrast: safeNumber(params.co, 100, 0, 200),
      saturation: safeNumber(params.sa, 100, 0, 200),
      hue: safeNumber(params.hu, 0, -180, 180),
      blur: safeNumber(params.bl, 0, 0, 20),
      sepia: safeNumber(params.sep, 0, 0, 100),
      grayscale: safeNumber(params.gr, 0, 0, 100),
      invert: safeNumber(params.inv, 0, 0, 100),
      opacity: safeNumber(params.op, 100, 0, 100),
      outputFormat: format,
      quality: q,
    },
    metadata: {},
  };

  return defaults[slug];
}

export function getPDFToolDefaults(slug: PDFToolSlug, params: SearchParams) {
  const defaults: Record<PDFToolSlug, ToolDefaults> = {
    "merge-pdf": {},
    "compress-pdf": {
      quality: safeEnum(
        params.quality,
        ["low", "medium", "high", "custom"],
        "medium",
      ),
      dpi: safeNumber(params.dpi, 96, 72, 300),
      imageQuality: safeNumber(params.imgq, 60, 10, 100),
      targetSizeKB: safeNumber(params.target, 0, 0, 512000),
    },
    "split-pdf": {
      mode: safeEnum(
        params.mode,
        ["every-page", "fixed-range", "custom-ranges"],
        "every-page",
      ),
      fixedRange: safeNumber(params.n, 1, 1, 999),
    },
    "convert-pdf-to-image": {
      format: safeEnum(params.format, ["jpeg", "png", "webp"], "jpeg"),
      dpi: safeNumber(params.dpi, 150, 72, 600),
      quality: safeNumber(params.q, 90, 10, 100),
    },
    "convert-image-to-pdf": {
      pageSize: safeEnum(
        params.size,
        ["A4", "A3", "A5", "Letter", "Legal", "Tabloid", "Match Image"],
        "A4",
      ),
      orientation: safeEnum(
        params.orientation,
        ["portrait", "landscape", "auto"],
        "portrait",
      ),
      margin: safeNumber(params.margin, 10, 0, 50),
      fit: safeEnum(
        params.fit,
        ["contain", "cover", "fill", "actual-size"],
        "contain",
      ),
    },
    "rotate-pdf": {
      degrees: safeNumber(params.deg, 90, 90, 270),
    },
    "add-watermark-to-pdf": {
      type: safeEnum(params.type, ["text", "image"], "text"),
      position: safeEnum(
        params.pos,
        [
          "top-left",
          "top-center",
          "top-right",
          "middle-left",
          "center",
          "middle-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ],
        "center",
      ),
      opacity: safeNumber(params.opacity, 30, 0, 100),
    },
    "protect-pdf": {},
    "unlock-pdf": {},
    "extract-pdf-pages": {},
    "reorder-pdf-pages": {},
    "add-page-numbers-to-pdf": {
      position: safeEnum(
        params.pos,
        [
          "top-left",
          "top-center",
          "top-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ],
        "bottom-center",
      ),
      start: safeNumber(params.start, 1, 0, 9999),
    },
    "view-pdf-metadata": {},
  };

  return defaults[slug];
}

export function toolJsonLd(slug: ToolSlug) {
  const tool = toolConfigs[slug];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} - FreeConvert`,
    url: `${BASE_URL}${tool.href}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: tool.description,
    featureList: tool.features,
  };
}

export function pdfToolJsonLd(slug: PDFToolSlug) {
  const tool = pdfToolConfigs[slug];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} - FreeConvert`,
    url: `${BASE_URL}${tool.href}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: tool.description,
    featureList: tool.features,
  };
}

function faqItemsToJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function pdfToolFaqJsonLd(slug: PDFToolSlug) {
  return faqItemsToJsonLd(getPdfToolFaqs(slug));
}

export function toolFaqJsonLd(slug: ToolSlug) {
  return faqItemsToJsonLd(getImageToolFaqs(slug));
}
