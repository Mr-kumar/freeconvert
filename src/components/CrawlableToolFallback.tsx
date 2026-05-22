import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function CrawlableToolFallback({
  backHref,
  backLabel,
  badgeLabel,
  description,
  features,
  title,
}: {
  backHref: string;
  backLabel: string;
  badgeLabel: string;
  description: string;
  features: string[];
  title: string;
}) {
  return (
    <main className="w-full max-w-full overflow-hidden bg-[var(--bg)] lg:min-h-[calc(100vh-64px)]">
      <section className="bg-[var(--bg)]">
        <div className="mx-auto flex w-[min(358px,calc(100vw-2rem))] max-w-7xl flex-col gap-4 px-0 py-5 sm:w-full sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
              href={backHref}
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

      <section className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-5 overflow-hidden px-0 pb-10 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="mx-auto w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:mx-0 sm:w-full">
          <h2 className="text-sm font-extrabold text-[var(--text)]">
            What this tool includes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {features.map((feature) => (
              <li className="flex gap-3" key={feature}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </aside>
        <article className="mx-auto w-[min(358px,calc(100vw-2rem))] min-w-0 max-w-full rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:mx-0 sm:w-full sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Browser-based processing
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            The interactive editor loads in JavaScript so files can be handled
            locally in the browser. Once the editor is ready, add your file,
            choose the settings you need, preview the result and download a new
            copy without changing the original.
          </p>
          <noscript>
            <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
              JavaScript is required to use this tool because the file
              processing runs on your device instead of a remote upload server.
            </p>
          </noscript>
        </article>
      </section>
    </main>
  );
}
