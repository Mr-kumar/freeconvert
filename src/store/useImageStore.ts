"use client";

import { create } from "zustand";
import type { ImageInfo } from "@/lib/types";

interface ImageStore {
  inputFile: File | null;
  inputPreviewUrl: string | null;
  outputBlob: Blob | null;
  outputPreviewUrl: string | null;
  batchFiles: File[];
  batchPreviewUrls: string[];
  isProcessing: boolean;
  progress: number;
  error: string | null;
  inputInfo: ImageInfo | null;
  outputInfo: ImageInfo | null;
  setInputFile: (file: File) => void;
  setOutputBlob: (blob: Blob, fileName?: string) => void;
  clearOutput: () => void;
  addBatchFile: (file: File) => void;
  removeBatchFile: (index: number) => void;
  reorderBatch: (from: number, to: number) => void;
  clearBatch: () => void;
  reset: () => void;
  setProcessing: (value: boolean) => void;
  setProgress: (value: number) => void;
  setError: (message: string | null) => void;
}

function revoke(url: string | null) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

async function readBlobInfo(blob: Blob, fileName: string) {
  const { getImageInfo } = await import("@/lib/imageProcessor");
  const file =
    blob instanceof File
      ? blob
      : new File([blob], fileName, {
          type: blob.type || "image/png",
          lastModified: Date.now(),
        });

  return getImageInfo(file);
}

export const useImageStore = create<ImageStore>((set, get) => ({
  inputFile: null,
  inputPreviewUrl: null,
  outputBlob: null,
  outputPreviewUrl: null,
  batchFiles: [],
  batchPreviewUrls: [],
  isProcessing: false,
  progress: 0,
  error: null,
  inputInfo: null,
  outputInfo: null,

  setInputFile: (file) => {
    const state = get();
    revoke(state.inputPreviewUrl);
    revoke(state.outputPreviewUrl);

    const previewUrl = URL.createObjectURL(file);
    set({
      inputFile: file,
      inputPreviewUrl: previewUrl,
      outputBlob: null,
      outputPreviewUrl: null,
      inputInfo: null,
      outputInfo: null,
      error: null,
      progress: 0,
    });

    import("@/lib/imageProcessor")
      .then(({ getImageInfo }) => getImageInfo(file))
      .then((info) => {
        if (get().inputFile === file) {
          set({ inputInfo: info });
        }
      })
      .catch((error: unknown) => {
        if (get().inputFile === file) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Could not read image information.",
          });
        }
      });
  },

  setOutputBlob: (blob, fileName = "freeconvert-output.png") => {
    const state = get();
    revoke(state.outputPreviewUrl);

    const previewUrl = URL.createObjectURL(blob);
    set({
      outputBlob: blob,
      outputPreviewUrl: previewUrl,
      outputInfo: null,
      error: null,
    });

    readBlobInfo(blob, fileName)
      .then((info) => {
        if (get().outputBlob === blob) {
          set({ outputInfo: info });
        }
      })
      .catch(() => undefined);
  },

  clearOutput: () => {
    const state = get();
    revoke(state.outputPreviewUrl);
    set({
      outputBlob: null,
      outputPreviewUrl: null,
      outputInfo: null,
      progress: 0,
    });
  },

  addBatchFile: (file) => {
    const previewUrl = URL.createObjectURL(file);
    set((state) => ({
      batchFiles: [...state.batchFiles, file],
      batchPreviewUrls: [...state.batchPreviewUrls, previewUrl],
      error: null,
    }));
  },

  removeBatchFile: (index) => {
    const state = get();
    revoke(state.batchPreviewUrls[index] || null);
    set({
      batchFiles: state.batchFiles.filter((_, itemIndex) => itemIndex !== index),
      batchPreviewUrls: state.batchPreviewUrls.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  },

  reorderBatch: (from, to) => {
    const state = get();

    if (from === to || to < 0 || to >= state.batchFiles.length) {
      return;
    }

    const batchFiles = [...state.batchFiles];
    const batchPreviewUrls = [...state.batchPreviewUrls];
    const [file] = batchFiles.splice(from, 1);
    const [url] = batchPreviewUrls.splice(from, 1);

    if (!file || !url) {
      return;
    }

    batchFiles.splice(to, 0, file);
    batchPreviewUrls.splice(to, 0, url);
    set({ batchFiles, batchPreviewUrls });
  },

  clearBatch: () => {
    get().batchPreviewUrls.forEach((url) => revoke(url));
    set({ batchFiles: [], batchPreviewUrls: [] });
  },

  reset: () => {
    const state = get();
    revoke(state.inputPreviewUrl);
    revoke(state.outputPreviewUrl);
    state.batchPreviewUrls.forEach((url) => revoke(url));
    set({
      inputFile: null,
      inputPreviewUrl: null,
      outputBlob: null,
      outputPreviewUrl: null,
      batchFiles: [],
      batchPreviewUrls: [],
      isProcessing: false,
      progress: 0,
      error: null,
      inputInfo: null,
      outputInfo: null,
    });
  },

  setProcessing: (value) => set({ isProcessing: value }),
  setProgress: (value) => set({ progress: value }),
  setError: (message) => set({ error: message }),
}));
