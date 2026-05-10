"use client";

import { create } from "zustand";
import type { PDFInfo } from "@/lib/types";

interface PDFStore {
  inputFile: File | null;
  inputPreviewUrl: string | null;
  inputInfo: PDFInfo | null;
  batchFiles: File[];
  batchInfos: (PDFInfo | null)[];
  outputBlob: Blob | null;
  outputPreviewUrl: string | null;
  outputInfo: PDFInfo | null;
  outputBatch: { blob: Blob; name: string }[];
  pageThumbnails: string[];
  selectedPages: number[];
  pageOrder: number[];
  totalPages: number;
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  setInputFile: (file: File) => void;
  addBatchFile: (file: File, readPDFInfo?: boolean) => void;
  removeBatchFile: (index: number) => void;
  reorderBatchFiles: (from: number, to: number) => void;
  clearBatch: () => void;
  setOutputBlob: (blob: Blob, fileName?: string) => void;
  setOutputBatch: (items: { blob: Blob; name: string }[]) => void;
  clearOutput: () => void;
  setSelectedPages: (pages: number[]) => void;
  setPageOrder: (order: number[]) => void;
  reset: () => void;
  setProcessing: (value: boolean, step?: string) => void;
  setProgress: (value: number) => void;
  setCurrentStep: (step: string) => void;
  setError: (message: string | null) => void;
}

function revoke(url: string | null) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

function defaultPages(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

async function readPDFInfo(blob: Blob, fileName: string) {
  const { getPDFInfo } = await import("@/lib/pdfProcessor");
  const file =
    blob instanceof File
      ? blob
      : new File([blob], fileName, {
          type: "application/pdf",
          lastModified: Date.now(),
        });

  return getPDFInfo(file, fileName);
}

export const usePDFStore = create<PDFStore>((set, get) => ({
  inputFile: null,
  inputPreviewUrl: null,
  inputInfo: null,
  batchFiles: [],
  batchInfos: [],
  outputBlob: null,
  outputPreviewUrl: null,
  outputInfo: null,
  outputBatch: [],
  pageThumbnails: [],
  selectedPages: [],
  pageOrder: [],
  totalPages: 0,
  isProcessing: false,
  progress: 0,
  currentStep: "",
  error: null,

  setInputFile: (file) => {
    const state = get();
    revoke(state.inputPreviewUrl);
    revoke(state.outputPreviewUrl);

    const previewUrl = URL.createObjectURL(file);
    set({
      inputFile: file,
      inputPreviewUrl: previewUrl,
      inputInfo: null,
      outputBlob: null,
      outputPreviewUrl: null,
      outputInfo: null,
      outputBatch: [],
      pageThumbnails: [],
      selectedPages: [],
      pageOrder: [],
      totalPages: 0,
      error: null,
      progress: 0,
      currentStep: "Reading PDF...",
    });

    import("@/lib/pdfProcessor")
      .then(async ({ generatePageThumbnails, getPDFInfo }) => {
        const info = await getPDFInfo(file);

        if (get().inputFile !== file) {
          return;
        }

        const pages = defaultPages(info.pageCount);
        set({
          inputInfo: info,
          totalPages: info.pageCount,
          selectedPages: pages,
          pageOrder: pages,
          currentStep: "Rendering thumbnails...",
        });

        const thumbnails = await generatePageThumbnails(
          file,
          0.22,
          (progress, step) => {
            if (get().inputFile === file) {
              set({ progress, currentStep: step || "" });
            }
          },
        );

        if (get().inputFile === file) {
          set({ pageThumbnails: thumbnails, progress: 0, currentStep: "" });
        }
      })
      .catch((error: unknown) => {
        if (get().inputFile === file) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Could not read this PDF.",
            progress: 0,
            currentStep: "",
          });
        }
      });
  },

  addBatchFile: (file, readPDFInfo = true) => {
    set((state) => ({
      batchFiles: [...state.batchFiles, file],
      batchInfos: [...state.batchInfos, null],
      error: null,
    }));

    if (!readPDFInfo) {
      return;
    }

    import("@/lib/pdfProcessor")
      .then(({ getPDFInfo }) => getPDFInfo(file))
      .then((info) => {
        const index = get().batchFiles.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        );

        if (index < 0) {
          return;
        }

        set((state) => {
          const batchInfos = [...state.batchInfos];
          batchInfos[index] = info;
          return { batchInfos };
        });
      })
      .catch((error: unknown) => {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Could not read one of the PDFs.",
        });
      });
  },

  removeBatchFile: (index) => {
    set((state) => ({
      batchFiles: state.batchFiles.filter((_, itemIndex) => itemIndex !== index),
      batchInfos: state.batchInfos.filter((_, itemIndex) => itemIndex !== index),
    }));
  },

  reorderBatchFiles: (from, to) => {
    const state = get();

    if (from === to || to < 0 || to >= state.batchFiles.length) {
      return;
    }

    const batchFiles = [...state.batchFiles];
    const batchInfos = [...state.batchInfos];
    const [file] = batchFiles.splice(from, 1);
    const [info] = batchInfos.splice(from, 1);

    if (!file) {
      return;
    }

    batchFiles.splice(to, 0, file);
    batchInfos.splice(to, 0, info ?? null);
    set({ batchFiles, batchInfos });
  },

  clearBatch: () => set({ batchFiles: [], batchInfos: [] }),

  setOutputBlob: (blob, fileName = "freeconvert-output.pdf") => {
    const state = get();
    revoke(state.outputPreviewUrl);

    const previewUrl = URL.createObjectURL(blob);
    set({
      outputBlob: blob,
      outputPreviewUrl: previewUrl,
      outputInfo: null,
      outputBatch: [],
      error: null,
    });

    readPDFInfo(blob, fileName)
      .then((info) => {
        if (get().outputBlob === blob) {
          set({ outputInfo: info });
        }
      })
      .catch(() => undefined);
  },

  setOutputBatch: (items) => {
    const state = get();
    revoke(state.outputPreviewUrl);
    set({
      outputBlob: null,
      outputPreviewUrl: null,
      outputInfo: null,
      outputBatch: items,
      error: null,
    });
  },

  clearOutput: () => {
    const state = get();
    revoke(state.outputPreviewUrl);
    set({
      outputBlob: null,
      outputPreviewUrl: null,
      outputInfo: null,
      outputBatch: [],
      progress: 0,
      currentStep: "",
    });
  },

  setSelectedPages: (pages) => set({ selectedPages: pages }),
  setPageOrder: (order) => set({ pageOrder: order }),

  reset: () => {
    const state = get();
    revoke(state.inputPreviewUrl);
    revoke(state.outputPreviewUrl);
    set({
      inputFile: null,
      inputPreviewUrl: null,
      inputInfo: null,
      batchFiles: [],
      batchInfos: [],
      outputBlob: null,
      outputPreviewUrl: null,
      outputInfo: null,
      outputBatch: [],
      pageThumbnails: [],
      selectedPages: [],
      pageOrder: [],
      totalPages: 0,
      isProcessing: false,
      progress: 0,
      currentStep: "",
      error: null,
    });
  },

  setProcessing: (value, step = "") =>
    set({ isProcessing: value, currentStep: step }),
  setProgress: (value) => set({ progress: value }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setError: (message) => set({ error: message }),
}));
