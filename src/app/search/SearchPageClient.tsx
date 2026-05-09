"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, FileImage, Search, Wrench } from "lucide-react";
import { tools } from "@/lib/tools";
import {
  popularSearches,
  searchSite,
  type SearchResult,
} from "@/lib/search";

const iconMap: Record<SearchResult["category"], typeof Wrench> = {
  Tool: Wrench,
  Guide: BookOpen,
  Page: FileImage,
};

function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const Icon = iconMap[result.category];

  return (
    <Link
      className="group flex gap-4 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
      href={result.href}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1f0] text-[var(--accent)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">
            {result.category}
          </span>
        </span>
        <span className="mt-2 block text-lg font-extrabold text-[var(--text)]">
          {result.title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
          {result.description}
        </span>
      </span>
      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
    </Link>
  );
}

export default function SearchPageClient({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(
    () => (query.trim().length > 0 ? searchSite(query, 12) : []),
    [query],
  );

  /* Auto-focus input */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasQuery = query.trim().length > 0;

  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero + search */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold text-[var(--accent)]">Search</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--text)] sm:text-5xl">
          Search FreeConvert
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Find image tools and guides for size, format, compression, background
          removal and editing.
        </p>

        <div className="relative mx-auto mt-8 max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm transition-shadow focus-within:shadow-lg focus-within:shadow-slate-200/70">
            <Search className="ml-3 h-5 w-5 shrink-0 text-[var(--muted)]" />
            <input
              ref={inputRef}
              className="h-12 flex-1 bg-transparent text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              maxLength={80}
              placeholder="Type to search... resize, compress, jpg..."
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {hasQuery ? (
              <button
                className="rounded-lg px-3 py-2 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                type="button"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Results or default content */}
      {hasQuery ? (
        <section className="mx-auto mt-10 max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-[var(--text)]">
              {results.length
                ? `${results.length} result${results.length === 1 ? "" : "s"}`
                : "No results"}
            </h2>
            {results.length > 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Showing matches for &ldquo;{query.trim()}&rdquo;
              </p>
            ) : null}
          </div>

          {results.length > 0 ? (
            <div className="grid gap-3">
              {results.map((result, i) => (
                <ResultCard key={result.href} result={result} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
              <p className="text-base font-bold text-[var(--text)]">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Try shorter terms like compress, resize, or background removal.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="segmented-button"
                    type="button"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Popular searches */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-[var(--text)]">
                Popular searches
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    className="segmented-button"
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools quick links */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-[var(--text)]">
                Tools
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {tools.map((tool) => (
                  <Link
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-bold text-[var(--text)] transition-colors hover:border-[#f3b5b1] hover:text-[var(--accent)]"
                    href={tool.href}
                    key={tool.slug}
                  >
                    {tool.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
