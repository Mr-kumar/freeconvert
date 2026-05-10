import type { Metadata } from "next";
import { BASE_URL } from "@/lib/tools";

const openGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "FreeConvert - Free Online Image, PDF and Utility Tools",
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function titleWithBrand(title: string) {
  return title.includes("FreeConvert") ? title : `${title} | FreeConvert`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = titleWithBrand(title);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [openGraphImage.url],
    },
    ...(robots ? { robots } : {}),
  };
}
