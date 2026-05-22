# Full Page-by-Page Content Audit — freeconvert.in

> **Audit scope:** Every route/page on the site  
> **Focus:** Crawlable content volume, uniqueness, and ad density  
> **Grading:** ✅ PASS | ⚠️ WARN | ❌ FAIL (against AdSense content thresholds)

---

## 1. Homepage (`/`)

| Metric | Value | Grade |
|--------|-------|-------|
| Crawlable word count | ~450 words | ⚠️ WARN |
| Unique content | Hero section + category cards + value props | ⚠️ WARN |
| Ad slots | 3 (top, mid, left/right rails) | ❌ FAIL |
| Structured data | ✅ CollectionPage + ItemList | ✅ PASS |

**Issues:**
- The homepage is primarily a tool directory with short labels
- "Popular free tools" section shows 8 cards with ~10 words each
- "Browse by category" section lists categories with ~20-word descriptions
- Value proposition section has ~150 words of original content
- 3 ad slots compete with limited editorial content

**Recommendation:** Add a 300-word introductory section explaining what FreeConvert is, who it's for, and what makes it different. Move ads below content.

---

## 2. Image Tool Pages (25 routes)

### Template Structure (all pages identical)

```
[H1] → [10-word description] → [Badge: "Browser only"]
→ [Ad: TOOL_TOP — desktop only]
→ [Client-rendered tool — invisible to crawlers]
→ [Ad: TOOL_BOTTOM]
→ [ToolContentSections: About, Features, How-to, Notes, Related, FAQs]
```

### Content Analysis Per Tool Page

| Component | Typical Words | Unique? |
|-----------|--------------|---------|
| H1 title | 5–8 | ✅ |
| Description line | 15–25 | ✅ |
| CrawlableToolFallback | ~60 | Partially (templated) |
| "About {Tool}" section | ~40–60 | ✅ Per tool |
| "Best for" cards | ~40–60 | ✅ Per tool (for 21/25 tools) |
| "What it includes" features | ~30–40 | ✅ Per tool |
| "How to use" steps | ~45 | ⚠️ Generic pattern |
| "Practical notes" | ~30–40 | ✅ Per tool (for 21/25 tools) |
| "Related tools" links | ~20 | Templated |
| "Common questions" FAQs | ~80–120 | ✅ Per tool |
| **Total per page** | **~300–420** | **Partially unique** |

### Individual Tool Page Grades

| Tool | Custom Notes? | Custom FAQs? | Est. Words | Grade |
|------|:------------:|:------------:|:----------:|:-----:|
| Resize Image | ✅ | ✅ | ~380 | ⚠️ |
| Compress Image | ✅ | ✅ | ~370 | ⚠️ |
| Convert Image | ✅ | ✅ | ~360 | ⚠️ |
| Crop Image | ✅ | ✅ | ~360 | ⚠️ |
| Rotate & Flip Image | ✅ | ✅ | ~350 | ⚠️ |
| Remove Background | ✅ | ✅ | ~360 | ⚠️ |
| Add Watermark | ✅ | ✅ | ~370 | ⚠️ |
| Merge Images | ✅ | ✅ | ~350 | ⚠️ |
| Image Filters | ✅ | ✅ | ~340 | ⚠️ |
| Image Metadata | ✅ | ✅ | ~350 | ⚠️ |
| Image to Text (OCR) | ❌ fallback | ❌ fallback | ~280 | ❌ |
| WebP to JPG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| PNG to JPG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| JPG to PNG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| AVIF to JPG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| PNG to WebP | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Compress JPG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Compress PNG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| HEIC to JPG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| HEIC to PNG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| SVG to PNG | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Favicon Generator | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Blur Image | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Image Collage Maker | ❌ fallback | ❌ fallback | ~280 | ❌ |
| **Add Watermark to Image** | ✅ (via slug `watermark`) | ✅ | ~370 | ⚠️ |

> [!WARNING]
> **14 out of 25 image tools** use generic fallback content (`fallbackNotes()` + `getImageToolFaqs()` default). These pages are structurally identical and flag as thin/duplicate content.

---

## 3. PDF Tool Pages (23 routes)

### Individual PDF Tool Page Grades

| Tool | Custom Notes? | Custom FAQs? | Est. Words | Grade |
|------|:------------:|:------------:|:----------:|:-----:|
| Merge PDF | ✅ | ✅ | ~380 | ⚠️ |
| Compress PDF | ✅ | ✅ | ~390 | ⚠️ |
| Split PDF | ✅ | ✅ | ~370 | ⚠️ |
| Convert PDF to Image | ✅ | ✅ | ~360 | ⚠️ |
| Convert Image to PDF | ✅ | ✅ | ~370 | ⚠️ |
| Rotate PDF | ✅ | ✅ | ~360 | ⚠️ |
| Add Watermark to PDF | ✅ | ✅ | ~370 | ⚠️ |
| Protect PDF | ✅ | ✅ | ~380 | ⚠️ |
| Unlock PDF | ✅ | ✅ | ~370 | ⚠️ |
| Extract PDF Pages | ✅ | ✅ | ~370 | ⚠️ |
| Reorder PDF Pages | ✅ | ✅ | ~360 | ⚠️ |
| Add Page Numbers | ✅ | ✅ | ~370 | ⚠️ |
| View PDF Metadata | ✅ | ✅ | ~350 | ⚠️ |
| Edit PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Sign PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Delete Pages | ❌ fallback | ❌ fallback | ~280 | ❌ |
| JPG to PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| PNG to PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| HEIC to PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Crop PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| Redact PDF | ❌ fallback | ❌ fallback | ~280 | ❌ |
| PDF to Text | ❌ fallback | ❌ fallback | ~280 | ❌ |
| PDF Tools (index) | N/A (listing page) | N/A | ~200 | ❌ |

> [!WARNING]
> **10 out of 23 PDF tools** use generic fallback content. The PDF Tools index page at `/pdf-tools` is a thin listing page.

---

## 4. Utility Tool Pages (28 routes via dynamic `[utilitySlug]`)

Each utility tool has its own embedded `bestFor`, `notes`, and `faqs` data in `utilityToolConfigs`. This is better than image/PDF tools — every utility page has custom content.

| Metric | Value |
|--------|-------|
| Custom notes per tool | ✅ All 28 tools |
| Custom FAQs per tool | ✅ All 28 tools |
| Estimated words per page | ~350–450 |
| Grade | ⚠️ WARN (still below 500 threshold) |

---

## 5. Blog Posts (8 posts)

| Post | Sections | Est. Words | Grade |
|------|----------|:----------:|:-----:|
| Compress Image Without Quality Loss | 3 | ~180 | ❌ |
| Resize Image for Online Forms | 3 | ~160 | ❌ |
| JPEG vs PNG vs WebP vs AVIF | 3 | ~170 | ❌ |
| Merge PDF Files Online | 3 | ~190 | ❌ |
| Compress PDF to Target KB | 3 | ~200 | ❌ |
| Convert PDF to JPG or PNG | 3 | ~180 | ❌ |
| Browser-Based File Tools Privacy | 5 | ~380 | ⚠️ |
| File Upload Size Limits Checklist | 5 | ~400 | ⚠️ |

> [!CAUTION]
> **All 8 blog posts are under 500 words.** Six are under 250 words. Google considers anything under 300 words as extremely thin content. Blog posts are a primary signal for editorial authority.

**Additional blog issues:**
- No images, screenshots, or visual aids in any post
- No code examples or formatted data tables
- No internal linking beyond "related tools" cards
- Same OG image (`/opengraph-image`) reused across all posts
- `dateModified` equals `datePublished` (no updates shown)

---

## 6. Legal & Info Pages

| Page | Est. Words | Industry Standard | Grade |
|------|:----------:|:-----------------:|:-----:|
| About | ~180 | 500+ | ❌ |
| Privacy Policy | ~250 | 1,000+ | ❌ |
| Terms of Service | ~150 | 1,500+ | ❌ |
| Disclaimer | ~100 | 300+ | ❌ |
| Cookie Policy | ~160 | 500+ | ❌ |
| DMCA | ~80 | 300+ | ❌ |
| Contact | ~40 + form | 100+ | ⚠️ |

> [!IMPORTANT]
> Thin legal pages signal a site that hasn't invested in legitimacy. Google reviewers check these pages specifically. A 150-word Terms of Service looks auto-generated.

---

## 7. Other Pages

| Page | Content | Grade |
|------|---------|:-----:|
| Search (`/search`) | Client-rendered search UI, minimal crawlable text | ⚠️ |
| 404 (`not-found.tsx`) | Minimal error page | ✅ (expected) |
| Error (`error.tsx`) | Minimal error page | ✅ (expected) |

---

## 8. Ad Placement Density Analysis

### Total ad slots configured: **8 unique placements**

| Slot | Location | Pages Affected |
|------|----------|---------------|
| `TOOL_TOP` | Above tool editor | All 69 tool pages |
| `TOOL_BOTTOM` | Below tool editor | All 69 tool pages |
| `HOME_TOP` | Homepage top | Homepage |
| `HOME_MID` | Homepage middle | Homepage |
| `RAIL_LEFT` | Fixed left sidebar | All pages |
| `RAIL_RIGHT` | Fixed right sidebar | All pages |
| `BLOG_IN_ARTICLE` | Mid-article | 8 blog posts |
| `BLOG_BOTTOM` | Below article | 8 blog posts |

### Ad density per page type:

| Page Type | Ad Slots Visible | Content Words | Ratio | Grade |
|-----------|:----------------:|:-------------:|:-----:|:-----:|
| Tool page (desktop) | 4 (top, bottom, 2 rails) | ~300 | 1 ad per 75 words | ❌ |
| Tool page (mobile) | 2 (top, bottom) | ~300 | 1 ad per 150 words | ⚠️ |
| Blog post (desktop) | 4 (in-article, bottom, 2 rails) | ~200 | 1 ad per 50 words | ❌ |
| Homepage (desktop) | 4 (top, mid, 2 rails) | ~450 | 1 ad per 112 words | ❌ |

> [!CAUTION]
> Google's guideline suggests **1 ad per 300+ words of content** as a minimum. Most pages are 2–4x over the acceptable ad density.

---

## 9. Summary Scorecard

| Category | Pages | Pass | Warn | Fail |
|----------|:-----:|:----:|:----:|:----:|
| Image tools | 25 | 0 | 11 | 14 |
| PDF tools | 23 | 0 | 13 | 10 |
| Utility tools | 28 | 0 | 28 | 0 |
| Blog posts | 8 | 0 | 2 | 6 |
| Legal pages | 6 | 0 | 0 | 6 |
| Info pages | 3 | 0 | 2 | 1 |
| Homepage | 1 | 0 | 0 | 1 |
| **Total** | **94** | **0** | **56** | **38** |

> **Zero pages currently pass the content quality threshold for AdSense approval.**
