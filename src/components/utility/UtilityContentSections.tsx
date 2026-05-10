import Link from "next/link";
import {
  utilityCategoryConfigs,
  utilityToolConfigs,
  utilityTools,
  type UtilityToolSlug,
} from "@/lib/utilityTools";

function getRelatedUtilityTools(slug: UtilityToolSlug) {
  const tool = utilityToolConfigs[slug];
  const sameCategory = utilityTools.filter(
    (item) => item.category === tool.category && item.slug !== slug,
  );
  const fallback = utilityTools.filter((item) => item.slug !== slug);

  return (sameCategory.length ? sameCategory : fallback).slice(0, 4);
}

export function UtilityContentSections({ slug }: { slug: UtilityToolSlug }) {
  const tool = utilityToolConfigs[slug];
  const category = utilityCategoryConfigs[tool.category];
  const relatedTools = getRelatedUtilityTools(slug);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase text-[var(--accent)]">
            {category.label}
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text)]">
            About {tool.name}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {tool.description} The work happens in your browser, so your input
            stays on your device while you prepare the result.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {tool.bestFor.map((item) => (
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
            {tool.notes.map((note) => (
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
          {tool.faqs.map((faq) => (
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
