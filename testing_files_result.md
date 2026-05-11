# FreeConvert — Full Project Audit

> **Audit Date:** 2026-05-11  
> **Stack:** Next.js 16.2.6 (Turbopack) • React 19 • Zustand • Tailwind CSS v4 • pdf-lib • pdfjs-dist • qpdf-wasm  
> **Build Status:** ✅ Passes cleanly — 80 routes, 0 TypeScript errors

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [DRY Violations](#2-dry-violations)
3. [Performance Bottlenecks](#3-performance-bottlenecks)
4. [Correctness & Logic Bugs](#4-correctness--logic-bugs)
5. [Security Concerns](#5-security-concerns)
6. [SEO & Metadata Gaps](#6-seo--metadata-gaps)
7. [Accessibility Issues](#7-accessibility-issues)
8. [Code Quality & Maintainability](#8-code-quality--maintainability)
9. [Prioritized Action Plan](#9-prioritized-action-plan)

---

## 1. Architecture Overview

### What's Good ✅

| Area | Assessment |
|---|---|
| **Client-side-only processing** | Excellent privacy model — zero server uploads |
| **Dynamic imports** | Heavy libs (`pdf-lib`, `pdfjs-dist`, `qpdf-wasm`, `@imgly/background-removal`, `browser-image-compression`, `exifr`) are lazy-loaded correctly |
| **Security headers** | CSP, HSTS, X-Frame-Options, Permissions-Policy all set |
| **Rate limiting** | Dual-mode: local Map fallback + Upstash Redis for production |
| **SEO foundations** | JSON-LD (WebSite, Organization, SoftwareApplication, FAQPage, BreadcrumbList), canonical URLs, sitemap, robots.txt |
| **Input validation** | Magic bytes verification + MIME + extension + file size checks |
| **Input sanitization** | Query parameters sanitized through `safeNumber`, `safeEnum`, `safeColor`, `safeString` |
| **Zustand stores** | Clean separation of image vs PDF state with proper `URL.revokeObjectURL` cleanup |
| **Canvas memory management** | `releaseCanvas()` pattern prevents canvas memory leaks |

### High-Level Concerns ⚠️

| Area | Issue |
|---|---|
| **Monolithic PDFToolClient** | 1,571 lines — single component handles **all 13 PDF tools** |
| **Monolithic Navbar** | 989 lines — mega menu, search dialog, mobile nav all in one file |
| **No error boundaries per tool** | One crash in any tool could blank the entire page |
| **No testing** | Zero unit/integration/E2E tests |
| **No dark mode** | CSS variables defined but no dark theme |

---

## 2. DRY Violations

> [!CAUTION]
> These are concrete code duplications that increase maintenance burden and bug surface.

### 2.1 `clampNumber` — Defined 3 Times

| Location | File | Line |
|---|---|---|
| `clamp()` | [utils.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/utils.ts#L9-L11) | 9 |
| `clampNumber()` | [pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L64-L66) | 64 |
| `clampNumber()` | [utility/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/utility/shared.tsx#L271) | 271 |

**Fix:** Delete the two `clampNumber` copies. Import `clamp` from `@/lib/utils` everywhere.

### 2.2 `canvasToBlob` — Defined 2 Times

| Location | File | Line |
|---|---|---|
| Full version with release | [imageProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/imageProcessor.ts#L66-L92) | 66 |
| Simplified version | [pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L329-L347) | 329 |

**Fix:** Extract a shared `canvasToBlob` into `@/lib/canvas-utils.ts` and import in both processors.

### 2.3 `loadImage` — Defined 2 Times

| Location | File | Line |
|---|---|---|
| Returns `LoadedImage` | [imageProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/imageProcessor.ts#L26-L46) | 26 |
| Returns `HTMLImageElement` | [pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L429-L444) | 429 |

**Fix:** Unify into a single `loadImage` in `@/lib/canvas-utils.ts`. The PDF version is a subset.

### 2.4 `revoke(url)` — Defined 2 Times

| Location | File | Line |
|---|---|---|
| Image store | [useImageStore.ts](file:///Users/manishkumar/Desktop/freeconvert/src/store/useImageStore.ts#L31-L35) | 31 |
| PDF store | [usePDFStore.ts](file:///Users/manishkumar/Desktop/freeconvert/src/store/usePDFStore.ts#L41-L45) | 41 |

**Fix:** Extract to `@/lib/url-utils.ts` or a shared `store/helpers.ts`.

### 2.5 `buildToolMetadata` / `buildPDFToolMetadata` — Near-Identical Functions

| Location | File | Line |
|---|---|---|
| Image tools | [tools.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/tools.ts#L589-L613) | 589 |
| PDF tools | [tools.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/tools.ts#L615-L639) | 615 |

Both functions have identical structure — only the config source differs. Same pattern for `toolJsonLd`/`pdfToolJsonLd` and `toolBreadcrumbJsonLd`/`pdfToolBreadcrumbJsonLd`.

**Fix:** Generalize into a single `buildMetadata(tool: { title, description, keywords, href })`.

### 2.6 Shared UI Components — Defined 3 Times

`Panel`, `RangeControl`, `NumberControl`, `SelectControl`, `ToggleButton` are independently defined in:
- [tools/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/tools/shared.tsx)
- [pdf/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/pdf/shared.tsx)
- [utility/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/utility/shared.tsx)

**Fix:** Consolidate into a single `@/components/ui/` directory with shared primitives.

### 2.7 `asFormat` / `asNumber` / `asBoolean` / `asString` — Defined 2 Times

- [tools/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/tools/shared.tsx#L21-L35) lines 21–35
- [pdf/shared.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/pdf/shared.tsx) (as `asPDFNumber`, `asPDFString`)

**Fix:** Single set of type coercion helpers in `@/lib/coerce.ts`.

### 2.8 Icon Map — Defined 2 Times

- [Navbar.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/Navbar.tsx#L59-L105) lines 59–105
- [HomeTools.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/HomeTools.tsx#L32-L54) lines 32–54

**Fix:** Single `@/lib/icons.ts` exporting all icon maps.

### 2.9 Page Size Definitions — Defined 2 Times

- `sizeName()` in [pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L91-L112) line 91
- `pageSizeToPoints()` in [pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L242-L264) line 242

Both define the exact same page size constants (`A3`, `A4`, `A5`, `Letter`, `Legal`, `Tabloid`) independently.

**Fix:** Single `PAGE_SIZES` constant object used by both functions.

---

## 3. Performance Bottlenecks

### 3.1 🔴 PDFToolClient.tsx — 1,571-Line Monolith

[PDFToolClient.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/pdf/PDFToolClient.tsx) (54 KB)

This **single component** renders all 13 PDF tools via a massive `if/else` chain. Every PDF tool page loads the entire component including:
- ~40 `useState` hooks initialized on every render
- All UI controls for every PDF tool (merge, compress, split, rotate, watermark, protect, etc.)
- The watermark live preview, batch list, metadata table — all bundled

**Impact:** ~54 KB of client JS loaded for every PDF tool, even though each tool uses only ~15% of the code.

**Fix:** Split into individual tool components: `MergePDFClient`, `CompressPDFClient`, `SplitPDFClient`, etc. Use a factory or dynamic import pattern.

### 3.2 🔴 Navbar — 989 Lines, Always Client-Side

[Navbar.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/Navbar.tsx) (32 KB)

The Navbar is `"use client"` and includes:
- Mega menu overlay (3 configurations, 5 columns each)
- Full search dialog with live search
- Mobile drawer
- All lucide icons (~30 imports)

This entire bundle ships on **every page load**.

**Impact:** ~32 KB client component rendered on every page. The search dialog and mega menu are rarely used.

**Fix:**
1. Lazy-load `SearchDialog` and `MegaMenuOverlay` via `React.lazy()` or `next/dynamic`
2. Move static link lists to a server component; only wrap interactive parts in `"use client"`

### 3.3 🟡 Search Index Built on Import

[search.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/search.ts#L150-L208) builds the full `searchIndex` array at module-level. This includes flattening all blog post sections into keywords.

**Impact:** Every page that imports `searchSite` (the Navbar) pulls the entire blog content into the client bundle.

**Fix:** Make `searchIndex` lazy-initialized. Or move search to a server action / API route so the index stays server-side.

### 3.4 🟡 PDF Compression — Rasterization Approach

[pdfProcessor.ts compressPDF](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L862-L961)

The compression strategy rasterizes every page to a canvas → JPEG → re-embeds into a new PDF. This:
- Destroys all text content (no longer searchable/selectable)
- Loses vector graphics
- Can be very slow for large PDFs (sequential rendering)

**Impact:** Users lose text content in compressed PDFs. This is a **functional correctness** issue disguised as performance.

**Fix:** Document this clearly in the UI ("Compressed PDFs become image-based"). Consider adding a "text-preserving" mode that only recompresses embedded images.

### 3.5 🟡 No Web Worker for Heavy Processing

All image operations (resize, compress, filter, watermark, merge) run on the **main thread** via Canvas API. Only `browser-image-compression` uses its own Web Worker.

**Impact:** Large images (>5MP) will freeze the UI during processing. The sharpen kernel in `applyFilters` does pixel-level iteration which is especially costly.

**Fix:** Offload Canvas operations to `OffscreenCanvas` in a Web Worker for the heaviest operations (filters, merge, watermark).

### 3.6 🟢 Thumbnail Rendering is Sequential

[generatePageThumbnails](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L511-L535) renders thumbnails one page at a time with a 16ms yield between each.

This is actually fine for correctness (pdfjs isn't thread-safe), but could be optimized for PDFs with 50+ pages.

---

## 4. Correctness & Logic Bugs

### 4.1 🔴 Rate Limit Map Never Cleaned — Memory Leak

[proxy.ts](file:///Users/manishkumar/Desktop/freeconvert/src/proxy.ts#L6) line 6:
```typescript
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
```

The local fallback `rateLimitMap` entries are **never deleted**. Over time on a long-running server (or dev mode), this Map grows unbounded.

**Fix:** Add periodic cleanup or use a TTL-aware data structure. Example: add a `cleanup()` call inside `getLocalRateLimitInfo` that sweeps expired entries every N calls.

### 4.2 🔴 `OutputBatchPreview` Creates Object URLs on Every Render

[PDFToolClient.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/pdf/PDFToolClient.tsx#L118-L125) lines 118–125:
```typescript
const urls = useMemo(
  () => items.map((item) => URL.createObjectURL(item.blob)),
  [items],
);
useEffect(() => {
  return () => urls.forEach((url) => URL.revokeObjectURL(url));
}, [urls]);
```

If `items` is a new array reference on every render (which it will be from Zustand's `outputBatch`), this creates and leaks object URLs rapidly.

**Fix:** Memoize the `items` reference or use a ref to track previous URLs before creating new ones.

### 4.3 🟡 `WatermarkLivePreview` Object URL Never Cleaned on Re-render

[PDFToolClient.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/pdf/PDFToolClient.tsx#L196-L207):
```typescript
const imageUrl = useMemo(
  () => (imageFile ? URL.createObjectURL(imageFile) : null),
  [imageFile],
);
```

The cleanup `useEffect` runs when `imageUrl` changes, which will work — but `useMemo` can be GC'd by React and recreated, causing leaked URLs in edge cases.

### 4.4 🟡 `batchFiles.findIndex` — Fragile Identity Check

[usePDFStore.ts](file:///Users/manishkumar/Desktop/freeconvert/src/store/usePDFStore.ts#L165-L170):
```typescript
const index = get().batchFiles.findIndex(
  (item) =>
    item.name === file.name &&
    item.size === file.size &&
    item.lastModified === file.lastModified,
);
```

This matches by `name + size + lastModified` instead of object identity. If two files share these properties, the wrong file gets its info updated.

**Fix:** Use a unique ID per batch entry (e.g., `crypto.randomUUID()`) or match by `===` reference.

### 4.5 🟡 `compressPDF` Duplicate Filter is Fragile

[pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L879-L884):
```typescript
.filter(
  (attempt, index, list) =>
    list.findIndex(
      (item) => item.dpi === attempt.dpi && item.quality === attempt.quality,
    ) === index,
)
```

This de-duplicates compression attempts, but the O(n²) `.findIndex` inside `.filter` is unnecessary for a 6-element array. More importantly, if `baseDPI` or `baseQuality` produce the same values as hardcoded fallbacks, attempts are silently skipped, potentially reducing compression quality options.

### 4.6 🟡 Footer Year Renders at Build Time for SSG Pages

[Footer.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/Footer.tsx#L158):
```typescript
<p>© {new Date().getFullYear()} FreeConvert.in. All rights reserved.</p>
```

For statically generated pages, this captures the **build time year**, not the current year.

**Fix:** Since `Footer` is a server component, this is fine for ISR/SSR pages. But for static pages built in December 2026, they'll show "2026" until the next build in 2027. Minor, but worth noting.

### 4.7 🟢 `mergeImages` Doesn't Release Source Image Elements

After drawing all images to the merged canvas, the `HTMLImageElement` references are never explicitly cleaned up. The browser will GC them eventually, but for very large merge operations, this can cause temporary memory spikes.

---

## 5. Security Concerns

### 5.1 🔴 CSP Uses `'unsafe-inline'` and `'unsafe-eval'`

[next.config.ts](file:///Users/manishkumar/Desktop/freeconvert/next.config.ts#L113):
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' ...
```

`'unsafe-eval'` completely defeats script-src CSP protection. This is required by some ad networks and analytics but is the **most dangerous CSP weakening**.

**Mitigation:** This is likely required for AdSense. Document why it's needed. Consider using `nonce`-based CSP if Next.js 16 supports it for third-party scripts.

### 5.2 🟡 `.env.local` in Git Root (Not Gitignored Check)

Verify `.env.local` is in `.gitignore`:

```
.env.local  ← contains UPSTASH tokens, AdSense IDs, etc.
```

> [!IMPORTANT]
> Confirm `.env.local` is listed in `.gitignore`. If it's ever committed, all secrets must be rotated immediately.

### 5.3 🟡 Malicious Pattern Blocklist is Incomplete

[proxy.ts](file:///Users/manishkumar/Desktop/freeconvert/src/proxy.ts#L11-L22) blocks common attack patterns but:
- Missing: `%00` (null byte URL encoding), `%252e%252e` (double-encoded traversal)
- The `.env` pattern would also block legitimate routes containing "env" (e.g., `/environment`)

**Fix:** The `.env` and `.git` regex patterns should be anchored to catch `/\.env` or `/\.git` paths, not just any string containing "env".

### 5.4 🟡 PDF Password Passed via CLI Args

[pdfProcessor.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/pdfProcessor.ts#L1055):
```typescript
`--password=${password}`
```

This passes the user's PDF password as a CLI argument to QPDF WASM. In a browser WASM context this is safe (no process listing). But if this code ever runs server-side, the password would appear in process arguments.

### 5.5 🟢 JSON-LD XSS Protection

[utils.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/utils.ts#L98-L100) — `safeJsonLd` escapes `<` to `\\u003c`. ✅ Correct protection against script injection in JSON-LD blocks.

---

## 6. SEO & Metadata Gaps

### 6.1 🟡 Duplicate Metadata Between Layout and Page

Both [layout.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/app/layout.tsx#L77-L217) and [page.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/app/page.tsx#L9-L53) define metadata. The page metadata overrides the layout metadata, but the layout still exports very similar title/description/keywords/openGraph.

This works correctly (Next.js merges them), but having 30+ keywords in the layout metadata is **keyword stuffing** — search engines may penalize this.

**Fix:** Keep the layout metadata minimal (just `title.template` and `metadataBase`). Move keyword-heavy SEO to individual tool pages only.

### 6.2 🟡 `tools/` Legacy Routes Still Dynamic

The build output shows routes like `/tools/resize`, `/tools/compress`, etc. are `ƒ (Dynamic)`. These are redirected to canonical URLs via `next.config.ts`. But because they're dynamic server-rendered, they:
- Consume serverless function invocations
- Add latency before the redirect

**Fix:** Consider making these permanent redirects at the CDN/edge level (Vercel) instead.

### 6.3 🟢 Sitemap is Complete

All tool routes, blog posts, utility tools, and legal pages are included. ✅

### 6.4 🟢 Breadcrumb JSON-LD is Properly Structured

Tool pages have correct 3-level breadcrumbs. ✅

---

## 7. Accessibility Issues

### 7.1 🔴 Download Dialog Missing Focus Trap

[DownloadButton.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/DownloadButton.tsx#L126-L187) — The download naming dialog has `aria-modal="true"` but:
- No focus trap (Tab can escape to background elements)
- No Escape key handler to close
- Background scroll not locked

**Fix:** Add focus trap, Escape handler, and scroll lock.

### 7.2 🟡 Mega Menu Missing Focus Trap

[Navbar.tsx](file:///Users/manishkumar/Desktop/freeconvert/src/components/Navbar.tsx#L318-L456) — The mega menu overlay correctly locks scroll and handles Escape, but Tab focus can escape the modal overlay to background elements.

### 7.3 🟡 Range Inputs Missing `aria-label`

Range sliders across tools use `<input type="range">` but rely on parent `<label>` elements. This is acceptable but explicit `aria-label` or `aria-labelledby` would improve screen reader experience.

### 7.4 🟡 Color Inputs Not Keyboard Accessible

Several tools use native `<input type="color">` which has varying keyboard accessibility across browsers.

---

## 8. Code Quality & Maintainability

### 8.1 🔴 PDFToolClient.tsx Should Be Split

**Current:** 1 component × 1,571 lines × 13 tools × ~40 useState hooks

**Target:** 13 components × ~120 lines each, sharing common primitives from `pdf/shared.tsx`

This is the **single most impactful refactor** for maintainability.

### 8.2 🔴 No Tests Whatsoever

Zero unit tests, integration tests, or E2E tests. For a tool that processes user files, this is risky:

- `parsePageRange("1-3", 5)` → no test verifying output
- `canvasToBlob` → no test verifying blob creation
- `validateImageFile` → no test for edge cases (0-byte files, very long names)
- `searchSite("merge pdf")` → no test verifying ranking

**Fix:** Priority testing targets:
1. `parsePageRange` / `parsePageRangeGroups` — pure functions, easy to test
2. `validateFile` / `verifyMagicBytes` — critical security boundary
3. `sanitize.ts` — input validation
4. `search.ts` — ranking logic
5. `utils.ts` — clamp, formatBytes, etc.

### 8.3 🟡 `eslint-disable` in PDFToolClient

```typescript
/* eslint-disable @next/next/no-img-element */
```

This blanket disable at file level suppresses Next.js Image optimization warnings for **all** `<img>` tags in the 1,571-line file. Some `<img>` uses (like page thumbnails) are valid (blob URLs), but others could use `<Image>`.

### 8.4 🟡 Blog Content is Hardcoded

[blog.ts](file:///Users/manishkumar/Desktop/freeconvert/src/lib/blog.ts) — All blog posts are defined as TypeScript constants. This makes the blog non-editable without a deploy.

**Future:** Consider MDX files or a headless CMS for scalable content.

### 8.5 🟢 Consistent Code Style

The codebase uses consistent patterns:
- Component naming (PascalCase)
- File naming (camelCase for libs, PascalCase for components)
- Import ordering
- Error handling (try/catch with user-friendly messages)

---

## 9. Prioritized Action Plan

### 🔴 P0 — Critical (Fix This Week)

| # | Issue | Impact | Effort |
|---|---|---|---|
| 1 | **Split `PDFToolClient.tsx`** into per-tool components | 54KB JS on every PDF page; unmaintainable | High |
| 2 | **Fix rate limit Map memory leak** in `proxy.ts` | Unbounded memory growth in production | Low |
| 3 | **Add focus trap** to download dialog and mega menu | Accessibility violation (WCAG 2.1 AA) | Low |
| 4 | **Add basic tests** for `parsePageRange`, `validateFile`, `sanitize`, `search` | Zero test coverage on critical paths | Medium |

### 🟡 P1 — Important (Fix This Month)

| # | Issue | Impact | Effort |
|---|---|---|---|
| 5 | **Consolidate DRY violations** (`clamp`, `canvasToBlob`, `loadImage`, `revoke`, shared UI) | Maintenance overhead, potential divergence | Medium |
| 6 | **Lazy-load search dialog and mega menu** in Navbar | ~32KB unnecessary client JS on every page | Medium |
| 7 | **Move search index server-side** | Blog content leaking into client bundle | Medium |
| 8 | **Document PDF compression behavior** (rasterization) in UI | Users lose text content without knowing | Low |
| 9 | **Anchor malicious URL patterns** in proxy regex | False positives on legitimate URLs | Low |
| 10 | **Reduce layout-level keyword list** | Potential SEO keyword stuffing penalty | Low |

### 🟢 P2 — Nice to Have (Backlog)

| # | Issue | Impact | Effort |
|---|---|---|---|
| 11 | Add dark mode support | User preference, competitive feature | Medium |
| 12 | Web Worker for heavy Canvas operations | UI freeze on large images | High |
| 13 | E2E tests with Playwright for critical user flows | Regression protection | High |
| 14 | Move blog to MDX/CMS | Scalable content creation | Medium |
| 15 | Batch file identity using UUID instead of name+size | Edge case bug fix | Low |
| 16 | `PAGE_SIZES` constant dedup in pdfProcessor | Minor code cleanliness | Low |

---

## Summary

The FreeConvert codebase is **well-architected at the foundation level** — the privacy-first client-side processing model, lazy loading of heavy libraries, input validation/sanitization, and SEO infrastructure are all solid.

The **two biggest problems** are:
1. **`PDFToolClient.tsx`** — a 1,571-line monolith that violates single-responsibility and bloats every PDF page
2. **No tests** — critical file processing, search ranking, and input validation code has zero test coverage

The **DRY violations** are widespread (~9 documented instances) but each is individually small and easy to fix. Fixing them all would save ~500 lines and eliminate divergence risk.

**No show-stopping bugs** were found. The build passes cleanly, TypeScript catches type errors, and the security model is reasonable for a client-side tool. The rate limit memory leak (P0) is the only runtime bug that would manifest in production.
