import Link from "next/link";
import {
  pdfToolConfigs,
  pdfTools,
  toolConfigs,
  tools,
} from "@/lib/tools";
import { getImageToolFaqs, getPdfToolFaqs } from "@/lib/toolFaqs";
import type { PDFToolSlug, ToolSlug } from "@/lib/types";

type ToolContentSlug = ToolSlug | PDFToolSlug;

interface ContentNotes {
  bestFor: string[];
  notes: string[];
}

const contentNotes: Partial<Record<ToolContentSlug, ContentNotes>> = {
  resize: {
    bestFor: [
      "Preparing photos for exam forms, job applications and profile uploads with exact width and height limits.",
      "Keeping proportions consistent when a portal asks for pixels, centimeters or a fixed maximum file size.",
    ],
    notes: [
      "Set dimensions before reducing file size so the final export keeps the right shape.",
      "For passport-style photos, check the face area and background after resizing before submitting the image.",
    ],
  },
  compress: {
    bestFor: [
      "Reducing JPG, PNG and WebP files for forms, email attachments and website uploads.",
      "Targeting a specific KB limit without sending the original image to a remote converter.",
    ],
    notes: [
      "Photos usually compress well as JPEG or WebP, while screenshots and transparent graphics often need PNG or WebP.",
      "If a strict KB target is hard to reach, reduce dimensions first and then compress.",
    ],
  },
  convert: {
    bestFor: [
      "Changing images between JPEG, PNG, WebP and AVIF for browser, design and upload compatibility.",
      "Creating a format that matches a portal requirement without changing the original file.",
    ],
    notes: [
      "Use PNG when transparency must be preserved.",
      "Use JPEG or WebP when small photo file size matters more than transparency.",
    ],
  },
  crop: {
    bestFor: [
      "Cutting photos to a fixed ratio for IDs, thumbnails, documents and social profiles.",
      "Removing extra background while keeping the selected subject centered.",
    ],
    notes: [
      "Use fixed ratios when a site expects a square, portrait or landscape image.",
      "Check the preview after cropping so important details are not outside the selected area.",
    ],
  },
  "rotate-flip": {
    bestFor: [
      "Correcting sideways images from phones, scanners and document captures.",
      "Mirroring images horizontally or vertically before sharing or submitting them.",
    ],
    notes: [
      "Use 90 degree steps for scanned documents and phone photos.",
      "Use a custom angle for small straightening adjustments.",
    ],
  },
  "background-removal": {
    bestFor: [
      "Creating transparent-background images for profile photos, catalog items and quick design work.",
      "Removing distracting backgrounds while keeping file processing on the device.",
    ],
    notes: [
      "Clear subject edges and good contrast usually produce cleaner background removal.",
      "Export as PNG when the transparent background must stay transparent.",
    ],
  },
  watermark: {
    bestFor: [
      "Adding ownership marks to photos, previews, certificates and shared image drafts.",
      "Placing text or logo watermarks with opacity, rotation and repeated tile options.",
    ],
    notes: [
      "Use lower opacity when the image content should remain easy to inspect.",
      "Use tiled watermarks for drafts that may be copied or shared outside your workflow.",
    ],
  },
  merge: {
    bestFor: [
      "Joining screenshots, product photos or document images into one side-by-side or grid image.",
      "Creating quick comparison sheets without opening a desktop editor.",
    ],
    notes: [
      "Use a grid layout for many images and a horizontal layout for before-after comparisons.",
      "Choose a neutral background color when the source images have different sizes.",
    ],
  },
  filters: {
    bestFor: [
      "Adjusting brightness, contrast, saturation and tone for photos before sharing or printing.",
      "Making quick visual corrections without installing a full image editor.",
    ],
    notes: [
      "Small brightness and contrast changes are usually better than extreme adjustments.",
      "Keep the original file if you may need to re-edit later.",
    ],
  },
  metadata: {
    bestFor: [
      "Checking dimensions, file size, camera details and EXIF data before publishing an image.",
      "Removing metadata by re-exporting an image when privacy matters.",
    ],
    notes: [
      "Metadata can include camera, software or date information depending on the source file.",
      "Re-exporting can remove many metadata fields while keeping visible pixels intact.",
    ],
  },
  "merge-pdf": {
    bestFor: [
      "Combining applications, certificates, invoices, notes and scanned PDFs into one ordered document.",
      "Creating a single PDF with optional size reduction after the merge.",
    ],
    notes: [
      "Arrange files in the final reading order before creating the output.",
      "Use compression when the merged file needs to fit an email or portal size limit.",
    ],
  },
  "compress-pdf": {
    bestFor: [
      "Reducing PDF size for email, government portals, job applications and document sharing.",
      "Targeting an approximate KB size when the original PDF contains large scanned pages.",
    ],
    notes: [
      "Compression works best on image-heavy or scanned PDFs.",
      "Very strong compression may make text less sharp, so use the preview result before submitting.",
    ],
  },
  "split-pdf": {
    bestFor: [
      "Separating a long PDF into single pages, fixed ranges or custom document sections.",
      "Saving only the parts needed for a form, email or archive.",
    ],
    notes: [
      "Use custom ranges when one PDF contains multiple certificates or records.",
      "For many outputs, download as a ZIP to keep the files organized.",
    ],
  },
  "convert-pdf-to-image": {
    bestFor: [
      "Exporting PDF pages as JPG, PNG or WebP images for previews, thumbnails and form uploads.",
      "Converting selected pages instead of exporting an entire document.",
    ],
    notes: [
      "Use PNG for sharp text or transparent-style graphics.",
      "Use JPG or WebP when smaller image files are more important.",
    ],
  },
  "convert-image-to-pdf": {
    bestFor: [
      "Turning photos, scans and screenshots into a single PDF document.",
      "Preparing image sets with page size, margin, fit and metadata controls.",
    ],
    notes: [
      "Use A4 or Letter for documents meant to print cleanly.",
      "Use match-image sizing when each source image should keep its natural page shape.",
    ],
  },
  "rotate-pdf": {
    bestFor: [
      "Fixing scanned pages that appear sideways or upside down in a PDF.",
      "Rotating only selected pages while leaving the rest of the document unchanged.",
    ],
    notes: [
      "Use 90 or 270 degrees for landscape-to-portrait corrections.",
      "Check page thumbnails before saving when a document mixes portrait and landscape pages.",
    ],
  },
  "add-watermark-to-pdf": {
    bestFor: [
      "Marking contracts, drafts, reports and shared documents as confidential or sample copies.",
      "Adding text or image watermarks to all pages or selected page ranges.",
    ],
    notes: [
      "Use a light opacity for readable documents.",
      "Place repeated or centered marks on drafts that should not be reused as final copies.",
    ],
  },
  "protect-pdf": {
    bestFor: [
      "Adding an open password to sensitive PDFs before sending or storing them.",
      "Restricting common permissions such as printing, copying and editing when supported by PDF viewers.",
    ],
    notes: [
      "Keep the password somewhere safe because the site does not store it.",
      "Permissions depend on PDF viewer behavior, so use a strong open password for real protection.",
    ],
  },
  "unlock-pdf": {
    bestFor: [
      "Removing password protection from PDFs when you already know the current password.",
      "Saving a document copy that opens faster for your own authorized files.",
    ],
    notes: [
      "This tool is not for cracking or bypassing unknown passwords.",
      "Use it only on files you own or have permission to modify.",
    ],
  },
  "extract-pdf-pages": {
    bestFor: [
      "Saving selected pages from a large PDF as a smaller document.",
      "Pulling certificates, forms, invoices or chapters out of a combined file.",
    ],
    notes: [
      "Visual selection helps avoid off-by-one page mistakes.",
      "Export separate PDFs when each selected page must be shared independently.",
    ],
  },
  "reorder-pdf-pages": {
    bestFor: [
      "Fixing scanned PDFs where pages were captured in the wrong order.",
      "Reversing, moving or organizing pages before sharing a final document.",
    ],
    notes: [
      "Check thumbnails after each move so the final reading sequence is correct.",
      "Use reset when you want to return to the original order before exporting.",
    ],
  },
  "add-page-numbers-to-pdf": {
    bestFor: [
      "Numbering reports, notes, contracts and multi-page PDFs before printing or sharing.",
      "Adding prefixes, suffixes and page positions that match a document style.",
    ],
    notes: [
      "Skip the first page when the PDF has a cover page.",
      "Use consistent margins so numbers do not overlap existing text.",
    ],
  },
  "view-pdf-metadata": {
    bestFor: [
      "Checking PDF title, author, page size, version and encryption status.",
      "Cleaning or editing metadata before publishing or sending a document.",
    ],
    notes: [
      "Metadata can reveal software, author or document history depending on the file.",
      "Clean metadata when sharing documents outside your organization.",
    ],
  },
};

function getRelatedTools(kind: "image" | "pdf", slug: ToolContentSlug) {
  const list = kind === "pdf" ? pdfTools : tools;
  return list.filter((tool) => tool.slug !== slug).slice(0, 4);
}

function fallbackNotes(kind: "image" | "pdf", tool: { name: string; features: string[] }) {
  const label = kind === "pdf" ? "PDF" : "image";

  return {
    bestFor: [
      `Completing ${tool.name.toLowerCase()} tasks quickly without installing desktop software.`,
      `Handling ${label} files privately because the selected files stay in your browser.`,
    ],
    notes: [
      tool.features[0] || "Check the preview or output before downloading the final file.",
      tool.features[1] || "Large files can take longer because processing happens on your device.",
    ],
  };
}

export function ToolContentSections({
  kind,
  slug,
}: {
  kind: "image";
  slug: ToolSlug;
} | {
  kind: "pdf";
  slug: PDFToolSlug;
}) {
  const tool = kind === "pdf" ? pdfToolConfigs[slug] : toolConfigs[slug];
  const notes = contentNotes[slug] ?? fallbackNotes(kind, tool);
  const faqs = kind === "pdf" ? getPdfToolFaqs(slug) : getImageToolFaqs(slug);
  const relatedTools = getRelatedTools(kind, slug);
  const categoryLabel = kind === "pdf" ? "PDF tool" : "Image tool";
  const fileLabel = kind === "pdf" ? "PDFs" : "images";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase text-[var(--accent)]">
            {categoryLabel}
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text)]">
            About {tool.name}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {tool.description} The work happens in your browser, so the selected
            {` ${fileLabel} `}stay on your device while you prepare the result.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {notes.bestFor.map((item) => (
              <p
                className="rounded-lg bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </article>

        <aside className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            What it includes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {tool.features.map((feature) => (
              <li className="flex gap-3" key={feature}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Practical notes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {notes.notes.map((note) => (
              <li className="flex gap-3" key={note}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Related tools
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {relatedTools.map((related) => (
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={related.href}
                key={related.href}
              >
                {related.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
          Common questions
        </h2>
        <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
          {faqs.map((faq) => (
            <article className="bg-[var(--surface-2)] p-5" key={faq.question}>
              <h3 className="text-sm font-extrabold leading-6 text-[var(--text)]">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
