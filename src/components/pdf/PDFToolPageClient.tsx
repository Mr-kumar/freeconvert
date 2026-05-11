"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { PDFToolSlug, ToolDefaults } from "@/lib/types";

interface PDFToolClientProps {
  defaults: ToolDefaults;
}

interface PDFToolPageClientProps extends PDFToolClientProps {
  slug: PDFToolSlug;
}

function PDFToolClientLoading() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-28 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-44 animate-pulse rounded bg-[var(--surface-2)]" />
      </aside>
      <section className="h-[560px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
    </main>
  );
}

const pdfToolClients: Record<PDFToolSlug, ComponentType<PDFToolClientProps>> = {
  "merge-pdf": dynamic(() => import("./tools/MergePDFClient").then((mod) => mod.MergePDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "compress-pdf": dynamic(() => import("./tools/CompressPDFClient").then((mod) => mod.CompressPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "split-pdf": dynamic(() => import("./tools/SplitPDFClient").then((mod) => mod.SplitPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "convert-pdf-to-image": dynamic(() => import("./tools/PDFToImageClient").then((mod) => mod.PDFToImageClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "convert-image-to-pdf": dynamic(() => import("./tools/ImageToPDFClient").then((mod) => mod.ImageToPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "rotate-pdf": dynamic(() => import("./tools/RotatePDFClient").then((mod) => mod.RotatePDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "add-watermark-to-pdf": dynamic(() => import("./tools/WatermarkPDFClient").then((mod) => mod.WatermarkPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "protect-pdf": dynamic(() => import("./tools/ProtectPDFClient").then((mod) => mod.ProtectPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "unlock-pdf": dynamic(() => import("./tools/UnlockPDFClient").then((mod) => mod.UnlockPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "extract-pdf-pages": dynamic(() => import("./tools/ExtractPDFPagesClient").then((mod) => mod.ExtractPDFPagesClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "reorder-pdf-pages": dynamic(() => import("./tools/ReorderPDFPagesClient").then((mod) => mod.ReorderPDFPagesClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "add-page-numbers-to-pdf": dynamic(() => import("./tools/PageNumbersPDFClient").then((mod) => mod.PageNumbersPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
  "view-pdf-metadata": dynamic(() => import("./tools/MetadataPDFClient").then((mod) => mod.MetadataPDFClient), {
    loading: PDFToolClientLoading,
    ssr: false,
  }),
};

export function PDFToolPageClient({ slug, defaults }: PDFToolPageClientProps) {
  const Client = pdfToolClients[slug];
  return <Client defaults={defaults} />;
}
