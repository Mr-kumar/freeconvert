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
  popular?: boolean;
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
    title: "Resize Image Online Free - Pixel, CM & Target KB",
    description:
      "Resize images online free by pixels, centimeters or percent with exam photo presets and target KB export. Files stay in your browser.",
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
    title: "Compress Image Online Free - Reduce JPG PNG WebP Size",
    description:
      "Compress JPG, PNG and WebP images online free with quality and target KB controls. No upload, no signup.",
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
    title: "Convert Image Online Free - JPG PNG WebP AVIF",
    description:
      "Convert images online free between JPG, PNG, WebP and AVIF in your browser. No upload, no signup.",
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
  "webp-to-jpg": {
    slug: "webp-to-jpg",
    name: "WebP to JPG",
    shortName: "WebP to JPG",
    title: "WebP to JPG Converter Online Free",
    description:
      "Convert WebP to JPG online free in your browser with quality control. No upload, no signup and no watermark.",
    homeDescription: "Convert WebP images to JPG",
    href: "/webp-to-jpg",
    priority: 0.92,
    popular: true,
    keywords: ["webp to jpg", "convert webp to jpg", "webp to jpeg", "webp converter"],
    features: ["WebP input", "JPG output preset", "Quality control", "Browser-only conversion"],
  },
  "png-to-jpg": {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    shortName: "PNG to JPG",
    title: "PNG to JPG Converter Online Free",
    description:
      "Convert PNG to JPG online free with a white background for transparent areas. Files stay in your browser.",
    homeDescription: "Convert PNG images to JPG",
    href: "/png-to-jpg",
    priority: 0.88,
    keywords: ["png to jpg", "png to jpeg", "convert png to jpg", "image converter"],
    features: ["PNG input", "JPG output preset", "White transparency fill", "Quality control"],
  },
  "jpg-to-png": {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    shortName: "JPG to PNG",
    title: "JPG to PNG Converter Online Free",
    description:
      "Convert JPG to PNG online free in your browser. Create a PNG copy without uploading the image.",
    homeDescription: "Convert JPG images to PNG",
    href: "/jpg-to-png",
    priority: 0.86,
    keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "image converter"],
    features: ["JPG and JPEG input", "PNG output preset", "Lossless PNG export", "No upload required"],
  },
  "avif-to-jpg": {
    slug: "avif-to-jpg",
    name: "AVIF to JPG",
    shortName: "AVIF to JPG",
    title: "AVIF to JPG Converter Online Free",
    description:
      "Convert AVIF to JPG online free where your browser can decode AVIF. Export compatible JPEG files locally.",
    homeDescription: "Convert AVIF images to JPG",
    href: "/avif-to-jpg",
    priority: 0.84,
    keywords: ["avif to jpg", "avif to jpeg", "convert avif", "avif converter"],
    features: ["AVIF input", "JPG output preset", "Quality control", "Browser decode support check"],
  },
  "png-to-webp": {
    slug: "png-to-webp",
    name: "PNG to WebP",
    shortName: "PNG to WebP",
    title: "PNG to WebP Converter Online Free",
    description:
      "Convert PNG to WebP online free with quality control and transparency support. Processing stays in your browser.",
    homeDescription: "Convert PNG images to WebP",
    href: "/png-to-webp",
    priority: 0.82,
    keywords: ["png to webp", "convert png to webp", "webp converter", "png webp"],
    features: ["PNG input", "WebP output preset", "Transparency support", "Quality control"],
  },
  "compress-jpg": {
    slug: "compress-jpg",
    name: "Compress JPG",
    shortName: "Compress JPG",
    title: "Compress JPG Online Free - Reduce JPEG Size",
    description:
      "Compress JPG images online free with quality, max dimension and target KB controls. No upload required.",
    homeDescription: "Reduce JPG file size",
    href: "/compress-jpg",
    priority: 0.86,
    keywords: ["compress jpg", "jpg compressor", "jpeg compressor", "reduce jpg size"],
    features: ["JPG output preset", "Target KB option", "Quality slider", "Web Worker compression"],
  },
  "compress-png": {
    slug: "compress-png",
    name: "Compress PNG",
    shortName: "Compress PNG",
    title: "Compress PNG Online Free - Reduce PNG Size",
    description:
      "Compress PNG images online free in your browser with optional resizing and transparent PNG output.",
    homeDescription: "Reduce PNG file size",
    href: "/compress-png",
    priority: 0.86,
    keywords: ["compress png", "png compressor", "reduce png size", "png size reducer"],
    features: ["PNG output preset", "Optional max dimension", "Local compression", "Transparency support"],
  },
  "heic-to-jpg": {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    shortName: "HEIC to JPG",
    title: "HEIC to JPG Converter Online Free",
    description:
      "Convert iPhone HEIC photos to JPG online free with browser-based HEIC decoding. No upload or account required.",
    homeDescription: "Convert iPhone HEIC to JPG",
    href: "/heic-to-jpg",
    priority: 0.94,
    popular: true,
    keywords: ["heic to jpg", "heic to jpeg", "iphone photo converter", "convert heic"],
    features: ["HEIC and HEIF input", "JPG output preset", "Cross-browser decoder", "Quality control"],
  },
  "heic-to-png": {
    slug: "heic-to-png",
    name: "HEIC to PNG",
    shortName: "HEIC to PNG",
    title: "HEIC to PNG Converter Online Free",
    description:
      "Convert HEIC or HEIF photos to PNG online free in your browser. Useful for compatible image uploads and editing.",
    homeDescription: "Convert HEIC photos to PNG",
    href: "/heic-to-png",
    priority: 0.86,
    keywords: ["heic to png", "heif to png", "convert heic to png", "iphone heic converter"],
    features: ["HEIC and HEIF input", "PNG output preset", "Cross-browser decoder", "No upload required"],
  },
  crop: {
    slug: "crop",
    name: "Crop Image",
    shortName: "Crop",
    title: "Crop Image Online Free - Any Size or Aspect Ratio",
    description:
      "Crop images online free to custom selections or fixed ratios for forms, IDs, thumbnails and profiles. No upload.",
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
    title: "Rotate Image Online Free - Rotate, Flip & Straighten",
    description:
      "Rotate and flip images online free by 90, 180, 270 degrees or a custom angle. Files stay on your device.",
    homeDescription: "Rotate, mirror, straighten",
    href: "/rotate-image",
    priority: 0.8,
    keywords: [
      "rotate image online free",
      "flip image online free",
      "mirror image online free",
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
    title: "Remove Background from Image Free Online",
    description:
      "Remove image backgrounds online free with browser-based AI and export transparent PNG files. No upload required.",
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
    title: "Add Watermark to Image Online Free - Text or Logo",
    description:
      "Add text or logo watermarks to images online free with position, opacity, rotation and tiling controls.",
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
      "Merge images online free side by side, vertically or in a grid. Combine photos and screenshots in your browser.",
    homeDescription: "Combine multiple images",
    href: "/merge-images",
    priority: 0.8,
    keywords: [
      "merge images online free",
      "combine photos online free",
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
    title: "Image Filters Online Free - Edit Photo Colors",
    description:
      "Apply free online image filters and adjust brightness, contrast, saturation, hue and blur in your browser.",
    homeDescription: "Adjust and enhance photos",
    href: "/image-filters",
    priority: 0.7,
    keywords: [
      "image filters online free",
      "photo adjustments online free",
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
    title: "Image Metadata Viewer Online Free - EXIF & File Info",
    description:
      "View image metadata and EXIF data online free, including dimensions, camera details and color palette. Strip metadata locally.",
    homeDescription: "View EXIF, strip metadata, palette",
    href: "/image-metadata",
    priority: 0.7,
    keywords: [
      "image metadata viewer online free",
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
  "image-to-text": {
    slug: "image-to-text",
    name: "Image to Text",
    shortName: "Image OCR",
    title: "Image to Text Converter Online Free - OCR",
    description:
      "Extract text from images online free with browser-based OCR. Copy or download recognized text without uploading the image.",
    homeDescription: "Extract text with OCR",
    href: "/image-to-text",
    priority: 0.9,
    popular: true,
    keywords: ["image to text", "ocr online", "extract text from image", "photo to text"],
    features: ["Browser OCR engine", "Language selection", "Copy text", "TXT download"],
  },
  "svg-to-png": {
    slug: "svg-to-png",
    name: "SVG to PNG",
    shortName: "SVG to PNG",
    title: "SVG to PNG Converter Online Free",
    description:
      "Convert SVG files to PNG, JPG or WebP online free with scale and background controls. Processing is local.",
    homeDescription: "Rasterize SVG files",
    href: "/svg-to-png",
    priority: 0.84,
    keywords: ["svg to png", "svg to jpg", "convert svg", "svg converter"],
    features: ["PNG, JPG and WebP output", "Scale controls", "Background color", "SVG sanitization"],
  },
  "favicon-generator": {
    slug: "favicon-generator",
    name: "Favicon Generator",
    shortName: "Favicon",
    title: "Favicon Generator Online Free - ICO and App Icons",
    description:
      "Generate favicon files online free from one image. Create ICO, PNG app icons and a manifest-ready icon ZIP in your browser.",
    homeDescription: "Create favicon icon packs",
    href: "/favicon-generator",
    priority: 0.82,
    keywords: ["favicon generator", "ico generator", "app icon generator", "website icon maker"],
    features: ["ICO output", "PNG icon sizes", "ZIP download", "Local canvas export"],
  },
  "blur-image": {
    slug: "blur-image",
    name: "Blur Image Areas",
    shortName: "Blur Image",
    title: "Blur Image Areas Online Free",
    description:
      "Blur selected areas of an image online free for privacy, screenshots and document sharing. Files stay in your browser.",
    homeDescription: "Hide private image areas",
    href: "/blur-image",
    priority: 0.78,
    keywords: ["blur image", "blur face online", "blur part of image", "hide image details"],
    features: ["Manual blur boxes", "Pixelate mode", "Strength control", "PNG/JPG/WebP export"],
  },
  "image-collage-maker": {
    slug: "image-collage-maker",
    name: "Image Collage Maker",
    shortName: "Collage Maker",
    title: "Image Collage Maker Online Free",
    description:
      "Create image collages online free with grid, story, banner and comparison layouts. Combine photos locally in your browser.",
    homeDescription: "Create photo collages",
    href: "/image-collage-maker",
    priority: 0.8,
    keywords: ["image collage maker", "photo collage maker", "make collage online", "image grid maker"],
    features: ["Grid and story layouts", "Gap and background controls", "Aspect presets", "Single image download"],
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
      "Merge PDF files online free into one document directly in your browser. No upload, no signup and no watermark.",
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
    title: "Compress PDF Online Free - Reduce PDF Size to KB",
    description:
      "Compress PDF online free and reduce PDF size to a target KB in your browser. No upload and no account required.",
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
    title: "Split PDF Online Free - Extract PDF Pages",
    description:
      "Split PDF online free into individual pages, fixed ranges or custom page ranges. Download results as PDF files or ZIP.",
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
      "Convert PDF to JPG, PNG or WebP online free with page selection and DPI control. Files stay in your browser.",
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
    title: "JPG to PDF Converter Online Free - Image to PDF",
    description:
      "Convert JPG, PNG, WebP and AVIF images to PDF online free with page size, margin and fit controls.",
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
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortName: "JPG to PDF",
    title: "JPG to PDF Converter Online Free",
    description:
      "Convert JPG images to PDF online free with page size, margin and fit controls. Files stay in your browser.",
    homeDescription: "Turn JPG images into PDF",
    href: "/jpg-to-pdf",
    priority: 0.94,
    popular: true,
    keywords: ["jpg to pdf", "jpeg to pdf", "convert jpg to pdf", "image to pdf"],
    features: ["Multiple JPG images", "A4 and Letter pages", "Margin controls", "Browser-only PDF export"],
  },
  "png-to-pdf": {
    slug: "png-to-pdf",
    name: "PNG to PDF",
    shortName: "PNG to PDF",
    title: "PNG to PDF Converter Online Free",
    description:
      "Convert PNG images to PDF online free with page size, margin, fit and background controls. No upload required.",
    homeDescription: "Turn PNG images into PDF",
    href: "/png-to-pdf",
    priority: 0.86,
    keywords: ["png to pdf", "convert png to pdf", "image to pdf", "png pdf converter"],
    features: ["Multiple PNG images", "A4 and Letter pages", "Transparent image handling", "Local PDF export"],
  },
  "heic-to-pdf": {
    slug: "heic-to-pdf",
    name: "HEIC to PDF",
    shortName: "HEIC to PDF",
    title: "HEIC to PDF Converter Online Free",
    description:
      "Convert iPhone HEIC photos to PDF online free with browser-based HEIC decoding and PDF page controls.",
    homeDescription: "Turn HEIC photos into PDF",
    href: "/heic-to-pdf",
    priority: 0.88,
    keywords: ["heic to pdf", "iphone photo to pdf", "convert heic to pdf", "heif to pdf"],
    features: ["HEIC and HEIF input", "PDF page settings", "Cross-browser decoder", "No upload required"],
  },
  "rotate-pdf": {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortName: "Rotate PDF",
    title: "Rotate PDF Online Free - Rotate PDF Pages",
    description:
      "Rotate PDF pages online free by 90, 180 or 270 degrees. Rotate all pages or selected pages in your browser.",
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
    title: "Add Watermark to PDF Online Free - Text or Image",
    description:
      "Add text or image watermark to PDF online free with page range, position, opacity and rotation controls.",
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
    title: "Protect PDF Online Free - Add Password",
    description:
      "Password protect PDF online free with open password, permissions and qpdf WebAssembly encryption in your browser.",
    homeDescription: "Add a PDF password",
    href: "/protect-pdf",
    priority: 0.7,
    keywords: [
      "protect pdf online free",
      "password protect pdf online free",
      "encrypt pdf online free",
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
    title: "Unlock PDF Online Free - Remove Known Password",
    description:
      "Unlock PDF online free by removing a known password in your browser. This tool does not crack or bypass security.",
    homeDescription: "Remove a known PDF password",
    href: "/unlock-pdf",
    priority: 0.7,
    keywords: [
      "unlock pdf online free",
      "remove pdf password online free",
      "pdf password remover free",
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
    title: "Extract PDF Pages Online Free - Save Selected Pages",
    description:
      "Extract PDF pages online free by visual selection or page range, then save selected pages as one PDF or separate files.",
    homeDescription: "Pull selected pages out",
    href: "/extract-pdf-pages",
    priority: 0.84,
    keywords: [
      "extract pdf pages online free",
      "extract pages from pdf free",
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
  "delete-pages-from-pdf": {
    slug: "delete-pages-from-pdf",
    name: "Delete Pages from PDF",
    shortName: "Delete Pages",
    title: "Delete Pages from PDF Online Free",
    description:
      "Delete pages from a PDF online free by visual page selection or page range. The PDF is processed in your browser.",
    homeDescription: "Remove unwanted PDF pages",
    href: "/delete-pages-from-pdf",
    priority: 0.86,
    keywords: ["delete pages from pdf", "remove pdf pages", "pdf page remover", "delete pdf pages"],
    features: ["Visual page selection", "Page range input", "Keeps remaining pages", "No upload required"],
  },
  "reorder-pdf-pages": {
    slug: "reorder-pdf-pages",
    name: "Reorder PDF Pages",
    shortName: "Reorder Pages",
    title: "Reorder PDF Pages Online Free - Organize PDF",
    description:
      "Reorder PDF pages online free, move pages into a new order, reverse pages or reset before download.",
    homeDescription: "Change page order",
    href: "/reorder-pdf-pages",
    priority: 0.76,
    keywords: [
      "reorder pdf pages online free",
      "organize pdf pages online free",
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
  "edit-pdf": {
    slug: "edit-pdf",
    name: "Edit PDF",
    shortName: "Edit PDF",
    title: "Edit PDF Online Free - Add Text, Shapes and Signatures",
    description:
      "Edit PDFs online free by adding text, highlights, boxes, drawings and signature images in your browser.",
    homeDescription: "Annotate and fill PDFs",
    href: "/edit-pdf",
    priority: 0.92,
    popular: true,
    keywords: ["pdf editor", "edit pdf online", "annotate pdf", "fill pdf online"],
    features: ["Add text", "Add highlights and boxes", "Add signature image", "Selected page controls"],
  },
  "sign-pdf": {
    slug: "sign-pdf",
    name: "Sign PDF",
    shortName: "Sign PDF",
    title: "Sign PDF Online Free - Add Signature to PDF",
    description:
      "Sign PDF files online free by drawing a signature or adding a signature image. Processing stays in your browser.",
    homeDescription: "Add a signature to PDF",
    href: "/sign-pdf",
    priority: 0.86,
    keywords: ["sign pdf", "add signature to pdf", "pdf signature online", "fill and sign pdf"],
    features: ["Draw signature", "Upload signature image", "Place on selected pages", "Browser-only PDF export"],
  },
  "crop-pdf": {
    slug: "crop-pdf",
    name: "Crop PDF",
    shortName: "Crop PDF",
    title: "Crop PDF Online Free - Trim PDF Margins",
    description:
      "Crop PDF pages online free by trimming margins from all pages or selected page ranges. Files are processed locally.",
    homeDescription: "Trim PDF page margins",
    href: "/crop-pdf",
    priority: 0.8,
    keywords: ["crop pdf", "trim pdf margins", "pdf cropper", "crop pdf pages"],
    features: ["Top, right, bottom and left crop", "Selected page ranges", "Apply to all pages", "No upload required"],
  },
  "pdf-to-text": {
    slug: "pdf-to-text",
    name: "PDF to Text",
    shortName: "PDF to Text",
    title: "PDF to Text Converter Online Free",
    description:
      "Extract selectable text from PDF files online free. Copy or download TXT output directly from your browser.",
    homeDescription: "Extract selectable PDF text",
    href: "/pdf-to-text",
    priority: 0.82,
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor", "convert pdf to txt"],
    features: ["Selectable text extraction", "Page separators", "Copy output", "TXT download"],
  },
  "redact-pdf": {
    slug: "redact-pdf",
    name: "Redact PDF",
    shortName: "Redact PDF",
    title: "Redact PDF Online Free - Black Out PDF Text",
    description:
      "Redact PDF pages online free by covering selected areas and rasterizing redacted pages so hidden text is not recoverable.",
    homeDescription: "Hide sensitive PDF areas",
    href: "/redact-pdf",
    priority: 0.78,
    keywords: ["redact pdf", "black out pdf", "remove sensitive text pdf", "pdf redaction"],
    features: ["Redaction rectangles", "Selected page ranges", "Rasterized redacted pages", "Browser-only processing"],
  },
  "add-page-numbers-to-pdf": {
    slug: "add-page-numbers-to-pdf",
    name: "Add Page Numbers to PDF",
    shortName: "Page Numbers",
    title: "Add Page Numbers to PDF Online Free",
    description:
      "Add page numbers to PDF online free with position, start number, prefix, suffix, font and margin controls.",
    homeDescription: "Number PDF pages",
    href: "/add-page-numbers-to-pdf",
    priority: 0.78,
    keywords: [
      "add page numbers to pdf online free",
      "number pdf pages online free",
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
    title: "PDF Metadata Viewer Online Free - View PDF Properties",
    description:
      "View PDF metadata online free, including document properties, page sizes, PDF version and encryption status.",
    homeDescription: "View and clean PDF info",
    href: "/view-pdf-metadata",
    priority: 0.72,
    keywords: [
      "pdf metadata viewer online free",
      "view pdf properties online free",
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
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | FreeConvert`,
      description: tool.description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | FreeConvert`,
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
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | FreeConvert`,
      description: tool.description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | FreeConvert`,
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
    "compress-jpg": {
      quality: q,
      outputFormat: "image/jpeg",
      targetSizeKB: safeNumber(params.target, 0, 0, 51200),
      maxWidthOrHeight: safeNumber(params.maxwh, 0, 0, 16000),
    },
    "compress-png": {
      quality: q,
      outputFormat: "image/png",
      targetSizeKB: safeNumber(params.target, 0, 0, 51200),
      maxWidthOrHeight: safeNumber(params.maxwh, 0, 0, 16000),
    },
    convert: {
      outputFormat: to,
      quality: q,
    },
    "webp-to-jpg": {
      outputFormat: "image/jpeg",
      quality: q,
    },
    "png-to-jpg": {
      outputFormat: "image/jpeg",
      quality: q,
    },
    "jpg-to-png": {
      outputFormat: "image/png",
      quality: q,
    },
    "avif-to-jpg": {
      outputFormat: "image/jpeg",
      quality: q,
    },
    "png-to-webp": {
      outputFormat: "image/webp",
      quality: q,
    },
    "heic-to-jpg": {
      outputFormat: "image/jpeg",
      quality: q,
    },
    "heic-to-png": {
      outputFormat: "image/png",
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
    "image-to-text": {},
    "svg-to-png": {
      outputFormat: mimeFromShortFormat(
        safeEnum(params.format, ["jpeg", "jpg", "png", "webp", "avif"], "png"),
      ),
      quality: q,
    },
    "favicon-generator": {},
    "blur-image": {
      outputFormat: format,
      quality: q,
    },
    "image-collage-maker": {
      outputFormat: format,
      quality: q,
    },
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
    "jpg-to-pdf": {
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
    "png-to-pdf": {
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
    "heic-to-pdf": {
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
    "delete-pages-from-pdf": {},
    "reorder-pdf-pages": {},
    "edit-pdf": {},
    "sign-pdf": {},
    "crop-pdf": {},
    "pdf-to-text": {},
    "redact-pdf": {},
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

function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function toolBreadcrumbJsonLd(slug: ToolSlug) {
  const tool = toolConfigs[slug];

  return breadcrumbJsonLd([
    { name: "FreeConvert", url: BASE_URL },
    { name: "Free Image Tools", url: `${BASE_URL}/#image-tools` },
    { name: tool.name, url: `${BASE_URL}${tool.href}` },
  ]);
}

export function pdfToolBreadcrumbJsonLd(slug: PDFToolSlug) {
  const tool = pdfToolConfigs[slug];

  return breadcrumbJsonLd([
    { name: "FreeConvert", url: BASE_URL },
    { name: "Free PDF Tools", url: `${BASE_URL}/pdf-tools` },
    { name: tool.name, url: `${BASE_URL}${tool.href}` },
  ]);
}
