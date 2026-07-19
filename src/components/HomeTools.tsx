import Link from "next/link";
import type { ComponentType } from "react";
import {
  Braces,
  Calculator,
  FileArchive,
  FileImage,
  FileText,
  ImageDown,
  KeyRound,
  Layers,
  Palette,
  QrCode,
  Ruler,
  Scissors,
  Search,
  Sparkles,
  Type,
  Video,
} from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { pdfTools, tools, type PDFToolConfig, type ToolConfig } from "@/lib/tools";
import {
  popularUtilityTools,
  utilityCategoryConfigs,
  utilityTools,
  type UtilityCategoryConfig,
  type UtilityToolConfig,
} from "@/lib/utilityTools";

type AnyTool = ToolConfig | PDFToolConfig | UtilityToolConfig;

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  image: FileImage,
  pdf: FileText,
  qr: QrCode,
  text: Type,
  calculator: Calculator,
  color: Palette,
  converter: Ruler,
  password: KeyRound,
  developer: Braces,
  html: Braces,
  file: FileArchive,
  media: Video,
};

const popularIconMap: Record<string, ComponentType<{ className?: string }>> = {
  "compress-image": ImageDown,
  "merge-pdf": Layers,
  "split-pdf": Scissors,
  "qr-code-generator": QrCode,
  "word-counter": Type,
  "json-formatter": Braces,
  "html-to-pdf": Braces,
  "html-viewer": Braces,
  "password-generator": KeyRound,
  "emi-calculator": Calculator,
  "heic-to-jpg": FileImage,
  "image-to-text": Type,
  "video-compressor": Video,
  "mp4-to-mp3": Video,
  "bmi-calculator": Calculator,
  "edit-pdf": FileText,
};

function toolKey(tool: AnyTool) {
  return tool.href.replace(/^\//, "");
}

function CategoryCard({
  id,
  title,
  description,
  tools: items,
  anchorId,
}: {
  id: string;
  title: string;
  description: string;
  tools: AnyTool[];
  anchorId?: string;
}) {
  const Icon = categoryIconMap[id] || Sparkles;
  const visibleTools = items.slice(0, 4);
  const hiddenTools = items.slice(4);

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      id={anchorId}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fff1f0] text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-[var(--text)]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5 grid flex-1 content-start gap-2">
        {visibleTools.map((tool) => (
          <Link
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            href={tool.href}
            key={tool.href}
          >
            {tool.name}
          </Link>
        ))}
      </div>
      {hiddenTools.length > 0 ? (
        <details className="group mt-5">
          <summary className="inline-flex cursor-pointer list-none text-sm font-extrabold text-[var(--accent)] transition-colors hover:text-[var(--accent-dim)] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">View all {items.length} tools</span>
            <span className="hidden group-open:inline">Show fewer</span>
          </summary>
          <div className="mt-3 grid gap-2">
            {hiddenTools.map((tool) => (
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={tool.href}
                key={tool.href}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}

function PopularToolCard({ tool }: { tool: AnyTool }) {
  const key = toolKey(tool);
  const Icon = popularIconMap[key] || Search;

  return (
    <Link
      className="group rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
      href={tool.href}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff1f0] text-[var(--accent)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-base font-extrabold text-[var(--text)]">
        {tool.shortName}
      </h3>
      <p className="mt-2 min-h-10 text-sm leading-5 text-[var(--muted)]">
        {tool.homeDescription}
      </p>
    </Link>
  );
}

function utilityCategoryCard(category: UtilityCategoryConfig) {
  return {
    id: category.id,
    title: category.title,
    description: category.description,
    anchorId: category.anchor,
    tools: utilityTools.filter((tool) => tool.category === category.id),
  };
}

export function HomeTools() {
  const popular = [
    pdfTools.find((tool) => tool.slug === "merge-pdf"),
    utilityTools.find((tool) => tool.slug === "html-to-pdf"),
    utilityTools.find((tool) => tool.slug === "html-viewer"),
    tools.find((tool) => tool.slug === "heic-to-jpg"),
    tools.find((tool) => tool.slug === "compress"),
    utilityTools.find((tool) => tool.slug === "character-counter"),
    utilityTools.find((tool) => tool.slug === "qr-code-generator"),
    pdfTools.find((tool) => tool.slug === "edit-pdf"),
    pdfTools.find((tool) => tool.slug === "compress-pdf"),
    ...popularUtilityTools.filter(
      (tool) =>
        tool.slug === "video-compressor" ||
        tool.slug === "mp4-to-mp3",
    ),
  ].filter(Boolean) as AnyTool[];

  const categories = [
    {
      id: "image",
      title: "Free Image Tools",
      description: "Resize, compress, convert, crop and edit images.",
      anchorId: "image-tools",
      tools,
    },
    {
      id: "pdf",
      title: "Free PDF Tools",
      description: "Merge, compress, split, convert and organize PDFs.",
      anchorId: "pdf-tools",
      tools: pdfTools,
    },
    utilityCategoryCard(utilityCategoryConfigs.qr),
    utilityCategoryCard(utilityCategoryConfigs.text),
    utilityCategoryCard(utilityCategoryConfigs.calculator),
    utilityCategoryCard(utilityCategoryConfigs.color),
    utilityCategoryCard(utilityCategoryConfigs.converter),
    utilityCategoryCard(utilityCategoryConfigs.password),
    utilityCategoryCard(utilityCategoryConfigs.developer),
    utilityCategoryCard(utilityCategoryConfigs.html),
    utilityCategoryCard(utilityCategoryConfigs.file),
    utilityCategoryCard(utilityCategoryConfigs.media),
  ];

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex flex-col items-start gap-3 min-[420px]:mb-5 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-[var(--accent)]">
              Start fast
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-[var(--text)]">
              Popular free tools
            </h2>
          </div>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-extrabold text-[var(--accent)] shadow-sm transition-colors hover:border-[#f3b5b1] hover:bg-[#fff7f6]"
            href="/search"
          >
            <Search className="h-4 w-4" />
            Search tools
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.slice(0, 8).map((tool) => (
            <PopularToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <AdSlot
        className="mt-10"
        minHeight={96}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID}
      />

      <section className="mt-12 bg-[var(--surface-2)] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-5">
            <p className="text-xs font-extrabold uppercase text-[var(--accent)]">
              Browse by category
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--text)]">
              Organized tools for files, text and daily work
            </h2>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                description={category.description}
                id={category.id}
                key={category.id}
                anchorId={category.anchorId}
                title={category.title}
                tools={category.tools}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase text-[var(--accent)]">
              Built for everyday files
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-[var(--text)]">
              Practical tools with clear pages and local processing
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              FreeConvert focuses on small tasks people repeat often: preparing
              images for upload forms, reducing PDF file size, extracting text,
              previewing HTML code, generating QR codes and checking values in simple calculators.
              Each tool page explains what it does, when to use it and what to
              check before downloading the result.
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The tools are organized for practical workflows rather than one
              long upload queue. You can resize a photo before compression,
              merge a PDF before reducing size, generate a QR code for a link
              or UPI payment, preview and convert HTML code, and use developer utilities for quick checks
              without leaving the browser.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article>
              <h3 className="text-base font-extrabold text-[var(--text)]">
                Private by design
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Supported image, PDF, HTML, text, QR, calculator and developer tools
                run directly in the browser. That keeps common files on the
                device and avoids forcing a signup for quick work.
              </p>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-[var(--text)]">
                Organized for review
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                The site includes direct tool URLs, category navigation,
                practical notes, related tools, common questions and guides so
                visitors can understand the right workflow before processing a
                file.
              </p>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-[var(--text)]">
                Built for upload rules
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Image and PDF pages include notes for dimensions, target KB,
                page order, format compatibility and final review so files are
                easier to prepare for strict forms and email limits.
              </p>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-[var(--text)]">
                Guides included
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                The guide section covers compression, image formats, PDF
                security, QR codes, OCR, video size and common upload problems
                that users should understand before submitting files.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Private", "Image, PDF and utility tools run in your browser."],
            ["Direct URLs", "Each tool uses a clean SEO slug like /qr-code-generator."],
            ["Fast", "Only the selected tool loads the heavier browser libraries."],
          ].map(([title, description]) => (
            <div
              className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm"
              key={title}
            >
              <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
