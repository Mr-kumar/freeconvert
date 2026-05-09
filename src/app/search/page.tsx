import type { Metadata } from "next";
import { BASE_URL } from "@/lib/tools";
import { normalizeSearchQuery } from "@/lib/search";
import SearchPageClient from "./SearchPageClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = normalizeSearchQuery((await searchParams).q);

  return {
    title: query ? `Search results for "${query}"` : "Search FreeConvert",
    description: query
      ? `Search FreeConvert image tools and guides for ${query}.`
      : "Search FreeConvert image tools and guides for resizing, compression, conversion, background removal and more.",
    alternates: {
      canonical: `${BASE_URL}/search`,
    },
    robots: {
      index: !query,
      follow: true,
      googleBot: {
        index: !query,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: "Search FreeConvert",
      description: "Find image tools and guides on FreeConvert.",
      url: `${BASE_URL}/search`,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normalizeSearchQuery((await searchParams).q);

  return <SearchPageClient initialQuery={query} />;
}
