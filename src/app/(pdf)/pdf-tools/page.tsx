import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileArchive,
  FileImage,
  FileLock2,
  FileSearch,
  FileText,
  ImagePlus,
  Layers,
  ListOrdered,
  Minimize2,
  RotateCw,
  Scissors,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { BASE_URL, pdfTools } from "@/lib/tools";
import type { PDFToolSlug } from "@/lib/types";
import { safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Online PDF Tools - Merge, Compress, Split & Convert",
  description:
    "Use free online PDF tools to merge, compress, split, convert, rotate, watermark, protect and inspect PDFs in your browser. No upload required.",
  keywords: [
    "pdf tools online free",
    "merge pdf online",
    "compress pdf online",
    "pdf to jpg",
    "jpg to pdf",
  ],
  alternates: { canonical: `${BASE_URL}/pdf-tools` },
  openGraph: {
    title: "Free Online PDF Tools - Merge, Compress, Split & Convert | FreeConvert",
    description:
      "Free private PDF tools for merge, compress, split, convert, rotate, watermark and more. No upload required.",
    url: `${BASE_URL}/pdf-tools`,
    siteName: "FreeConvert",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools - Merge, Compress, Split & Convert | FreeConvert",
    description:
      "Merge, compress, split, convert, rotate and watermark PDFs online free in your browser.",
    images: ["/opengraph-image"],
  },
};

const pdfHubJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE_URL}/pdf-tools#tools`,
  name: "PDF Tools Online Free",
  url: `${BASE_URL}/pdf-tools`,
  description:
    "Browse free browser-based PDF tools for merging, compressing, splitting, converting, rotating and watermarking PDFs.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: pdfTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${BASE_URL}${tool.href}`,
    })),
  },
};

const pdfHubBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "FreeConvert",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Free PDF Tools",
      item: `${BASE_URL}/pdf-tools`,
    },
  ],
};

const iconMap: Record<PDFToolSlug, typeof FileText> = {
  "merge-pdf": Layers,
  "compress-pdf": Minimize2,
  "split-pdf": Scissors,
  "convert-pdf-to-image": FileImage,
  "convert-image-to-pdf": ImagePlus,
  "jpg-to-pdf": ImagePlus,
  "png-to-pdf": ImagePlus,
  "heic-to-pdf": ImagePlus,
  "rotate-pdf": RotateCw,
  "add-watermark-to-pdf": Stamp,
  "protect-pdf": ShieldCheck,
  "unlock-pdf": FileLock2,
  "extract-pdf-pages": FileArchive,
  "delete-pages-from-pdf": Scissors,
  "reorder-pdf-pages": Layers,
  "edit-pdf": FileText,
  "sign-pdf": Stamp,
  "crop-pdf": Scissors,
  "pdf-to-text": FileText,
  "redact-pdf": ShieldCheck,
  "add-page-numbers-to-pdf": ListOrdered,
  "view-pdf-metadata": FileSearch,
};

function PDFToolCard({
  slug,
  large = false,
}: {
  slug: PDFToolSlug;
  large?: boolean;
}) {
  const tool = pdfTools.find((item) => item.slug === slug);

  if (!tool) {
    return null;
  }

  const Icon = iconMap[tool.slug];

  return (
    <Link
      className="group rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
      href={tool.href}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f0] text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
      </div>
      <h2
        className={
          large
            ? "mt-6 text-2xl font-extrabold text-[var(--text)]"
            : "mt-5 text-lg font-extrabold text-[var(--text)]"
        }
      >
        {tool.name}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {tool.homeDescription}
      </p>
    </Link>
  );
}

export default function PDFHubPage() {
  const popular = pdfTools.filter((tool) => tool.popular);
  const rest = pdfTools.filter((tool) => !tool.popular);

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pdfHubJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pdfHubBreadcrumbJsonLd) }}
      />
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]">
            PDF files stay on your device
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-6xl">
            PDF Tools - Free, Fast, Private
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Merge, compress, split, convert, rotate, watermark and inspect PDF
            files directly in your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-extrabold text-[var(--text)]">
            Most Popular
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {popular.map((tool) => (
              <PDFToolCard key={tool.slug} large slug={tool.slug} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--text)]">
            All PDF Tools
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((tool) => (
              <PDFToolCard key={tool.slug} slug={tool.slug} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
