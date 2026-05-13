import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";

interface ToolLayoutProps {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  backHref?: string;
  backLabel?: string;
  badgeLabel?: string;
  footer?: ReactNode;
}

export function ToolLayout({
  title,
  description,
  controls,
  preview,
  backHref = "/#image-tools",
  backLabel = "Image Tools",
  badgeLabel = "Browser only",
  footer,
}: ToolLayoutProps) {
  return (
    <main className="w-full max-w-full overflow-hidden bg-[var(--bg)] lg:min-h-[calc(100vh-64px)]">
      <section className="overflow-hidden bg-[var(--bg)]">
        <div className="mx-auto flex w-[min(358px,calc(100vw-2rem))] max-w-7xl flex-col gap-4 px-0 py-5 sm:w-full sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              href={backHref}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <h1 className="break-words font-display text-3xl font-extrabold text-[var(--text)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              {description}
            </p>
          </div>
          <div className="self-start rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)] lg:self-auto">
            {badgeLabel}
          </div>
        </div>
      </section>

      <AdSlot
        className="pb-5"
        format="horizontal"
        minHeight={90}
        minViewportWidth={640}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_TOP}
      />

      <section className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-5 overflow-hidden px-0 pb-10 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="mx-auto w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full overflow-visible rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:mx-0 sm:w-full lg:min-h-[calc(100vh-238px)] lg:overflow-hidden">
          {controls}
        </aside>
        <div className="mx-auto min-h-[320px] w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full rounded-2xl border border-[var(--border)] bg-white shadow-sm sm:mx-0 sm:w-full sm:min-h-[560px]">
          {preview}
        </div>
      </section>
      {footer}
    </main>
  );
}
