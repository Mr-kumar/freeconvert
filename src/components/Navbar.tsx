"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ComponentType,
} from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Crop,
  Eraser,
  FileImage,
  Grid3X3,
  ImageDown,
  ImagePlus,
  Maximize,
  Menu,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { tools, type ToolConfig } from "@/lib/tools";
import { searchSite, popularSearches, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";

/* ── Icon maps ── */

const toolIconMap: Record<string, ComponentType<{ className?: string }>> = {
  resize: Maximize,
  compress: ImageDown,
  convert: RefreshCw,
  crop: Crop,
  "rotate-flip": RefreshCw,
  "background-removal": Eraser,
  watermark: ImagePlus,
  merge: Grid3X3,
  filters: SlidersHorizontal,
  metadata: FileImage,
};

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Tool: Wrench,
  Guide: BookOpen,
  Page: FileImage,
};

/* ── Tool card for All‑Tools modal ── */

function ToolMenuItem({
  tool,
  onNavigate,
}: {
  tool: ToolConfig;
  onNavigate?: () => void;
}) {
  const Icon = toolIconMap[tool.slug] || Sparkles;

  return (
    <Link
      className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[#f3b5b1] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      href={tool.href}
      role="menuitem"
      onClick={onNavigate}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff1f0] text-[var(--accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-[var(--text)]">
          {tool.shortName}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
          {tool.homeDescription}
        </span>
      </span>
    </Link>
  );
}

/* ── All‑Tools centered modal ── */

function ToolsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      aria-labelledby="tools-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      id="tools-dialog"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl animate-[dialogIn_200ms_ease-out] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2
              className="text-lg font-extrabold text-[var(--text)] sm:text-xl"
              id="tools-dialog-title"
            >
              All image tools
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Choose a tool. Everything runs locally in your browser.
            </p>
          </div>
          <button
            aria-label="Close tools"
            className="icon-button shrink-0"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain p-4 sm:p-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="menu">
            {tools.map((tool) => (
              <ToolMenuItem key={tool.slug} tool={tool} onNavigate={onClose} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live search command palette ── */

function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* Lock scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Live search on every keystroke */
  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    if (value.trim().length > 0) {
      setResults(searchSite(value, 8));
    } else {
      setResults([]);
    }
  }

  /* Navigate to result */
  function go(href: string) {
    onClose();
    router.push(href);
  }

  /* Keyboard nav */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex].href);
    }
  }

  if (!open) return null;

  const showPopular = query.trim().length === 0;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm sm:pt-[18vh]"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl animate-[dialogIn_200ms_ease-out] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-[var(--muted)]" />
          <input
            ref={inputRef}
            className="h-8 flex-1 bg-transparent text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            placeholder="Search tools, guides, formats..."
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)] sm:block">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
          {/* Popular searches when empty */}
          {showPopular ? (
            <div className="p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    type="button"
                    onClick={() => handleChange(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Quick links
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {tools.slice(0, 6).map((tool) => {
                  const Icon = toolIconMap[tool.slug] || Sparkles;
                  return (
                    <button
                      key={tool.slug}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent)]"
                      type="button"
                      onClick={() => go(tool.href)}
                    >
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                      {tool.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2" role="listbox">
              {results.map((result, i) => {
                const Icon = categoryIconMap[result.category] || FileImage;
                return (
                  <li key={result.href} role="option" aria-selected={i === activeIndex}>
                    <button
                      className={cn(
                        "flex w-full items-center gap-4 px-5 py-3 text-left transition-colors",
                        i === activeIndex
                          ? "bg-[#fff1f0] text-[var(--accent)]"
                          : "hover:bg-[var(--surface-2)]",
                      )}
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(result.href)}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          i === activeIndex
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface-2)] text-[var(--muted)]",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[var(--text)]">
                          {result.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                          {result.description}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">
                        {result.category}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-bold text-[var(--text)]">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Try resize, compress, convert, or background removal
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-2)] px-5 py-2.5">
          <div className="flex items-center gap-3 text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--border)] bg-white px-1 py-px font-mono">↑</kbd>
              <kbd className="rounded border border-[var(--border)] bg-white px-1 py-px font-mono">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-px font-mono">↵</kbd>
              open
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[var(--muted)]">
            {results.length > 0 ? `${results.length} results` : "FreeConvert"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Navbar ── */

export function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeAll = useCallback(() => {
    setToolsOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const openTools = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setToolsOpen(true);
  }, []);

  const openSearch = useCallback(() => {
    setMobileOpen(false);
    setToolsOpen(false);
    setSearchOpen(true);
  }, []);

  /* Escape closes, Cmd+K opens search */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-extrabold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            aria-label="FreeConvert home"
            onClick={closeAll}
          >
            Free<span className="text-[var(--accent)]">Convert</span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-5 md:flex"
            aria-label="Primary"
          >
            <button
              aria-controls="tools-dialog"
              aria-expanded={toolsOpen}
              aria-haspopup="dialog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]"
              type="button"
              onClick={openTools}
            >
              All Tools
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  toolsOpen && "rotate-180",
                )}
              />
            </button>
            <Link
              href="/about"
              className="text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]"
            >
              Contact
            </Link>
          </nav>

          {/* Right side — search + badge + hamburger */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:px-3"
              type="button"
              onClick={openSearch}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="w-16 text-left sm:w-24">Search...</span>
              <kbd className="hidden rounded border border-[var(--border)] bg-white px-1.5 py-px font-mono text-[10px] sm:block">
                ⌘K
              </kbd>
            </button>

            <div className="hidden rounded-full bg-[#fff1f0] px-3 py-2 text-xs font-bold text-[var(--accent)] sm:block">
              No signup
            </div>

            {/* Hamburger (mobile only) */}
            <button
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              className="icon-button md:hidden"
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        <div
          className={cn(
            "border-t border-[var(--border)] bg-white px-4 py-4 shadow-lg shadow-slate-200/60 md:hidden",
            mobileOpen ? "block" : "hidden",
          )}
          id="mobile-navigation"
        >
          <nav
            aria-label="Mobile primary"
            className="mx-auto max-w-7xl space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <Link
                className="segmented-button justify-center"
                href="/"
                onClick={closeAll}
              >
                Home
              </Link>
              <button
                className="segmented-button justify-center"
                type="button"
                onClick={openTools}
              >
                All Tools
              </button>
              <Link
                className="segmented-button justify-center"
                href="/about"
                onClick={closeAll}
              >
                About
              </Link>
              <Link
                className="segmented-button justify-center"
                href="/blog"
                onClick={closeAll}
              >
                Blog
              </Link>
              <Link
                className="segmented-button col-span-2 justify-center"
                href="/contact"
                onClick={closeAll}
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Modals — rendered OUTSIDE header */}
      <ToolsDialog open={toolsOpen} onClose={() => setToolsOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
