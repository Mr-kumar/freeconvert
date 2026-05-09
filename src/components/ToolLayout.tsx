import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  footer?: ReactNode;
}

export function ToolLayout({
  title,
  description,
  controls,
  preview,
  footer,
}: ToolLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[var(--bg)]">
      <section className="bg-[var(--bg)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Tools
            </Link>
            <h1 className="font-display text-3xl font-extrabold text-[var(--text)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              {description}
            </p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]">
            Browser only
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm lg:min-h-[calc(100vh-238px)]">
          {controls}
        </aside>
        <div className="min-h-[560px] rounded-2xl border border-[var(--border)] bg-white shadow-sm">
          {preview}
        </div>
      </section>
      {footer}
    </main>
  );
}
