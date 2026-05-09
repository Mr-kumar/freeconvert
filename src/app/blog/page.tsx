import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Image Editing Guides",
  description:
    "Simple guides for resizing, compressing and converting images for web uploads, online forms and everyday use.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
};

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className="max-w-3xl">
        <p className="text-sm font-bold text-[var(--accent)]">Guides</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--text)] sm:text-5xl">
          Image editing guides
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Practical notes for reducing file size, choosing formats and preparing
          images for forms without uploading your files.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
            href={`/blog/${post.slug}`}
            key={post.slug}
          >
            <p className="text-xs font-bold text-[var(--accent)]">
              {post.readTime}
            </p>
            <h2 className="mt-4 text-xl font-extrabold leading-7 text-[var(--text)]">
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {post.description}
            </p>
            <span className="mt-5 inline-flex text-sm font-bold text-[var(--accent)]">
              Read guide
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
