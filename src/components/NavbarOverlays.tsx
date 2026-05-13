"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
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
  Video,
  Wrench,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useDialogAccessibility } from "@/components/useDialogAccessibility";
import { popularSearches, searchSite, type SearchResult } from "@/lib/search";
import { pdfTools, tools, type PDFToolConfig, type ToolConfig } from "@/lib/tools";
import {
  utilityTools,
  type UtilityToolConfig,
} from "@/lib/utilityTools";
import { cn } from "@/lib/utils";

export type MegaMenuKey = "convert" | "compress" | "tools";

type NavigationTool = ToolConfig | PDFToolConfig | UtilityToolConfig;

interface MegaMenuColumnConfig {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tools: NavigationTool[];
}

interface MegaMenuNavItem {
  key: MegaMenuKey;
  label: string;
}

const toolIconMap: Record<string, ComponentType<{ className?: string }>> = {
  resize: Maximize,
  compress: ImageDown,
  convert: RefreshCw,
  "webp-to-jpg": RefreshCw,
  "png-to-jpg": RefreshCw,
  "jpg-to-png": RefreshCw,
  "avif-to-jpg": RefreshCw,
  "png-to-webp": RefreshCw,
  "compress-jpg": ImageDown,
  "compress-png": ImageDown,
  "heic-to-jpg": FileImage,
  "heic-to-png": FileImage,
  crop: Crop,
  "rotate-flip": RefreshCw,
  "background-removal": Eraser,
  watermark: ImagePlus,
  merge: Grid3X3,
  filters: SlidersHorizontal,
  metadata: FileImage,
  "image-to-text": Type,
  "svg-to-png": FileImage,
  "favicon-generator": Sparkles,
  "blur-image": Eraser,
  "image-collage-maker": Grid3X3,
  "merge-pdf": Layers,
  "compress-pdf": Minimize2,
  "split-pdf": Scissors,
  "convert-pdf-to-image": FileImage,
  "convert-image-to-pdf": ImagePlus,
  "jpg-to-pdf": ImagePlus,
  "png-to-pdf": ImagePlus,
  "heic-to-pdf": ImagePlus,
  "rotate-pdf": RotateCw,
  "add-watermark-to-pdf": Stamp,
  "protect-pdf": ShieldCheck,
  "unlock-pdf": FileLock2,
  "extract-pdf-pages": FileArchive,
  "delete-pages-from-pdf": Scissors,
  "reorder-pdf-pages": Layers,
  "edit-pdf": FileSearch,
  "sign-pdf": Stamp,
  "crop-pdf": Crop,
  "pdf-to-text": Type,
  "redact-pdf": ShieldCheck,
  "add-page-numbers-to-pdf": ListOrdered,
  "view-pdf-metadata": FileSearch,
  "qr-code-generator": QrCode,
  "upi-qr-code-generator": QrCode,
  "word-counter": Type,
  "character-counter": Type,
  "text-case-converter": Type,
  "remove-duplicate-lines": ListOrdered,
  "bmi-calculator": Calculator,
  "emi-calculator": Calculator,
  "gst-calculator": Calculator,
  "percentage-calculator": Calculator,
  "age-calculator": Calculator,
  "sip-calculator": Calculator,
  "time-zone-converter": Calculator,
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
  "video-compressor": Video,
  "mp4-to-mp3": Video,
  "mp4-to-gif": Video,
  "audio-converter": Video,
};

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Tool: Wrench,
  Guide: BookOpen,
  Page: FileImage,
};

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
      tools: pickTools(tools, [
        "convert",
        "webp-to-jpg",
        "png-to-jpg",
        "jpg-to-png",
        "svg-to-png",
      ]),
    },
    {
      title: "PDF & Documents",
      icon: FileSearch,
      tools: pickTools(pdfTools, [
        "convert-pdf-to-image",
        "convert-image-to-pdf",
        "jpg-to-pdf",
        "png-to-pdf",
        "heic-to-pdf",
        "pdf-to-text",
      ]),
    },
    {
      title: "Media",
      icon: Video,
      tools: pickTools(utilityTools, [
        "mp4-to-mp3",
        "mp4-to-gif",
        "audio-converter",
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
      tools: pickTools(tools, [
        "compress",
        "compress-jpg",
        "compress-png",
        "resize",
      ]),
    },
    {
      title: "PDF",
      icon: Minimize2,
      tools: pickTools(pdfTools, ["compress-pdf", "merge-pdf", "split-pdf"]),
    },
    {
      title: "Media",
      icon: Video,
      tools: pickTools(utilityTools, ["video-compressor"]),
    },
    {
      title: "File Utilities",
      icon: FileArchive,
      tools: utilityToolsFor(["file"]),
    },
  ],
  tools: [
    {
      title: "Image Essentials",
      icon: FileImage,
      tools: pickTools(tools, [
        "resize",
        "compress",
        "convert",
        "crop",
        "rotate-flip",
        "background-removal",
        "watermark",
        "merge",
        "filters",
        "metadata",
      ]),
    },
    {
      title: "PDF Tools",
      icon: FileSearch,
      tools: pdfTools.slice(0, 11),
    },
    {
      title: "More PDF Tools",
      icon: Layers,
      tools: pdfTools.slice(11),
    },
    {
      title: "Image Convert & Create",
      icon: ImagePlus,
      tools: pickTools(tools, [
        "webp-to-jpg",
        "png-to-jpg",
        "jpg-to-png",
        "avif-to-jpg",
        "png-to-webp",
        "compress-jpg",
        "compress-png",
        "heic-to-jpg",
        "heic-to-png",
        "image-to-text",
        "svg-to-png",
        "favicon-generator",
        "blur-image",
        "image-collage-maker",
      ]),
    },
    {
      title: "QR, Text & Calculators",
      icon: Type,
      tools: utilityToolsFor(["qr", "text", "calculator"]),
    },
    {
      title: "Developer, File & Media",
      icon: Calculator,
      tools: utilityToolsFor([
        "color",
        "converter",
        "password",
        "developer",
        "file",
        "media",
      ]),
    },
  ],
};

function megaGridClass(columnCount: number) {
  if (columnCount >= 6) {
    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-6";
  }

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

export function MegaMenuOverlay({
  activeMenu,
  pathname,
  onSelectMenu,
  onClose,
  onOpenSearch,
}: {
  activeMenu: MegaMenuKey;
  pathname: string;
  onSelectMenu: (menu: MegaMenuKey) => void;
  onClose: () => void;
  onOpenSearch: () => void;
}) {
  const dialogRef = useDialogAccessibility({
    onClose,
    open: true,
  });
  const columns = megaMenuColumns[activeMenu];
  const gridClassName = megaGridClass(columns.length);

  return (
    <div
      ref={dialogRef}
      aria-labelledby="mega-menu-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-3 sm:px-5 sm:py-5"
      id="mega-menu"
      role="dialog"
      tabIndex={-1}
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
                <div className="grid gap-1 border-t border-[var(--border)] px-4 py-4 lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto">
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

export function SearchDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dialogRef = useDialogAccessibility({
    initialFocusRef: inputRef,
    onClose,
    open: true,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    if (value.trim().length > 0) {
      setResults(searchSite(value, 8));
    } else {
      setResults([]);
    }
  }

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function handleKeyDown(e: ReactKeyboardEvent) {
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

  const showPopular = query.trim().length === 0;

  return (
    <div
      ref={dialogRef}
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-3 pt-4 backdrop-blur-sm sm:px-4 sm:pt-[18vh]"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl animate-[dialogIn_200ms_ease-out] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-900/20"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain sm:max-h-[50vh]">
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

        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 sm:px-5">
          <div className="hidden items-center gap-3 text-[10px] text-[var(--muted)] sm:flex">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--border)] bg-white px-1 py-px font-mono">
                Up
              </kbd>
              <kbd className="rounded border border-[var(--border)] bg-white px-1 py-px font-mono">
                Down
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-px font-mono">
                Enter
              </kbd>
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
