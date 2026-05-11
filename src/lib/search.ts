import { blogPosts } from "@/lib/blog";
import { pdfTools, tools } from "@/lib/tools";
import { utilityTools } from "@/lib/utilityTools";

type SearchCategory = "Tool" | "Guide" | "Page";

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
  keywords: string[];
  priority: number;
}

const toolAliases: Record<string, string[]> = {
  resize: [
    "px",
    "pixel",
    "pixels",
    "dimension",
    "dimensions",
    "photo size",
    "exam form",
    "online form",
    "target kb",
    "35 kb",
    "passport photo",
  ],
  compress: [
    "kb",
    "mb",
    "file size",
    "reduce size",
    "target size",
    "target kb",
    "35 kb",
    "20 kb",
    "10 kb",
    "photo compressor",
  ],
  convert: [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "format changer",
    "change format",
  ],
  crop: ["ratio", "square", "passport", "trim", "cut photo"],
  "rotate-flip": ["rotate", "flip", "mirror", "straighten"],
  "background-removal": ["remove bg", "transparent background", "cutout"],
  watermark: ["logo", "text watermark", "copyright", "brand"],
  merge: ["combine", "join", "collage", "grid", "side by side"],
  filters: ["brightness", "contrast", "saturation", "enhance", "edit photo"],
  metadata: ["exif", "camera data", "strip metadata", "privacy"],
};

const pdfToolAliases: Record<string, string[]> = {
  "merge-pdf": ["combine pdf", "join pdf", "pdf merge", "pdf merge free india"],
  "compress-pdf": [
    "reduce pdf size",
    "pdf compressor",
    "pdf size kam",
    "pdf compress kaise kare",
  ],
  "split-pdf": ["separate pdf", "break pdf", "pdf splitter", "split pages"],
  "convert-pdf-to-image": ["pdf to jpg", "pdf to png", "convert pdf pages"],
  "convert-image-to-pdf": ["jpg to pdf", "png to pdf", "image to pdf banana"],
  "rotate-pdf": ["turn pdf", "rotate pages", "pdf rotate"],
  "add-watermark-to-pdf": ["pdf watermark", "confidential", "draft watermark"],
  "protect-pdf": ["password protect", "secure pdf", "encrypt pdf"],
  "unlock-pdf": ["remove password", "decrypt pdf", "unlock pdf"],
  "extract-pdf-pages": ["extract page", "save selected pages", "pull pages"],
  "reorder-pdf-pages": ["organize pages", "move pages", "reverse pdf"],
  "add-page-numbers-to-pdf": ["number pages", "footer page number", "page numbering"],
  "view-pdf-metadata": ["pdf properties", "strip metadata", "pdf info"],
};

const utilityToolAliases: Record<string, string[]> = {
  "qr-code-generator": ["qr", "qr code", "create qr", "barcode", "scan code"],
  "upi-qr-code-generator": ["upi qr", "payment qr", "upi id qr", "pay qr"],
  "word-counter": ["word count", "character count", "reading time", "essay count"],
  "text-case-converter": ["uppercase", "lowercase", "title case", "camelcase"],
  "remove-duplicate-lines": ["unique lines", "dedupe", "remove duplicates", "list cleaner"],
  "emi-calculator": ["loan emi", "monthly emi", "home loan", "personal loan"],
  "gst-calculator": ["add gst", "remove gst", "tax calculator", "gst amount"],
  "percentage-calculator": ["percent", "percentage change", "discount", "marks percent"],
  "age-calculator": ["date of birth", "dob", "years months days", "birthday"],
  "sip-calculator": ["mutual fund", "investment", "sip return", "future value"],
  "color-picker": ["hex", "rgb", "hsl", "color converter"],
  "color-contrast-checker": ["wcag", "accessibility", "contrast ratio", "aa aaa"],
  "length-converter": ["meter to feet", "cm to inch", "unit converter"],
  "weight-converter": ["kg to lbs", "grams", "pounds", "ounces"],
  "area-converter": ["square feet", "acre", "hectare", "land area"],
  "password-generator": ["random password", "strong password", "secure password"],
  "password-strength-checker": ["password check", "entropy", "password security"],
  "json-formatter": ["json validator", "json beautifier", "json minifier", "api json"],
  "base64-encoder-decoder": ["base64 encode", "base64 decode", "b64"],
  "url-encoder-decoder": ["url encode", "url decode", "percent encoding"],
  "file-hash-checksum": ["sha256", "checksum", "file hash", "sha hash"],
  "zip-extractor": ["unzip", "zip creator", "create zip", "extract zip"],
};

const pageResults: SearchResult[] = [
  {
    title: "All FreeConvert Tools",
    description: "Browse FreeConvert image, PDF and utility tools in one place.",
    href: "/",
    category: "Page",
    keywords: ["home", "freeconvert", "image tools", "pdf tools", "utility tools", "online tools"],
    priority: 0.5,
  },
  {
    title: "PDF Tools",
    description: "Browse all FreeConvert PDF tools in one place.",
    href: "/pdf-tools",
    category: "Page",
    keywords: ["pdf", "pdf tools", "merge pdf", "compress pdf", "split pdf"],
    priority: 0.5,
  },
  {
    title: "About FreeConvert",
    description:
      "Learn how FreeConvert processes image, PDF and utility tasks locally in your browser.",
    href: "/about",
    category: "Page",
    keywords: ["about", "privacy", "client side", "no upload", "pdf tools", "utility tools"],
    priority: 0.35,
  },
  {
    title: "Contact",
    description: "Send feedback or support questions to FreeConvert.",
    href: "/contact",
    category: "Page",
    keywords: ["contact", "support", "help", "feedback"],
    priority: 0.35,
  },
  {
    title: "Privacy Policy",
    description: "Read how FreeConvert handles privacy, cookies and local files.",
    href: "/privacy-policy",
    category: "Page",
    keywords: ["privacy", "cookies", "adsense", "analytics"],
    priority: 0.2,
  },
];

let searchIndexCache: SearchResult[] | null = null;

function getSearchIndex() {
  searchIndexCache ??= [
    ...tools.map((tool) => ({
      title: tool.name,
      description: tool.description,
      href: tool.href,
      category: "Tool" as const,
      keywords: [
        tool.shortName,
        tool.homeDescription,
        ...tool.keywords,
        ...tool.features,
        ...(toolAliases[tool.slug] ?? []),
      ],
      priority: tool.priority + 1,
    })),
    ...pdfTools.map((tool) => ({
      title: tool.name,
      description: tool.description,
      href: tool.href,
      category: "Tool" as const,
      keywords: [
        tool.shortName,
        tool.homeDescription,
        ...tool.keywords,
        ...tool.features,
        ...(pdfToolAliases[tool.slug] ?? []),
      ],
      priority: tool.priority + 1,
    })),
    ...utilityTools.map((tool) => ({
      title: tool.name,
      description: tool.description,
      href: tool.href,
      category: "Tool" as const,
      keywords: [
        tool.shortName,
        tool.homeDescription,
        ...tool.keywords,
        ...tool.features,
        ...(utilityToolAliases[tool.slug] ?? []),
      ],
      priority: tool.priority + 1,
    })),
    ...blogPosts.map((post) => ({
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      category: "Guide" as const,
      keywords: [
        post.readTime,
        ...post.sections.flatMap((section) => [
          section.heading,
          ...section.body,
        ]),
      ],
      priority: 0.65,
    })),
    ...pageResults,
  ];

  return searchIndexCache;
}

export const popularSearches = [
  "merge pdf",
  "compress pdf",
  "pdf to jpg",
  "jpg to pdf",
  "qr code generator",
  "upi qr code generator",
  "word counter",
  "json formatter",
  "password generator",
  "emi calculator",
  "compress image to 35 kb",
  "resize image in pixels",
  "jpg to png converter",
  "remove background",
  "add watermark",
  "merge images",
];

export function normalizeSearchQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;

  return (raw ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((term) => term.length > 1);
}

function expandTerm(term: string) {
  const aliases: Record<string, string[]> = {
    jpg: ["jpg", "jpeg"],
    jpeg: ["jpeg", "jpg"],
    bg: ["bg", "background"],
    kb: ["kb", "kilobyte", "size"],
    px: ["px", "pixel", "pixels"],
  };

  return aliases[term] ?? [term];
}

function scoreResult(result: SearchResult, terms: string[], exactQuery: string) {
  const title = result.title.toLowerCase();
  const description = result.description.toLowerCase();
  const keywords = result.keywords.join(" ").toLowerCase();
  const exact = exactQuery.toLowerCase();
  let score = result.priority;

  if (result.category === "Tool") score += 8;
  if (result.category === "Guide") score += 2;

  if (exact && title.includes(exact)) score += 14;
  if (exact && keywords.includes(exact)) score += 8;
  if (exact && description.includes(exact)) score += 4;

  for (const term of terms.flatMap(expandTerm)) {
    if (title === term) score += 10;
    if (title.includes(term)) score += 7;
    if (keywords.includes(term)) score += 4;
    if (description.includes(term)) score += 2;
    if (result.category.toLowerCase().includes(term)) score += 1;
  }

  return score;
}

export function searchSite(query: string, limit = 12) {
  const normalized = normalizeSearchQuery(query);
  const terms = tokenize(normalized);

  if (!terms.length) {
    return [];
  }

  return getSearchIndex()
    .map((result) => ({
      result,
      score: scoreResult(result, terms, normalized),
    }))
    .filter(({ score }) => score > 1)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.result.priority !== a.result.priority) {
        return b.result.priority - a.result.priority;
      }
      return a.result.title.localeCompare(b.result.title);
    })
    .slice(0, limit)
    .map(({ result }) => result);
}
