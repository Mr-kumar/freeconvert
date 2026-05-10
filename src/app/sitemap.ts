import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { BASE_URL, pdfTools, tools } from "@/lib/tools";
import { utilityTools } from "@/lib/utilityTools";

const lastModified = new Date("2026-05-10T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: tool.priority,
  }));
  const pdfToolRoutes = pdfTools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: tool.priority,
  }));
  const utilityToolRoutes = utilityTools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: tool.priority,
  }));

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes,
    {
      url: `${BASE_URL}/pdf-tools`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...pdfToolRoutes,
    ...utilityToolRoutes,
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.35,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.45,
    })),
    ...[
      "privacy-policy",
      "terms-of-service",
      "disclaimer",
      "cookie-policy",
      "dmca",
    ].map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
