"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Braces,
  Calculator,
  ChevronDown,
  Crop,
  Eraser,
  FileArchive,
  FileImage,
  FileLock2,
  FileSearch,
  Grid3X3,
  ImageDown,
  ImagePlus,
  KeyRound,
  Layers,
  ListOrdered,
  Maximize,
  Menu,
  Minimize2,
  Palette,
  QrCode,
  RefreshCw,
  Ruler,
  RotateCw,
  Search,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stamp,
  Type,
  Wrench,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { pdfTools, tools, type PDFToolConfig, type ToolConfig } from "@/lib/tools";
import { searchSite, popularSearches, type SearchResult } from "@/lib/search";
import {
  utilityTools,
  type UtilityToolConfig,
} from "@/lib/utilityTools";
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
  "merge-pdf": Layers,
  "compress-pdf": Minimize2,
  "split-pdf": Scissors,
  "convert-pdf-to-image": FileImage,
  "convert-image-to-pdf": ImagePlus,
  "rotate-pdf": RotateCw,
  "add-watermark-to-pdf": Stamp,
  "protect-pdf": ShieldCheck,
  "unlock-pdf": FileLock2,
  "extract-pdf-pages": FileArchive,
  "reorder-pdf-pages": Layers,
  "add-page-numbers-to-pdf": ListOrdered,
  "view-pdf-metadata": FileSearch,
  "qr-code-generator": QrCode,
  "upi-qr-code-generator": QrCode,
  "word-counter": Type,
  "text-case-converter": Type,
  "remove-duplicate-lines": ListOrdered,
  "emi-calculator": Calculator,
  "gst-calculator": Calculator,
  "percentage-calculator": Calculator,
  "age-calculator": Calculator,
  "sip-calculator": Calculator,
  "color-picker": Palette,
  "color-contrast-checker": Palette,
  "length-converter": Ruler,
  "weight-converter": Ruler,
  "area-converter": Ruler,
  "password-generator": KeyRound,
  "password-strength-checker": ShieldCheck,
  "json-formatter": Braces,
  "base64-encoder-decoder": Braces,
  "url-encoder-decoder": Braces,
  "file-hash-checksum": FileSearch,
  "zip-extractor": FileArchive,
};

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Tool: Wrench,
  Guide: BookOpen,
  Page: FileImage,
};

type NavigationTool = ToolConfig | PDFToolConfig | UtilityToolConfig;
type MegaMenuKey = "convert" | "compress" | "tools";

interface MegaMenuColumnConfig {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tools: NavigationTool[];
}

interface MegaMenuNavItem {
  key: MegaMenuKey;
  label: string;
}

const toolPathSet = new Set<string>([
  "/pdf-tools",
  ...tools.map((tool) => tool.href),
  ...pdfTools.map((tool) => tool.href),
  ...utilityTools.map((tool) => tool.href),
]);

const convertPathSet = new Set<string>([
  "/convert-image",
  "/convert-pdf-to-image",
  "/convert-image-to-pdf",
  "/base64-encoder-decoder",
  "/url-encoder-decoder",
  "/length-converter",
  "/weight-converter",
  "/area-converter",
]);

const compressPathSet = new Set<string>([
  "/compress-image",
  "/compress-pdf",
  "/resize-image",
]);

const megaMenuNavItems: MegaMenuNavItem[] = [
  { key: "convert", label: "Convert" },
  { key: "compress", label: "Compress" },
  { key: "tools", label: "Tools" },
];

function pickTools<T extends NavigationTool>(
  items: T[],
  slugs: readonly string[],
): NavigationTool[] {
  return slugs
    .map((slug) => items.find((tool) => tool.slug === slug))
    .filter((tool): tool is T => Boolean(tool));
}

function utilityToolsFor(categories: readonly UtilityToolConfig["category"][]) {
  return utilityTools.filter((tool) => categories.includes(tool.category));
}

const megaMenuColumns: Record<MegaMenuKey, MegaMenuColumnConfig[]> = {
  convert: [
    {
      title: "Image",
      icon: FileImage,
      tools: pickTools(tools, ["convert", "resize", "crop", "rotate-flip"]),
    },
    {
      title: "PDF & Documents",
      icon: FileSearch,
      tools: pickTools(pdfTools, [
        "convert-pdf-to-image",
        "convert-image-to-pdf",
        "extract-pdf-pages",
        "view-pdf-metadata",
      ]),
    },
    {
      title: "Others",
      icon: Grid3X3,
      tools: utilityToolsFor(["converter", "developer"]),
    },
  ],
  compress: [
    {
      title: "Image",
      icon: ImageDown,
      tools: pickTools(tools, ["compress", "resize", "convert"]),
    },
    {
      title: "PDF",
      icon: Minimize2,
      tools: pickTools(pdfTools, ["compress-pdf", "merge-pdf", "split-pdf"]),
    },
    {
      title: "File Utilities",
      icon: FileArchive,
      tools: utilityToolsFor(["file"]),
    },
  ],
  tools: [
    {
      title: "Image Tools",
      icon: FileImage,
      tools,
    },
    {
      title: "PDF Tools",
      icon: FileSearch,
      tools: pdfTools.slice(0, 7),
    },
    {
      title: "More PDF Tools",
      icon: Layers,
      tools: pdfTools.slice(7),
    },
    {
      title: "QR & Text",
      icon: Type,
      tools: utilityToolsFor(["qr", "text"]),
    },
    {
      title: "Daily & Developer",
      icon: Calculator,
      tools: utilityToolsFor([
        "calculator",
        "color",
        "converter",
        "password",
        "developer",
        "file",
      ]),
    },
  ],
};

function megaGridClass(columnCount: number) {
  if (columnCount >= 5) {
    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5";
  }

  if (columnCount === 4) {
    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
  }

  if (columnCount === 3) {
    return "grid-cols-1 md:grid-cols-3";
  }

  return "grid-cols-1 md:grid-cols-2";
}

/* ── Mega menu ── */

function MegaMenuLink({
  tool,
  pathname,
  onNavigate,
}: {
  tool: NavigationTool;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname === tool.href;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-lg px-3 py-2.5 text-base font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]",
        active && "bg-sky-50 text-[var(--cyan)]",
      )}
      href={tool.href}
      role="menuitem"
      onClick={onNavigate}
    >
      {tool.name}
    </Link>
  );
}

function MegaMenuOverlay({
  activeMenu,
  pathname,
  onSelectMenu,
  onClose,
  onOpenSearch,
}: {
  activeMenu: MegaMenuKey | null;
  pathname: string;
  onSelectMenu: (menu: MegaMenuKey) => void;
  onClose: () => void;
  onOpenSearch: () => void;
}) {
  useEffect(() => {
    if (!activeMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeMenu]);

  if (!activeMenu) return null;

  const columns = megaMenuColumns[activeMenu];
  const gridClassName = megaGridClass(columns.length);

  return (
    <div
      aria-labelledby="mega-menu-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-3 sm:px-5 sm:py-5"
      id="mega-menu"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl animate-[dialogIn_180ms_ease-out] overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-950/25"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link
            aria-label="FreeConvert home"
            className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            href="/"
            onClick={onClose}
          >
            <BrandLogo textClassName="text-lg sm:text-xl" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Mega menu">
            {megaMenuNavItems.map((item) => (
              <button
                aria-pressed={activeMenu === item.key}
                className={cn(
                  "inline-flex items-center gap-1 text-base font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]",
                  activeMenu === item.key && "text-[var(--cyan)]",
                )}
                key={item.key}
                type="button"
                onClick={() => onSelectMenu(item.key)}
                onMouseEnter={() => onSelectMenu(item.key)}
              >
                {item.label}
                <ChevronDown className="h-4 w-4" />
              </button>
            ))}
            <Link
              className="text-base font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]"
              href="/blog"
              onClick={onClose}
            >
              Blog
            </Link>
            <Link
              className="text-base font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]"
              href="/contact"
              onClick={onClose}
            >
              Contact
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              aria-label="Search"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:text-[var(--cyan)]"
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="hidden rounded-full bg-sky-50 px-3 py-2 text-xs font-bold text-[var(--cyan)] sm:block">
              No signup
            </div>
            <button
              aria-label="Close tools menu"
              className="icon-button lg:hidden"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <h2 className="sr-only" id="mega-menu-title">
          {megaMenuNavItems.find((item) => item.key === activeMenu)?.label} menu
        </h2>

        <div
          className={cn(
            "grid border-t border-[var(--border)]",
            gridClassName,
          )}
          role="menu"
        >
          {columns.map((column, index) => {
            const Icon = column.icon;

            return (
              <section
                className={cn(
                  "min-w-0 border-t border-[var(--border)] sm:border-t-0",
                  index > 0 && "sm:border-l sm:border-[var(--border)]",
                )}
                key={column.title}
              >
                <div className="flex min-h-16 items-center gap-2.5 px-5 py-4">
                  <Icon className="h-5 w-5 shrink-0 text-[var(--text)]" />
                  <h3 className="text-base font-extrabold text-[var(--text)]">
                    {column.title}
                  </h3>
                </div>
                <div className="grid max-h-[calc(100vh-15rem)] gap-1 overflow-y-auto border-t border-[var(--border)] px-4 py-4">
                  {column.tools.map((tool) => (
                    <MegaMenuLink
                      key={tool.href}
                      pathname={pathname}
                      tool={tool}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-xs font-semibold text-[var(--muted)]">
          <span>Free browser tools. No upload. Direct SEO-friendly URLs.</span>
          <button
            className="font-bold text-[var(--cyan)]"
            type="button"
            onClick={() => onSelectMenu("tools")}
          >
            View all tools
          </button>
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
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
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
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-3 pt-4 backdrop-blur-sm sm:px-4 sm:pt-[18vh]"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl animate-[dialogIn_200ms_ease-out] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-[var(--muted)]" />
          <input
            ref={inputRef}
            className="h-8 min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
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
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain sm:max-h-[50vh]">
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
                {[
                  ...tools.slice(0, 3),
                  ...pdfTools.slice(0, 2),
                  ...utilityTools.slice(0, 3),
                ].map((tool) => {
                  const Icon = toolIconMap[tool.slug] || Sparkles;
                  return (
                    <button
                      key={tool.href}
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
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 sm:px-5">
          <div className="hidden items-center gap-3 text-[10px] text-[var(--muted)] sm:flex">
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
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isConvertActive = convertPathSet.has(pathname);
  const isCompressActive = compressPathSet.has(pathname);
  const isAnyToolActive = toolPathSet.has(pathname);
  const isToolsActive = isAnyToolActive && !isConvertActive && !isCompressActive;
  const isAboutActive = pathname === "/about";
  const isBlogActive = pathname === "/blog" || pathname.startsWith("/blog/");
  const isContactActive = pathname === "/contact";
  const desktopMegaButtonClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]",
      active && "text-[var(--cyan)]",
    );
  const mobileLinkClass = (active: boolean, className?: string) =>
    cn(
      "segmented-button justify-center",
      active && "segmented-button-active",
      className,
    );

  const closeAll = useCallback(() => {
    setActiveMegaMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const openMegaMenu = useCallback((menu: MegaMenuKey) => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveMegaMenu(menu);
  }, []);

  const toggleMegaMenu = useCallback((menu: MegaMenuKey) => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveMegaMenu((current) => (current === menu ? null : menu));
  }, []);

  const openSearch = useCallback(() => {
    setMobileOpen(false);
    setActiveMegaMenu(null);
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            aria-label="FreeConvert home"
            onClick={closeAll}
          >
            <BrandLogo textClassName="text-base sm:text-xl" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-5 md:flex"
            aria-label="Primary"
          >
            <button
              aria-controls="mega-menu"
              aria-expanded={activeMegaMenu === "convert"}
              aria-haspopup="dialog"
              className={desktopMegaButtonClass(
                activeMegaMenu === "convert" || isConvertActive,
              )}
              type="button"
              onClick={() => toggleMegaMenu("convert")}
              onMouseEnter={() => openMegaMenu("convert")}
            >
              Convert
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  activeMegaMenu === "convert" && "rotate-180",
                )}
              />
            </button>
            <button
              aria-controls="mega-menu"
              aria-expanded={activeMegaMenu === "compress"}
              aria-haspopup="dialog"
              className={desktopMegaButtonClass(
                activeMegaMenu === "compress" || isCompressActive,
              )}
              type="button"
              onClick={() => toggleMegaMenu("compress")}
              onMouseEnter={() => openMegaMenu("compress")}
            >
              Compress
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  activeMegaMenu === "compress" && "rotate-180",
                )}
              />
            </button>
            <button
              aria-controls="mega-menu"
              aria-expanded={activeMegaMenu === "tools"}
              aria-haspopup="dialog"
              className={desktopMegaButtonClass(
                activeMegaMenu === "tools" || isToolsActive,
              )}
              type="button"
              onClick={() => toggleMegaMenu("tools")}
              onMouseEnter={() => openMegaMenu("tools")}
            >
              Tools
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  activeMegaMenu === "tools" && "rotate-180",
                )}
              />
            </button>
            <Link
              href="/about"
              aria-current={isAboutActive ? "page" : undefined}
              className={cn(
                "text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]",
                isAboutActive && "text-[var(--cyan)]",
              )}
            >
              About
            </Link>
            <Link
              href="/blog"
              aria-current={isBlogActive ? "page" : undefined}
              className={cn(
                "text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]",
                isBlogActive && "text-[var(--cyan)]",
              )}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              aria-current={isContactActive ? "page" : undefined}
              className={cn(
                "text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--cyan)]",
                isContactActive && "text-[var(--cyan)]",
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right side — search + badge + hamburger */}
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            {/* Search trigger */}
            <button
              aria-label="Search"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--muted)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)] sm:w-auto sm:gap-2 sm:px-3"
              type="button"
              onClick={openSearch}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden w-24 text-left sm:block">Search...</span>
              <kbd className="hidden rounded border border-[var(--border)] bg-white px-1.5 py-px font-mono text-[10px] lg:block">
                ⌘K
              </kbd>
            </button>

            <div className="hidden rounded-full bg-sky-50 px-2 py-1.5 text-[10px] font-bold text-[var(--cyan)] min-[420px]:block sm:px-3 sm:py-2 sm:text-xs">
              No signup
            </div>

            {/* Hamburger (mobile only) */}
            <button
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)] md:hidden"
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
          aria-hidden={!mobileOpen}
          className={cn(
            "overflow-hidden transition-[max-height] duration-200 ease-out md:hidden",
            mobileOpen ? "max-h-[calc(100vh-4rem)]" : "max-h-0",
          )}
          id="mobile-navigation"
          inert={!mobileOpen}
        >
          <nav
            aria-label="Mobile primary"
            className="min-h-0 overflow-hidden border-t border-[var(--border)] bg-white px-4 py-4 shadow-lg shadow-slate-200/60"
          >
            <div className="mx-auto max-w-7xl space-y-3">
              <div className="rounded-lg bg-sky-50 px-3 py-2 text-center text-xs font-bold text-[var(--cyan)]">
                No signup / no upload
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  aria-current={pathname === "/" ? "page" : undefined}
                  className={mobileLinkClass(pathname === "/")}
                  href="/"
                  onClick={closeAll}
                >
                  Home
                </Link>
                <button
                  aria-controls="mega-menu"
                  aria-expanded={activeMegaMenu === "convert"}
                  className={mobileLinkClass(isConvertActive)}
                  type="button"
                  onClick={() => openMegaMenu("convert")}
                >
                  Convert
                </button>
                <button
                  aria-controls="mega-menu"
                  aria-expanded={activeMegaMenu === "compress"}
                  className={mobileLinkClass(isCompressActive)}
                  type="button"
                  onClick={() => openMegaMenu("compress")}
                >
                  Compress
                </button>
                <button
                  aria-controls="mega-menu"
                  aria-expanded={activeMegaMenu === "tools"}
                  className={mobileLinkClass(isAnyToolActive)}
                  type="button"
                  onClick={() => openMegaMenu("tools")}
                >
                  Tools
                </button>
                <Link
                  aria-current={isAboutActive ? "page" : undefined}
                  className={mobileLinkClass(isAboutActive)}
                  href="/about"
                  onClick={closeAll}
                >
                  About
                </Link>
                <Link
                  aria-current={isBlogActive ? "page" : undefined}
                  className={mobileLinkClass(isBlogActive)}
                  href="/blog"
                  onClick={closeAll}
                >
                  Blog
                </Link>
                <Link
                  aria-current={isContactActive ? "page" : undefined}
                  className={mobileLinkClass(isContactActive, "col-span-2")}
                  href="/contact"
                  onClick={closeAll}
                >
                  Contact
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Modals — rendered OUTSIDE header */}
      <MegaMenuOverlay
        activeMenu={activeMegaMenu}
        pathname={pathname}
        onSelectMenu={setActiveMegaMenu}
        onClose={() => setActiveMegaMenu(null)}
        onOpenSearch={openSearch}
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
