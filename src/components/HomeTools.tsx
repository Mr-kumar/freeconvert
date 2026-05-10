"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import {
  Crop,
  Eraser,
  FileArchive,
  FileImage,
  FileLock2,
  FileSearch,
  Grid3X3,
  ImageDown,
  ImagePlus,
  Layers,
  ListOrdered,
  Maximize,
  Minimize2,
  RefreshCw,
  RotateCw,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Stamp,
} from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { pdfTools, tools, type PDFToolConfig, type ToolConfig } from "@/lib/tools";
import type { PDFToolSlug, ToolSlug } from "@/lib/types";

type Category = "all" | "image" | "pdf";

const imageIconMap: Record<ToolSlug, ComponentType<{ className?: string }>> = {
  resize: Maximize,
  compress: ImageDown,
  convert: RefreshCw,
  crop: Crop,
  "rotate-flip": RefreshCw,
  "background-removal": Eraser,
  watermark: ImagePlus,
  merge: Grid3X3,
  filters: SlidersHorizontal,
  metadata: FileImage,
};

const pdfIconMap: Record<PDFToolSlug, ComponentType<{ className?: string }>> = {
  "merge-pdf": Layers,
  "compress-pdf": Minimize2,
  "split-pdf": Scissors,
  "convert-pdf-to-image": FileImage,
  "convert-image-to-pdf": ImagePlus,
  "rotate-pdf": RotateCw,
  "add-watermark-to-pdf": Stamp,
  "protect-pdf": ShieldCheck,
  "unlock-pdf": FileLock2,
  "extract-pdf-pages": FileArchive,
  "reorder-pdf-pages": Layers,
  "add-page-numbers-to-pdf": ListOrdered,
  "view-pdf-metadata": FileSearch,
};

function ToolCard({
  tool,
  category,
}: {
  tool: ToolConfig | PDFToolConfig;
  category: "image" | "pdf";
}) {
  const Icon =
    category === "image"
      ? imageIconMap[(tool as ToolConfig).slug]
      : pdfIconMap[(tool as PDFToolConfig).slug];

  return (
    <Link
      className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
      href={tool.href}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f0] text-[var(--accent)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-[var(--text)]">
        {tool.shortName}
      </h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
        {tool.homeDescription}
      </p>
      <span className="mt-5 inline-flex text-sm font-bold text-[var(--accent)]">
        Open tool
      </span>
    </Link>
  );
}

function ToolSection({
  title,
  tools: items,
  category,
}: {
  title: string;
  tools: (ToolConfig | PDFToolConfig)[];
  category: "image" | "pdf";
}) {
  return (
    <section className="mt-10" id={`${category}-tools`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--text)]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Browser-only tools. No upload and no account required.
          </p>
        </div>
        {category === "pdf" ? (
          <Link
            className="hidden text-sm font-bold text-[var(--accent)] sm:inline-flex"
            href="/pdf-tools"
          >
            View PDF hub
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((tool) => (
          <ToolCard category={category} key={`${category}-${tool.slug}`} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export function HomeTools() {
  const [category, setCategory] = useState<Category>("all");
  const popular = [
    pdfTools.find((tool) => tool.slug === "merge-pdf"),
    tools.find((tool) => tool.slug === "compress"),
    tools.find((tool) => tool.slug === "background-removal"),
    pdfTools.find((tool) => tool.slug === "convert-pdf-to-image"),
    pdfTools.find((tool) => tool.slug === "compress-pdf"),
  ].filter(Boolean) as (ToolConfig | PDFToolConfig)[];
  const pdfHrefSet = new Set(pdfTools.map((tool) => tool.href));

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-wrap justify-center gap-2">
        {[
          ["all", "All"],
          ["image", "Image"],
          ["pdf", "PDF"],
        ].map(([value, label]) => (
          <button
            className={`segmented-button min-w-24 ${category === value ? "segmented-button-active" : ""}`}
            key={value}
            type="button"
            onClick={() => setCategory(value as Category)}
          >
            {label}
          </button>
        ))}
      </div>

      {category === "all" ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold text-[var(--text)]">
            Most Popular Tools
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {popular.map((tool) => (
              <ToolCard
                category={pdfHrefSet.has(tool.href) ? "pdf" : "image"}
                key={tool.href}
                tool={tool}
              />
            ))}
          </div>
        </section>
      ) : null}

      {category === "all" ? (
        <AdSlot
          className="mt-10 px-0 sm:px-0"
          minHeight={96}
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID}
        />
      ) : null}

      {category === "all" || category === "image" ? (
        <ToolSection category="image" title="Image Tools" tools={tools} />
      ) : null}

      {category === "all" || category === "pdf" ? (
        <ToolSection category="pdf" title="PDF Tools" tools={pdfTools} />
      ) : null}

      <div className="mt-10 grid gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:grid-cols-3">
        {[
          ["Private", "Files stay in your browser."],
          ["Fast", "Canvas, WebAssembly and PDF workers power the tools."],
          ["Simple", "Set options and save the result."],
        ].map(([title, description]) => (
          <div className="rounded-xl bg-[var(--surface-2)] p-5" key={title}>
            <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
