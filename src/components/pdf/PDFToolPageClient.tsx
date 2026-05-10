"use client";

import dynamic from "next/dynamic";
import type { PDFToolSlug, ToolDefaults } from "@/lib/types";

interface PDFToolClientProps {
  slug: PDFToolSlug;
  defaults: ToolDefaults;
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

const Client = dynamic(
  () => import("./PDFToolClient").then((mod) => mod.PDFToolClient),
  {
    loading: PDFToolClientLoading,
    ssr: false,
  },
);

export function PDFToolPageClient({ slug, defaults }: PDFToolClientProps) {
  return <Client defaults={defaults} slug={slug} />;
}
