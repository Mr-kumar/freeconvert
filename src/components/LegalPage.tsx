import type { ReactNode } from "react";
import { absoluteUrl } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export function LegalPage({
  title,
  updated = "May 9, 2026",
  description,
  path,
  schemaType = "WebPage",
  children,
}: {
  title: string;
  updated?: string;
  description?: string;
  path?: string;
  schemaType?: "WebPage" | "AboutPage" | "ContactPage";
  children: ReactNode;
}) {
  const parsedUpdated = new Date(updated);
  const dateModified = Number.isNaN(parsedUpdated.getTime())
    ? updated
    : parsedUpdated.toISOString().slice(0, 10);
  const jsonLd = path
    ? {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: title,
        description,
        url: absoluteUrl(path),
        dateModified,
        publisher: {
          "@type": "Organization",
          name: "FreeConvert",
          url: absoluteUrl("/"),
        },
      }
    : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      ) : null}
      <p className="text-sm font-semibold text-[var(--accent)]">
        Last updated: {updated}
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold text-[var(--text)] sm:text-6xl">
        {title}
      </h1>
      <div className="prose-freeconvert mt-8 space-y-8">{children}</div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-[var(--text)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">
        {children}
      </div>
    </section>
  );
}
