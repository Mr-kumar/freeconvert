import { blogPosts } from "@/lib/blog";
import { tools } from "@/lib/tools";

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

const pageResults: SearchResult[] = [
  {
    title: "All Image Tools",
    description: "Browse every FreeConvert image tool in one place.",
    href: "/",
    category: "Page",
    keywords: ["home", "freeconvert", "image tools", "online tools"],
    priority: 0.5,
  },
  {
    title: "About FreeConvert",
    description: "Learn how FreeConvert processes images locally in your browser.",
    href: "/about",
    category: "Page",
    keywords: ["about", "privacy", "client side", "no upload"],
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

export const searchIndex: SearchResult[] = [
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

export const popularSearches = [
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

  return searchIndex
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
