import type { Metadata } from "next";
import type { ToolDefaults, ToolSlug } from "@/lib/types";
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

export const BASE_URL = "https://freeconvert.in";

export interface ToolConfig {
  slug: ToolSlug;
  name: string;
  shortName: string;
  title: string;
  description: string;
  homeDescription: string;
  href:
    | "/resize-image"
    | "/compress-image"
    | "/convert-image"
    | "/crop-image"
    | "/rotate-image"
    | "/remove-background"
    | "/add-watermark-to-image"
    | "/merge-images"
    | "/image-filters"
    | "/image-metadata";
  priority: number;
  keywords: string[];
  features: string[];
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

export function toolFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is FreeConvert free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. FreeConvert is free to use with no account required.",
        },
      },
      {
        "@type": "Question",
        name: "Are my images uploaded?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Image processing happens in your browser and your files stay on your device.",
        },
      },
      {
        "@type": "Question",
        name: "Which image formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FreeConvert supports common browser image formats including JPEG, PNG, WebP and AVIF for most tools.",
        },
      },
    ],
  };
}
