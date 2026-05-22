# Technical SEO & Architecture Audit — freeconvert.in

> **Focus:** Technical infrastructure, crawlability, structured data, performance, security  
> **Grading:** ✅ PASS | ⚠️ WARN | ❌ FAIL

---

## 1. Structured Data (Schema.org)

### Global Markup

| Schema Type | Location | Valid? | Notes |
|------------|----------|:------:|-------|
| `WebSite` | `layout.tsx` | ✅ | Includes SearchAction with URL template |
| `Organization` | `layout.tsx` | ✅ | Logo, name, URL — missing `contactPoint`, `sameAs` |
| `CollectionPage` | `page.tsx` (home) | ✅ | ItemList with all tools |
| `CollectionPage` | `blog/page.tsx` | ✅ | ItemList with all blog posts |

### Per-Page Markup

| Page Type | Schema Types | Status |
|-----------|-------------|:------:|
| Image tool pages | `SoftwareApplication` + `FAQPage` + `BreadcrumbList` | ✅ |
| PDF tool pages | `SoftwareApplication` + `FAQPage` + `BreadcrumbList` | ✅ |
| Utility tool pages | `SoftwareApplication` + `FAQPage` + `BreadcrumbList` | ✅ |
| Blog posts | `BlogPosting` + `BreadcrumbList` | ✅ |
| Legal pages | None | ⚠️ Missing `WebPage` schema |
| About page | None | ⚠️ Missing `AboutPage` schema |
| Contact page | None | ⚠️ Missing `ContactPage` schema |

### Improvements Needed

| Issue | Priority |
|-------|:--------:|
| Add `sameAs` to Organization (social media links) | Medium |
| Add `contactPoint` to Organization | Medium |
| Add `WebPage` schema to legal pages | Low |
| Add `AboutPage` and `ContactPage` schemas | Low |
| `BlogPosting.dateModified` equals `datePublished` — update when content changes | Medium |
| `BlogPosting.image` reuses site-wide OG image | Medium |

---

## 2. Meta Tags & SEO Fundamentals

### Root Layout Meta

| Tag | Status | Notes |
|-----|:------:|-------|
| `<title>` template | ✅ | `%s | FreeConvert` pattern |
| `meta description` | ✅ | Unique per page |
| `meta keywords` | ✅ | Present (though Google ignores them) |
| Canonical URLs | ✅ | Set on all pages |
| `hreflang` alternates | ✅ | `en-IN`, `en-US`, `x-default` |
| Open Graph tags | ✅ | Complete with images |
| Twitter cards | ✅ | `summary_large_image` |
| `meta robots` | ✅ | `index, follow` with `googleBot` directives |
| `meta viewport` | ✅ | `device-width, initial-scale=1, maximumScale=5` |
| `meta theme-color` | ✅ | Light/dark media queries |
| Google Site Verification | ✅ | Conditional on env var |

### Per-Page Meta Quality

| Page Type | Unique Title | Unique Description | Canonical | OG Image | Grade |
|-----------|:----------:|:-----------------:|:---------:|:--------:|:-----:|
| Homepage | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tool pages | ✅ | ✅ | ✅ | ⚠️ Site-wide | ⚠️ |
| Blog posts | ✅ | ✅ | ✅ | ⚠️ Site-wide | ⚠️ |
| Legal pages | ✅ | ✅ | ✅ | ⚠️ Site-wide | ⚠️ |
| About | ✅ | ✅ | ✅ | ⚠️ Site-wide | ⚠️ |

> [!NOTE]
> All pages reuse the same `/opengraph-image` OG image. While not a ranking factor, unique OG images improve click-through rates from social shares and improve the "content richness" signal.

---

## 3. Crawlability Analysis

### What Googlebot Sees vs. Users See

The site uses client-side rendering for tool functionality. Here's the crawlability gap:

| Component | User sees | Googlebot sees |
|-----------|-----------|---------------|
| Tool editor UI | ✅ Full interactive editor | ❌ Empty `<div>` |
| `CrawlableToolFallback` | ❌ (replaced by editor) | ✅ Static fallback text |
| `ToolContentSections` | ✅ Notes, FAQs, related | ✅ Same content |
| File upload area | ✅ Dropzone | ❌ Nothing |
| Tool output preview | ✅ Canvas/image | ❌ Nothing |

### CrawlableToolFallback Analysis

The `CrawlableToolFallback` component renders a static version for crawlers. It contains:
- Tool title (h1)
- Short description
- Feature checklist (~60 words)
- "Browser-based processing" explanation (~50 words)
- `<noscript>` fallback message

**Total crawlable content from fallback: ~110 words** — too thin for a standalone page.

### Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://freeconvert.in/sitemap.xml
```

✅ Correctly configured. No issues.

### Sitemap Coverage

| Content Type | In Sitemap? | Count |
|-------------|:----------:|:-----:|
| Homepage | ✅ | 1 |
| Image tools | ✅ | 25 |
| PDF tools | ✅ | 23+ |
| Utility tools | ✅ | 28 |
| Blog listing | ✅ | 1 |
| Blog posts | ✅ | 8 |
| Legal pages | ✅ | 5 |
| About | ✅ | 1 |
| Contact | ✅ | 1 |
| Search | ✅ | 1 |

✅ All discoverable pages are in the sitemap.

### `lastModified` Issue

```typescript
const lastModified = new Date("2026-05-19T00:00:00.000Z");
```

⚠️ All pages share the same `lastModified` date. This should be per-page or at least per-category.

---

## 4. URL Structure & Redirects

### URL Pattern Quality

| Category | Pattern | Example | Grade |
|----------|---------|---------|:-----:|
| Image tools | `/{action}-{target}` | `/resize-image`, `/compress-jpg` | ✅ |
| PDF tools | `/{action}-pdf` | `/merge-pdf`, `/compress-pdf` | ✅ |
| Utility tools | `/{tool-name}` | `/qr-code-generator`, `/emi-calculator` | ✅ |
| Blog | `/blog/{slug}` | `/blog/compress-image-without-quality-loss` | ✅ |
| Legal | `/{page}` | `/privacy-policy`, `/terms-of-service` | ✅ |

✅ Clean, descriptive, keyword-rich URLs throughout.

### Redirect Configuration

The `next.config.ts` configures **47 redirects** (all `301 permanent`). These handle:
- Legacy `/tools/*` paths → new flat paths
- Legacy `/pdf/*` paths → new flat paths
- Alternative slugs → canonical slugs

✅ Well-structured redirect chains. No circular redirects detected.

⚠️ One issue: `/tools` → `/` is a `302 temporary` redirect. Should be `301 permanent` for SEO consistency.

---

## 5. Security Headers

| Header | Value | Grade |
|--------|-------|:-----:|
| `Cross-Origin-Opener-Policy` | `same-origin` (PDF tools) | ✅ |
| `Cross-Origin-Embedder-Policy` | `credentialless` | ✅ |
| `Cross-Origin-Resource-Policy` | `same-origin` (assets) | ✅ |
| `X-Frame-Options` | `SAMEORIGIN` | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | camera, mic, geo, payment, usb denied | ✅ |
| `Content-Security-Policy` | Comprehensive policy | ✅ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ |

✅ **Security headers are excellent.** This is above average for a tool site.

### CSP Analysis

The CSP allows:
- Google AdSense / DoubleClick / Tag Manager scripts
- Google Analytics connections
- hCaptcha scripts and frames
- Google Fonts
- Blob URLs for Workers/WASM
- `staticimgly.com` for background removal model
- `tessdata.projectnaptha.com` for OCR data

⚠️ `'unsafe-inline'` and `'unsafe-eval'` are present in `script-src`. These are required by AdSense but reduce CSP effectiveness. Consider adding nonces when possible.

---

## 6. Performance & Caching

### Static Asset Caching

| Asset Pattern | Cache-Control | Grade |
|---------------|---------------|:-----:|
| `/icons/*` | `public, max-age=31536000, immutable` | ✅ |
| `/ffmpeg/*` | COEP/CORP headers (no explicit cache) | ⚠️ |
| `/tesseract/*` | COEP/CORP headers (no explicit cache) | ⚠️ |
| `/qpdf.wasm` (2.2 MB) | COEP/CORP headers (no explicit cache) | ⚠️ |

**Recommendation:** Add long-term caching headers to WASM and heavy worker files:
```typescript
{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }
```

### JavaScript Bundle Strategy

- ✅ Next.js automatic code splitting
- ✅ Turbopack enabled for dev
- ✅ Heavy libraries (FFmpeg, Tesseract, pdfjs) loaded per-tool
- ✅ Web Workers for image compression
- ⚠️ `pdf.worker.min.mjs` in `/public` is 1.2 MB — should be served with compression headers

---

## 7. Internal Linking Structure

### Navigation Coverage

| Navigation Element | Links To | Grade |
|--------------------|----------|:-----:|
| Navbar | Tool categories (expandable), Search, About, Blog | ✅ |
| Footer | All image tools, 10 PDF tools, 10 utility tools, all legal, company pages | ✅ |
| Tool pages → Related tools | 4 related tools per page | ✅ |
| Blog posts → Related tools | 3 related tools per post | ✅ |
| Homepage → All categories | All tool categories with anchor links | ✅ |

### Missing Internal Links

| From | To | Impact |
|------|-----|--------|
| Tool pages | Related blog posts | High — content interlinking |
| Blog posts | Other blog posts | Medium — editorial depth |
| About page | Blog, specific tools | Medium — context |
| Legal pages | Contact page | Low |

> [!TIP]
> Adding "Related guides" links on tool pages and "Continue reading" links between blog posts would significantly improve content interconnection, which is a positive signal for Google.

---

## 8. Cookie & Consent Implementation

| Feature | Implementation | Grade |
|---------|---------------|:-----:|
| Cookie consent banner | `react-cookie-consent` component | ✅ |
| Google Consent Mode v2 | `gtag('consent', 'default', {...})` | ✅ |
| Default consent state | All denied (analytics, ads, personalization) | ✅ |
| Wait for update | 500ms | ✅ |
| Consent storage | LocalStorage | ✅ |

✅ **GDPR/CCPA compliance is well-implemented.** This is actually better than most tool sites.

---

## 9. Ads.txt Verification

```typescript
// Route handler generates:
// google.com, pub-3774746436015217, DIRECT, f08c47fec0942fa0
```

✅ Dynamic `ads.txt` generation is correct. Publisher ID matches the AdSense account.

⚠️ `dynamic = "force-dynamic"` — consider caching this for 1 hour since the content rarely changes.

---

## 10. Summary — Technical SEO Scorecard

| Category | Grade | Notes |
|----------|:-----:|-------|
| Structured data | ✅ | Rich schema, minor gaps on info pages |
| Meta tags | ✅ | Complete, unique per page |
| Crawlability | ⚠️ | Tool UIs invisible to bots, thin fallback |
| URL structure | ✅ | Clean, descriptive, keyword-rich |
| Redirects | ✅ | 47 proper 301s, one 302 |
| Security headers | ✅ | Enterprise-grade |
| Performance | ⚠️ | Missing cache headers on large assets |
| Internal linking | ⚠️ | Missing cross-content links |
| Cookie consent | ✅ | Proper Consent Mode v2 |
| Ads.txt | ✅ | Correctly generated |
| Sitemap | ✅ | Complete coverage |
| Robots.txt | ✅ | Properly configured |

> [!IMPORTANT]
> **The technical SEO is solid.** The rejection is not caused by technical issues — it's a **content quality and volume problem.** The architecture is ready for AdSense once the content meets thresholds.
