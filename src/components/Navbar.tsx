"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import type { MegaMenuKey } from "@/components/NavbarOverlays";
import { cn } from "@/lib/utils";

function MegaMenuLoading() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-3 sm:px-5 sm:py-5"
    >
      <div className="w-full max-w-7xl overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-2xl shadow-slate-950/25">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-[var(--surface-2)]" />
          <div className="hidden h-8 w-80 animate-pulse rounded-lg bg-[var(--surface-2)] lg:block" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--surface-2)]" />
        </div>
        <div className="grid border-t border-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, columnIndex) => (
            <section
              className="border-t border-[var(--border)] p-5 sm:border-t-0 sm:border-l"
              key={columnIndex}
            >
              <div className="mb-5 h-5 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((__, itemIndex) => (
                  <div
                    className="h-9 animate-pulse rounded-lg bg-[var(--surface-2)]"
                    key={itemIndex}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const MegaMenuOverlay = dynamic(
  () => import("@/components/NavbarOverlays").then((mod) => mod.MegaMenuOverlay),
  { loading: () => <MegaMenuLoading />, ssr: false },
);

const SearchDialog = dynamic(
  () => import("@/components/NavbarOverlays").then((mod) => mod.SearchDialog),
  { ssr: false },
);

const htmlToolPaths = [
  "/html-to-pdf",
  "/html-viewer",
  "/html-formatter",
  "/html-minifier",
  "/html-validator",
  "/html-to-markdown",
  "/markdown-to-html",
  "/html-to-text",
  "/html-entities-encoder-decoder",
  "/html-table-generator",
  "/html-to-image",
  "/responsive-html-preview",
  "/iframe-generator",
  "/meta-tag-generator",
  "/css-js-formatter-minifier",
];

const toolPathSet = new Set([
  "/pdf-tools",
  "/resize-image",
  "/compress-image",
  "/convert-image",
  "/webp-to-jpg",
  "/png-to-jpg",
  "/jpg-to-png",
  "/avif-to-jpg",
  "/png-to-webp",
  "/compress-jpg",
  "/compress-png",
  "/heic-to-jpg",
  "/heic-to-png",
  "/image-to-text",
  "/svg-to-png",
  "/favicon-generator",
  "/blur-image",
  "/image-collage-maker",
  "/crop-image",
  "/rotate-image",
  "/remove-background",
  "/add-watermark-to-image",
  "/merge-images",
  "/image-filters",
  "/image-metadata",
  "/merge-pdf",
  "/compress-pdf",
  "/split-pdf",
  "/convert-pdf-to-image",
  "/convert-image-to-pdf",
  "/jpg-to-pdf",
  "/png-to-pdf",
  "/heic-to-pdf",
  "/rotate-pdf",
  "/add-watermark-to-pdf",
  "/protect-pdf",
  "/unlock-pdf",
  "/extract-pdf-pages",
  "/delete-pages-from-pdf",
  "/reorder-pdf-pages",
  "/edit-pdf",
  "/sign-pdf",
  "/crop-pdf",
  "/pdf-to-text",
  "/redact-pdf",
  "/add-page-numbers-to-pdf",
  "/view-pdf-metadata",
  "/qr-code-generator",
  "/upi-qr-code-generator",
  "/word-counter",
  "/character-counter",
  "/text-case-converter",
  "/remove-duplicate-lines",
  "/bmi-calculator",
  "/emi-calculator",
  "/gst-calculator",
  "/percentage-calculator",
  "/age-calculator",
  "/sip-calculator",
  "/color-picker",
  "/color-contrast-checker",
  "/length-converter",
  "/weight-converter",
  "/area-converter",
  "/time-zone-converter",
  "/password-generator",
  "/password-strength-checker",
  "/json-formatter",
  "/base64-encoder-decoder",
  "/url-encoder-decoder",
  "/file-hash-checksum",
  "/zip-extractor",
  "/video-compressor",
  "/mp4-to-mp3",
  "/mp4-to-gif",
  "/audio-converter",
  ...htmlToolPaths,
]);

const convertPathSet = new Set([
  "/convert-image",
  "/webp-to-jpg",
  "/png-to-jpg",
  "/jpg-to-png",
  "/avif-to-jpg",
  "/png-to-webp",
  "/heic-to-jpg",
  "/heic-to-png",
  "/convert-pdf-to-image",
  "/convert-image-to-pdf",
  "/jpg-to-pdf",
  "/png-to-pdf",
  "/heic-to-pdf",
  "/base64-encoder-decoder",
  "/url-encoder-decoder",
  "/length-converter",
  "/weight-converter",
  "/area-converter",
  "/time-zone-converter",
  "/mp4-to-mp3",
  "/mp4-to-gif",
  "/audio-converter",
  "/html-to-pdf",
  "/html-to-markdown",
  "/markdown-to-html",
  "/html-to-text",
  "/html-entities-encoder-decoder",
  "/html-to-image",
]);

const compressPathSet = new Set([
  "/compress-image",
  "/compress-jpg",
  "/compress-png",
  "/compress-pdf",
  "/resize-image",
  "/video-compressor",
  "/html-minifier",
  "/css-js-formatter-minifier",
]);

const megaMenuNavItems: { key: MegaMenuKey; label: string }[] = [
  { key: "convert", label: "Convert" },
  { key: "compress", label: "Compress" },
  { key: "tools", label: "Tools" },
];

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
          <Link
            href="/"
            className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            aria-label="FreeConvert home"
            onClick={closeAll}
          >
            <BrandLogo textClassName="text-base sm:text-xl" />
          </Link>

          <nav
            className="hidden items-center gap-5 md:flex"
            aria-label="Primary"
          >
            {megaMenuNavItems.map((item) => {
              const active =
                activeMegaMenu === item.key ||
                (item.key === "convert" && isConvertActive) ||
                (item.key === "compress" && isCompressActive) ||
                (item.key === "tools" && isToolsActive);

              return (
                <button
                  aria-controls="mega-menu"
                  aria-expanded={activeMegaMenu === item.key}
                  aria-haspopup="dialog"
                  className={desktopMegaButtonClass(active)}
                  key={item.key}
                  type="button"
                  onClick={() => toggleMegaMenu(item.key)}
                  onMouseEnter={() => openMegaMenu(item.key)}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      activeMegaMenu === item.key && "rotate-180",
                    )}
                  />
                </button>
              );
            })}
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

          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <button
              aria-label="Search"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--muted)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)] sm:w-auto sm:gap-2 sm:px-3"
              type="button"
              onClick={openSearch}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden w-24 text-left sm:block">Search...</span>
              <kbd className="hidden rounded border border-[var(--border)] bg-white px-1.5 py-px font-mono text-[10px] lg:block">
                Ctrl K
              </kbd>
            </button>

            <div className="hidden rounded-full bg-sky-50 px-2 py-1.5 text-[10px] font-bold text-[var(--cyan)] min-[420px]:block sm:px-3 sm:py-2 sm:text-xs">
              No signup
            </div>

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

      {activeMegaMenu ? (
        <MegaMenuOverlay
          activeMenu={activeMegaMenu}
          pathname={pathname}
          onSelectMenu={setActiveMegaMenu}
          onClose={() => setActiveMegaMenu(null)}
          onOpenSearch={openSearch}
        />
      ) : null}
      {searchOpen ? <SearchDialog onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
