import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import {
  utilityCategoryConfigs,
  utilityToolConfigs,
  utilityTools,
  type UtilityToolConfig,
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

function joinList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const categoryGuideLinks: Partial<Record<UtilityToolConfig["category"], string[]>> = {
  qr: ["a-complete-guide-to-qr-codes-types-uses-and-best-practices"],
  text: ["browser-based-file-tools-privacy"],
  calculator: ["file-upload-size-limits-checklist"],
  color: ["browser-based-file-tools-privacy"],
  converter: ["file-upload-size-limits-checklist"],
  password: ["browser-based-file-tools-privacy"],
  developer: ["browser-based-file-tools-privacy"],
  file: ["browser-based-file-tools-privacy", "file-upload-size-limits-checklist"],
  media: ["video-compression-basics-formats-bitrates-and-quality"],
};

function buildUtilityGuide(tool: UtilityToolConfig) {
  const featureSummary = joinList(tool.features.slice(0, 3));
  const firstUse = tool.bestFor[0]?.replace(/\.$/, "").toLowerCase();
  const secondUse = tool.bestFor[1]?.replace(/\.$/, "").toLowerCase();

  return {
    whenToUse: [
      `Use ${tool.name} when you need ${firstUse || tool.homeDescription.toLowerCase()}. ${tool.description} The page is designed as a direct work surface, so you can reach the tool, understand the inputs and finish the task without creating an account.`,
      `Before entering data, check the exact result you need and whether the output will be copied, downloaded, printed or submitted elsewhere. The most useful controls for this tool are ${featureSummary}, which helps you avoid repeating the same work in another app.`,
      secondUse
        ? `This tool is also useful for ${secondUse}. Because the work runs in the browser, it is a good fit for routine checks, drafts and small private inputs that do not need a cloud account or shared workspace.`
        : `Because the work runs in the browser, it is a good fit for routine checks, drafts and small private inputs that do not need a cloud account or shared workspace.`,
      `After creating the result, review the visible output before using it in a payment flow, document, design, message, code snippet or calculation. Small mistakes in copied text, numbers, colors, units or encoded data can create larger problems after the result is shared.`,
    ],
    commonMistakes: [
      `Using ${tool.name} without checking the destination requirement first.`,
      "Copying the first result without reviewing spelling, numbers, units or formatting.",
      tool.notes[0] ?? "Ignoring the tool notes before using the output in another workflow.",
      "Clearing the page before saving or copying the final result.",
    ],
    tips: [
      tool.notes[0] ?? "Start with clean input for the most reliable result.",
      tool.notes[1] ?? "Review the output before copying or downloading it.",
      "Keep source values nearby when the result will be used in a form or document.",
      "Use related tools from the same category when the task has another preparation step.",
    ],
    relatedGuideSlugs: categoryGuideLinks[tool.category] ?? [
      "browser-based-file-tools-privacy",
    ],
  };
}

function getRelatedGuides(slugs: string[]) {
  return slugs
    .map((guideSlug) => blogPosts.find((post) => post.slug === guideSlug))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post))
    .slice(0, 3);
}

export function UtilityContentSections({ slug }: { slug: UtilityToolSlug }) {
  const tool = utilityToolConfigs[slug];
  const category = utilityCategoryConfigs[tool.category];
  const relatedTools = getRelatedUtilityTools(slug);
  const guide = buildUtilityGuide(tool);
  const relatedGuides = getRelatedGuides(guide.relatedGuideSlugs);
  const steps = [
    `Open ${tool.name} and enter the values or text needed for the task.`,
    "Adjust the available options and review the result in the preview area.",
    "Copy or download the result without creating an account.",
  ];

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

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            How to use {tool.name}
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {steps.map((step, index) => (
              <li className="flex gap-3" key={step}>
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-extrabold text-[var(--accent)]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

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
          When to use {tool.name}
        </h2>
        <div className="mt-4 space-y-4">
          {guide.whenToUse.map((paragraph) => (
            <p
              className="text-sm leading-7 text-[var(--muted)]"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Common mistakes to avoid
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {guide.commonMistakes.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Practical tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {guide.tips.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedGuides.length ? (
        <section className="mt-5 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Related guides
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {relatedGuides.map((guidePost) => (
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-bold leading-6 text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={`/blog/${guidePost.slug}`}
                key={guidePost.slug}
              >
                {guidePost.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
