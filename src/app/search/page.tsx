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
      ? `Search FreeConvert image, PDF and utility tools for ${query}.`
      : "Search FreeConvert image, PDF, QR, text, calculator, color, password and developer tools.",
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
      description: "Find image, PDF and utility tools on FreeConvert.",
      url: `${BASE_URL}/search`,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Search FreeConvert",
      description: "Find image, PDF and utility tools on FreeConvert.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normalizeSearchQuery((await searchParams).q);

  return <SearchPageClient initialQuery={query} />;
}
