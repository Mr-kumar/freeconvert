import type {
  CompressPDFOptions,
  ExtractPagesOptions,
  ImageToPDFOptions,
  MergePDFOptions,
  PageNumberOptions,
  PDFInfo,
  PDFPageInfo,
  PDFPageSize,
  PDFPosition,
  PDFToImageOptions,
  RotatePDFOptions,
  SplitPDFOptions,
  WatermarkPDFOptions,
} from "@/lib/types";
import { parsePageRange, parsePageRangeGroups } from "@/lib/utils";

type ProgressCallback = (progress: number, step?: string) => void;

const PDF_WORKER_SRC = "/pdf.worker.min.mjs";
const MM_TO_PT = 2.83465;
const QPDF_JS_SRC = "/qpdf.js";
const QPDF_WASM_SRC = "/qpdf.wasm";

type QPDFModule = Awaited<ReturnType<typeof import("qpdf-wasm")["default"]>>;

let qpdfModulePromise: Promise<QPDFModule> | null = null;

async function getPDFLib() {
  return import("pdf-lib");
}

async function getPDFJS() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  return pdfjs;
}

async function getQPDF() {
  qpdfModulePromise ??= import("qpdf-wasm").then(({ default: init }) =>
    init({
      locateFile: (file) => (file.endsWith(".wasm") ? QPDF_WASM_SRC : QPDF_JS_SRC),
      print: () => undefined,
      printErr: () => undefined,
    }),
  );

  return qpdfModulePromise;
}

async function fileToArrayBuffer(file: File | Blob) {
  return file.arrayBuffer();
}

function blobFromBytes(bytes: Uint8Array) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;

  return new Blob([arrayBuffer], { type: "application/pdf" });
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function allPages(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

function selectedPages(pages: "all" | number[], totalPages: number) {
  if (pages === "all") {
    return allPages(totalPages);
  }

  return pages.filter((page) => page >= 1 && page <= totalPages);
}

function getPDFVersion(bytes: ArrayBuffer) {
  const header = new TextDecoder("ascii").decode(bytes.slice(0, 16));
  return header.match(/%PDF-(\d\.\d)/)?.[1];
}

function getPDFLinearized(bytes: ArrayBuffer) {
  const head = new TextDecoder("ascii").decode(bytes.slice(0, 1024));
  return /Linearized/i.test(head);
}

function sizeName(width: number, height: number) {
  const knownSizes: Record<string, [number, number]> = {
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    Letter: [612, 792],
    Legal: [612, 1008],
    Tabloid: [792, 1224],
  };

  for (const [name, [knownWidth, knownHeight]] of Object.entries(knownSizes)) {
    const portrait =
      Math.abs(width - knownWidth) < 3 && Math.abs(height - knownHeight) < 3;
    const landscape =
      Math.abs(width - knownHeight) < 3 && Math.abs(height - knownWidth) < 3;

    if (portrait || landscape) {
      return name;
    }
  }

  return undefined;
}

function getPageInfo(page: {
  getSize: () => { width: number; height: number };
  getRotation: () => { angle: number };
}, index: number): PDFPageInfo {
  const { width, height } = page.getSize();

  return {
    pageNumber: index + 1,
    width,
    height,
    rotation: page.getRotation().angle,
    orientation: width >= height ? "landscape" : "portrait",
    sizeName: sizeName(width, height),
  };
}

function hexToRgb(color = "#111111") {
  const normalized = /^#[0-9a-f]{6}$/i.test(color) ? color : "#111111";
  const value = normalized.slice(1);

  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function getStandardFontName(
  fontFamily: "Helvetica" | "Times-Roman" | "Courier" | undefined,
  StandardFonts: {
    Helvetica: string;
    TimesRoman: string;
    Courier: string;
  },
) {
  if (fontFamily === "Times-Roman") {
    return StandardFonts.TimesRoman;
  }

  if (fontFamily === "Courier") {
    return StandardFonts.Courier;
  }

  return StandardFonts.Helvetica;
}

function getPositionRect(
  position: PDFPosition,
  pageWidth: number,
  pageHeight: number,
  itemWidth: number,
  itemHeight: number,
  margin = 36,
) {
  const xMap = {
    "top-left": margin,
    "middle-left": margin,
    "bottom-left": margin,
    "top-center": (pageWidth - itemWidth) / 2,
    center: (pageWidth - itemWidth) / 2,
    "bottom-center": (pageWidth - itemWidth) / 2,
    "top-right": pageWidth - itemWidth - margin,
    "middle-right": pageWidth - itemWidth - margin,
    "bottom-right": pageWidth - itemWidth - margin,
  };
  const yMap = {
    "top-left": pageHeight - itemHeight - margin,
    "top-center": pageHeight - itemHeight - margin,
    "top-right": pageHeight - itemHeight - margin,
    "middle-left": (pageHeight - itemHeight) / 2,
    center: (pageHeight - itemHeight) / 2,
    "middle-right": (pageHeight - itemHeight) / 2,
    "bottom-left": margin,
    "bottom-center": margin,
    "bottom-right": margin,
  };

  return {
    x: xMap[position],
    y: yMap[position],
  };
}

function getCustomPositionRect(
  xPercent: number,
  yPercent: number,
  pageWidth: number,
  pageHeight: number,
  itemWidth: number,
  itemHeight: number,
) {
  const centerX = (pageWidth * clampNumber(xPercent, 0, 100)) / 100;
  const centerYFromTop = (pageHeight * clampNumber(yPercent, 0, 100)) / 100;

  return {
    x: clampNumber(centerX - itemWidth / 2, 0, Math.max(pageWidth - itemWidth, 0)),
    y: clampNumber(
      pageHeight - centerYFromTop - itemHeight / 2,
      0,
      Math.max(pageHeight - itemHeight, 0),
    ),
  };
}

function getWatermarkRect(
  opts: Pick<WatermarkPDFOptions, "customXPercent" | "customYPercent" | "position">,
  pageWidth: number,
  pageHeight: number,
  itemWidth: number,
  itemHeight: number,
) {
  if (
    typeof opts.customXPercent === "number" &&
    typeof opts.customYPercent === "number"
  ) {
    return getCustomPositionRect(
      opts.customXPercent,
      opts.customYPercent,
      pageWidth,
      pageHeight,
      itemWidth,
      itemHeight,
    );
  }

  return getPositionRect(opts.position, pageWidth, pageHeight, itemWidth, itemHeight);
}

function pageSizeToPoints(
  pageSize: PDFPageSize,
  customWidth?: number,
  customHeight?: number,
) {
  const sizes: Record<Exclude<PDFPageSize, "Custom" | "Match Image">, [number, number]> = {
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    Letter: [612, 792],
    Legal: [612, 1008],
    Tabloid: [792, 1224],
  };

  if (pageSize === "Custom") {
    return [
      Math.max((customWidth || 210) * MM_TO_PT, 72),
      Math.max((customHeight || 297) * MM_TO_PT, 72),
    ] as [number, number];
  }

  return sizes[pageSize === "Match Image" ? "A4" : pageSize];
}

function applyOrientation(
  size: [number, number],
  orientation: "portrait" | "landscape" | "auto",
  imageWidth: number,
  imageHeight: number,
) {
  const shouldLandscape =
    orientation === "landscape" ||
    (orientation === "auto" && imageWidth > imageHeight);
  const [width, height] = size;

  if (shouldLandscape) {
    return [Math.max(width, height), Math.min(width, height)] as [number, number];
  }

  return [Math.min(width, height), Math.max(width, height)] as [number, number];
}

function getDrawRect({
  fit,
  align,
  imageWidth,
  imageHeight,
  drawWidth,
  drawHeight,
  margin,
}: {
  fit: ImageToPDFOptions["imageFit"];
  align: PDFPosition;
  imageWidth: number;
  imageHeight: number;
  drawWidth: number;
  drawHeight: number;
  margin: number;
}) {
  let width = drawWidth;
  let height = drawHeight;

  if (fit === "contain" || fit === "actual-size") {
    const maxWidth = fit === "actual-size" ? Math.min(imageWidth * 0.75, drawWidth) : drawWidth;
    const maxHeight =
      fit === "actual-size" ? Math.min(imageHeight * 0.75, drawHeight) : drawHeight;
    const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
    width = imageWidth * ratio;
    height = imageHeight * ratio;
  }

  if (fit === "cover") {
    const ratio = Math.max(drawWidth / imageWidth, drawHeight / imageHeight);
    width = imageWidth * ratio;
    height = imageHeight * ratio;
  }

  const rect = getPositionRect(align, drawWidth, drawHeight, width, height, 0);

  return {
    x: margin + rect.x,
    y: margin + rect.y,
    width,
    height,
  };
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not render output."));
        }
      },
      type,
      quality,
    );
  });
}

async function renderPDFPageToCanvas(
  pdf: { getPage: (pageNumber: number) => Promise<unknown> },
  pageNumber: number,
  scale: number,
) {
  const page = (await pdf.getPage(pageNumber)) as {
    getViewport: (options: { scale: number }) => {
      width: number;
      height: number;
    };
    render: (options: {
      canvasContext: CanvasRenderingContext2D;
      viewport: unknown;
    }) => { promise: Promise<void> };
  };
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available in this browser.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas;
}

async function getPDFJSDocument(file: File | Blob) {
  const pdfjs = await getPDFJS();
  const bytes = await fileToArrayBuffer(file);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes) });
  const pdf = await loadingTask.promise;

  return { pdf, loadingTask };
}

function unlinkIfExists(module: QPDFModule, path: string) {
  try {
    module.FS.unlink(path);
  } catch {
    // The in-memory file may not exist yet.
  }
}

async function runQPDF(
  input: File | Blob,
  args: string[],
  onProgress?: ProgressCallback,
) {
  onProgress?.(8, "Loading PDF security engine...");
  const qpdf = await getQPDF();
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const inputPath = `/input-${unique}.pdf`;
  const outputPath = `/output-${unique}.pdf`;

  unlinkIfExists(qpdf, inputPath);
  unlinkIfExists(qpdf, outputPath);
  qpdf.FS.writeFile(inputPath, new Uint8Array(await input.arrayBuffer()));

  onProgress?.(35, "Applying PDF security...");
  const exitCode = qpdf.callMain([...args, inputPath, outputPath]);

  if (exitCode !== 0) {
    unlinkIfExists(qpdf, inputPath);
    unlinkIfExists(qpdf, outputPath);
    throw new Error("The PDF security engine could not process this file.");
  }

  const output = qpdf.FS.readFile(outputPath);
  unlinkIfExists(qpdf, inputPath);
  unlinkIfExists(qpdf, outputPath);
  onProgress?.(100, "Protected PDF ready.");

  return blobFromBytes(output);
}

async function loadImage(file: File) {
  const url = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read this image."));
      img.src = url;
    });

    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function normalizeImageForPDF(file: File) {
  const image = await loadImage(file);
  const bytes = new Uint8Array(await fileToArrayBuffer(file));
  const lowerName = file.name.toLowerCase();
  const isJpeg =
    file.type === "image/jpeg" || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg");
  const isPng = file.type === "image/png" || lowerName.endsWith(".png");

  if (isJpeg || isPng) {
    return {
      bytes,
      kind: isJpeg ? "jpeg" : "png",
      width: image.naturalWidth,
      height: image.naturalHeight,
    } as const;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available in this browser.");
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0);

  const blob = await canvasToBlob(canvas, "image/png");

  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    kind: "png",
    width: image.naturalWidth,
    height: image.naturalHeight,
  } as const;
}

export async function getPDFInfo(file: File | Blob, fileName = "document.pdf"): Promise<PDFInfo> {
  const { PDFDocument } = await getPDFLib();
  const bytes = await fileToArrayBuffer(file);
  const name = file instanceof File ? file.name : fileName;
  const size = file.size;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = doc.getPages().map((page, index) => getPageInfo(page, index));

  return {
    fileName: name,
    fileSize: size,
    pageCount: doc.getPageCount(),
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    keywords: doc.getKeywords(),
    creator: doc.getCreator(),
    producer: doc.getProducer(),
    creationDate: doc.getCreationDate(),
    modificationDate: doc.getModificationDate(),
    isEncrypted: doc.isEncrypted,
    isLinearized: getPDFLinearized(bytes),
    pdfVersion: getPDFVersion(bytes),
    pages,
  };
}

export async function generatePageThumbnails(
  file: File,
  scale = 0.25,
  onProgress?: ProgressCallback,
) {
  const { pdf, loadingTask } = await getPDFJSDocument(file);
  const thumbnails: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      onProgress?.(
        ((pageNumber - 1) / pdf.numPages) * 100,
        `Rendering page ${pageNumber} of ${pdf.numPages}...`,
      );
      const canvas = await renderPDFPageToCanvas(pdf, pageNumber, scale);
      thumbnails.push(canvas.toDataURL("image/png"));
      await new Promise((resolve) => window.setTimeout(resolve, 16));
    }
  } finally {
    await loadingTask.destroy();
  }

  onProgress?.(100, "PDF preview ready.");
  return thumbnails;
}

export async function mergePDFs(files: File[], opts: MergePDFOptions) {
  const { PDFDocument } = await getPDFLib();
  const mergedDoc = await PDFDocument.create();

  for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
    const doc = await PDFDocument.load(await fileToArrayBuffer(files[fileIndex]));

    if (doc.isEncrypted) {
      throw new Error(`${files[fileIndex].name} is encrypted and cannot be merged.`);
    }

    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));

    if (opts.addBlankPageBetween && fileIndex < files.length - 1) {
      mergedDoc.addPage();
    }
  }

  mergedDoc.setTitle(opts.outputName.replace(/\.pdf$/i, ""));

  return blobFromBytes(await mergedDoc.save());
}

export async function splitPDF(file: File, opts: SplitPDFOptions) {
  const { PDFDocument } = await getPDFLib();
  const source = await PDFDocument.load(await fileToArrayBuffer(file));
  const totalPages = source.getPageCount();
  let groups: number[][];

  if (opts.mode === "every-page") {
    groups = allPages(totalPages).map((page) => [page]);
  } else if (opts.mode === "fixed-range") {
    const size = Math.max(1, opts.fixedRange || 1);
    groups = [];

    for (let page = 1; page <= totalPages; page += size) {
      groups.push(allPages(totalPages).slice(page - 1, page - 1 + size));
    }
  } else {
    groups = parsePageRangeGroups(opts.customRanges || "", totalPages).map(
      (group) => group.pages,
    );
  }

  const outputs: Blob[] = [];

  for (const pages of groups.filter((group) => group.length > 0)) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(source, pages.map((page) => page - 1));
    copied.forEach((page) => doc.addPage(page));
    outputs.push(blobFromBytes(await doc.save()));
  }

  return outputs;
}

export async function pdfToImages(
  file: File,
  opts: PDFToImageOptions,
  onProgress?: ProgressCallback,
) {
  const { pdf, loadingTask } = await getPDFJSDocument(file);
  const totalPages = pdf.numPages;
  const pages = selectedPages(opts.pages, totalPages);
  const outputs: Blob[] = [];

  try {
    for (let index = 0; index < pages.length; index += 1) {
      const pageNumber = pages[index];
      onProgress?.(
        (index / pages.length) * 100,
        `Rendering page ${pageNumber} of ${totalPages}...`,
      );
      const canvas = await renderPDFPageToCanvas(
        pdf,
        pageNumber,
        (opts.dpi / 72) * opts.scale,
      );
      outputs.push(
        await canvasToBlob(
          canvas,
          `image/${opts.format}`,
          opts.format === "png" ? undefined : opts.quality,
        ),
      );
    }
  } finally {
    await loadingTask.destroy();
  }

  onProgress?.(100, "Images ready.");
  return outputs;
}

export async function imagesToPDF(files: File[], opts: ImageToPDFOptions) {
  const { PDFDocument, rgb } = await getPDFLib();
  const fontkit = await import("@pdf-lib/fontkit");
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit.default);

  if (opts.title) doc.setTitle(opts.title);
  if (opts.author) doc.setAuthor(opts.author);
  if (opts.subject) doc.setSubject(opts.subject);
  if (opts.keywords) {
    doc.setKeywords(
      opts.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    );
  }

  for (const file of files) {
    const image = await normalizeImageForPDF(file);
    const embedded =
      image.kind === "jpeg"
        ? await doc.embedJpg(image.bytes)
        : await doc.embedPng(image.bytes);
    const baseSize =
      opts.pageSize === "Match Image"
        ? ([image.width * 0.75, image.height * 0.75] as [number, number])
        : pageSizeToPoints(opts.pageSize, opts.customWidth, opts.customHeight);
    const [pageWidth, pageHeight] = applyOrientation(
      baseSize,
      opts.orientation,
      image.width,
      image.height,
    );
    const page = doc.addPage([pageWidth, pageHeight]);
    const margin = Math.max(0, opts.margin) * MM_TO_PT;

    if (opts.backgroundColor !== "transparent") {
      const color = hexToRgb(opts.backgroundColor);
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(color.r, color.g, color.b),
      });
    }

    const rect = getDrawRect({
      fit: opts.imageFit,
      align: opts.imageAlign,
      imageWidth: image.width,
      imageHeight: image.height,
      drawWidth: Math.max(pageWidth - margin * 2, 1),
      drawHeight: Math.max(pageHeight - margin * 2, 1),
      margin,
    });

    page.drawImage(embedded, rect);
  }

  return blobFromBytes(await doc.save());
}

export async function rotatePDF(file: File, opts: RotatePDFOptions) {
  const { PDFDocument, degrees } = await getPDFLib();
  const doc = await PDFDocument.load(await fileToArrayBuffer(file));
  const pages = selectedPages(opts.pages, doc.getPageCount());

  pages.forEach((pageNumber) => {
    const page = doc.getPage(pageNumber - 1);
    const existing = page.getRotation().angle;
    const nextRotation = ((existing + opts.degrees) % 360 + 360) % 360;
    page.setRotation(degrees(nextRotation));
  });

  return blobFromBytes(await doc.save());
}

export async function addWatermarkToPDF(file: File, opts: WatermarkPDFOptions) {
  const { PDFDocument, StandardFonts, degrees, rgb } = await getPDFLib();
  const doc = await PDFDocument.load(await fileToArrayBuffer(file));
  const pages = selectedPages(opts.pages, doc.getPageCount());
  const opacity = Math.min(Math.max(opts.opacity, 0), 1);
  const color = hexToRgb(opts.fontColor);
  const font = await doc.embedFont(getStandardFontName(opts.fontFamily, StandardFonts));
  let watermarkImage:
    | Awaited<ReturnType<typeof doc.embedPng>>
    | Awaited<ReturnType<typeof doc.embedJpg>>
    | null = null;

  if (opts.type === "image" && opts.watermarkFile) {
    const lowerName = opts.watermarkFile.name.toLowerCase();
    const bytes = new Uint8Array(await fileToArrayBuffer(opts.watermarkFile));
    watermarkImage =
      opts.watermarkFile.type === "image/jpeg" ||
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg")
        ? await doc.embedJpg(bytes)
        : await doc.embedPng(bytes);
  }

  for (const pageNumber of pages) {
    const page = doc.getPage(pageNumber - 1);
    const { width, height } = page.getSize();

    if (opts.type === "image" && watermarkImage) {
      const imageWidth = width * Math.min(Math.max(opts.imageScale || 0.25, 0.05), 0.8);
      const imageHeight = imageWidth * (watermarkImage.height / watermarkImage.width);
      const rect = getWatermarkRect(opts, width, height, imageWidth, imageHeight);

      page.drawImage(watermarkImage, {
        ...rect,
        width: imageWidth,
        height: imageHeight,
        opacity,
        rotate: degrees(opts.rotation),
      });
      continue;
    }

    const text = opts.text || "CONFIDENTIAL";
    const size = opts.fontSize || 48;
    const textWidth = font.widthOfTextAtSize(text, size);
    const textHeight = size;
    const rect = getWatermarkRect(opts, width, height, textWidth, textHeight);

    page.drawText(text, {
      ...rect,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(opts.rotation),
    });
  }

  return blobFromBytes(await doc.save());
}

export async function addPageNumbers(
  file: File,
  opts: PageNumberOptions,
  onProgress?: ProgressCallback,
) {
  const { PDFDocument, StandardFonts, rgb } = await getPDFLib();
  const doc = await PDFDocument.load(await fileToArrayBuffer(file));
  const totalPages = doc.getPageCount();
  const pages = selectedPages(opts.pages, totalPages);
  const font = await doc.embedFont(getStandardFontName(opts.fontFamily, StandardFonts));
  const color = hexToRgb(opts.fontColor);

  for (let index = 0; index < pages.length; index += 1) {
    const pageNumber = pages[index];

    if (opts.skipFirstPage && pageNumber === 1) {
      continue;
    }

    const page = doc.getPage(pageNumber - 1);
    const { width, height } = page.getSize();
    const displayNumber = opts.startFrom + pageNumber - 1;
    const label = `${opts.prefix}${displayNumber}${opts.suffix.replace("{total}", String(totalPages))}`;
    const textWidth = font.widthOfTextAtSize(label, opts.fontSize);
    const textHeight = opts.fontSize;
    const horizontal = opts.position.endsWith("center")
      ? (width - textWidth) / 2
      : opts.position.endsWith("right")
        ? width - textWidth - opts.margin
        : opts.margin;
    const vertical = opts.position.startsWith("top")
      ? height - textHeight - opts.margin
      : opts.margin;

    page.drawText(label, {
      x: horizontal,
      y: vertical,
      size: opts.fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });

    onProgress?.(
      ((index + 1) / pages.length) * 100,
      `Adding number to page ${pageNumber} of ${totalPages}...`,
    );
  }

  return blobFromBytes(await doc.save());
}

export async function extractPages(file: File, opts: ExtractPagesOptions) {
  const { PDFDocument } = await getPDFLib();
  const source = await PDFDocument.load(await fileToArrayBuffer(file));
  const pages = opts.pages.filter(
    (page) => page >= 1 && page <= source.getPageCount(),
  );

  if (opts.asSingleFile) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(source, pages.map((page) => page - 1));
    copied.forEach((page) => doc.addPage(page));
    return blobFromBytes(await doc.save());
  }

  const outputs: Blob[] = [];

  for (const pageNumber of pages) {
    const doc = await PDFDocument.create();
    const [copied] = await doc.copyPages(source, [pageNumber - 1]);
    doc.addPage(copied);
    outputs.push(blobFromBytes(await doc.save()));
  }

  return outputs;
}

export async function reorderPages(file: File, newOrder: number[]) {
  const { PDFDocument } = await getPDFLib();
  const source = await PDFDocument.load(await fileToArrayBuffer(file));
  const doc = await PDFDocument.create();
  const pageIndices = newOrder
    .filter((page) => page >= 1 && page <= source.getPageCount())
    .map((page) => page - 1);
  const copied = await doc.copyPages(source, pageIndices);
  copied.forEach((page) => doc.addPage(page));

  return blobFromBytes(await doc.save());
}

export async function compressPDF(
  file: File | Blob,
  opts: CompressPDFOptions,
  onProgress?: ProgressCallback,
) {
  const targetBytes = Math.max(0, opts.targetSizeKB || 0) * 1024;
  const baseDPI = opts.targetDPI;
  const baseQuality = clampNumber(opts.imageQuality, 0.1, 0.92);

  if (targetBytes > 0) {
    const attempts = [
      { dpi: baseDPI, quality: baseQuality },
      { dpi: Math.min(baseDPI, 150), quality: Math.min(baseQuality, 0.72) },
      { dpi: Math.min(baseDPI, 96), quality: Math.min(baseQuality, 0.58) },
      { dpi: 72, quality: Math.min(baseQuality, 0.44) },
      { dpi: 60, quality: Math.min(baseQuality, 0.34) },
      { dpi: 48, quality: Math.min(baseQuality, 0.26) },
    ].filter(
      (attempt, index, list) =>
        list.findIndex(
          (item) => item.dpi === attempt.dpi && item.quality === attempt.quality,
        ) === index,
    );
    let bestBlob: Blob | null = null;

    for (let index = 0; index < attempts.length; index += 1) {
      const attempt = attempts[index];
      const start = (index / attempts.length) * 95;
      const end = ((index + 1) / attempts.length) * 95;
      const blob = await rasterizeCompressedPDF(
        file,
        attempt.dpi,
        attempt.quality,
        (progress, step) => {
          const adjusted = start + (progress / 100) * (end - start);
          onProgress?.(
            adjusted,
            `${step || "Compressing PDF..."} Target ${opts.targetSizeKB} KB`,
          );
        },
      );

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }

      if (blob.size <= targetBytes) {
        onProgress?.(100, "Target-size PDF ready.");
        return blob;
      }
    }

    onProgress?.(100, "Closest compressed PDF ready.");
    return bestBlob || rasterizeCompressedPDF(file, baseDPI, baseQuality, onProgress);
  }

  return rasterizeCompressedPDF(file, baseDPI, baseQuality, onProgress);
}

async function rasterizeCompressedPDF(
  file: File | Blob,
  targetDPI: number,
  imageQuality: number,
  onProgress?: ProgressCallback,
) {
  const { PDFDocument } = await getPDFLib();
  const { pdf, loadingTask } = await getPDFJSDocument(file);
  const doc = await PDFDocument.create();

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      onProgress?.(
        ((pageNumber - 1) / pdf.numPages) * 100,
        `Compressing page ${pageNumber} of ${pdf.numPages}...`,
      );
      const page = (await pdf.getPage(pageNumber)) as {
        getViewport: (options: { scale: number }) => {
          width: number;
          height: number;
        };
      };
      const originalViewport = page.getViewport({ scale: 1 });
      const canvas = await renderPDFPageToCanvas(pdf, pageNumber, targetDPI / 72);
      const imageBlob = await canvasToBlob(canvas, "image/jpeg", imageQuality);
      const embedded = await doc.embedJpg(new Uint8Array(await imageBlob.arrayBuffer()));
      const outputPage = doc.addPage([originalViewport.width, originalViewport.height]);
      outputPage.drawImage(embedded, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });
    }
  } finally {
    await loadingTask.destroy();
  }

  onProgress?.(100, "Compressed PDF ready.");
  return blobFromBytes(await doc.save());
}

export async function stripPDFMetadata(file: File) {
  const { PDFDocument } = await getPDFLib();
  const doc = await PDFDocument.load(await fileToArrayBuffer(file), {
    ignoreEncryption: true,
  });

  doc.setTitle("");
  doc.setAuthor("");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setCreator("");
  doc.setProducer("FreeConvert.in");
  doc.setCreationDate(new Date(0));
  doc.setModificationDate(new Date(0));

  return blobFromBytes(await doc.save());
}

export async function updatePDFMetadata(
  file: File,
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  },
) {
  const { PDFDocument } = await getPDFLib();
  const doc = await PDFDocument.load(await fileToArrayBuffer(file), {
    ignoreEncryption: true,
  });

  doc.setTitle(metadata.title || "");
  doc.setAuthor(metadata.author || "");
  doc.setSubject(metadata.subject || "");
  doc.setKeywords(
    (metadata.keywords || "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  );
  doc.setProducer("FreeConvert.in");
  doc.setModificationDate(new Date());

  return blobFromBytes(await doc.save());
}

export async function protectPDF(
  file: File,
  opts: {
    userPassword: string;
    ownerPassword?: string;
    allowPrinting: boolean;
    allowCopying: boolean;
    allowEditing: boolean;
    encryptionLevel: 128 | 256;
  },
  onProgress?: ProgressCallback,
) {
  const password = opts.userPassword.trim();

  if (!password) {
    throw new Error("Enter a password before protecting this PDF.");
  }

  return runQPDF(
    file,
    [
      "--encrypt",
      password,
      (opts.ownerPassword || password).trim() || password,
      String(opts.encryptionLevel),
      `--print=${opts.allowPrinting ? "full" : "none"}`,
      `--modify=${opts.allowEditing ? "all" : "none"}`,
      `--extract=${opts.allowCopying ? "y" : "n"}`,
      "--",
    ],
    onProgress,
  );
}

export async function unlockPDF(
  file: File,
  password: string,
  onProgress?: ProgressCallback,
) {
  if (!password.trim()) {
    throw new Error("Enter the current password before unlocking this PDF.");
  }

  return runQPDF(
    file,
    [`--password=${password}`, "--decrypt"],
    (progress, step) => {
      onProgress?.(progress, step === "Protected PDF ready." ? "Unlocked PDF ready." : step);
    },
  );
}

export function parsePDFPages(input: string, totalPages: number) {
  return parsePageRange(input, totalPages);
}
