import type { Metadata } from "next";
import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import { HomeTools } from "@/components/HomeTools";
import { allToolConfigs, BASE_URL } from "@/lib/tools";
import { safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FreeConvert - Free Online Image & PDF Tools",
  description:
    "Use free online image and PDF tools to compress, resize, convert, merge, split, rotate and watermark files in your browser. No upload or account required.",
  keywords: [
    "free online image tools",
    "free online pdf tools",
    "compress image online",
    "resize image online",
    "merge pdf online",
    "compress pdf online",
    "split pdf online",
    "pdf to jpg converter",
    "jpg to pdf converter",
    "free image tools no upload",
    "free pdf tools no upload",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Free Online Image & PDF Tools - No Upload Required | FreeConvert",
    description:
      "Free online tools to resize, compress and convert images, plus merge, split, rotate and watermark PDFs in your browser.",
    url: BASE_URL,
    siteName: "FreeConvert",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image & PDF Tools - No Upload Required | FreeConvert",
    description:
      "Free browser-based image and PDF tools. No upload and no account required.",
    images: ["/opengraph-image"],
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE_URL}/#tools`,
  name: "Free Online Image and PDF Tools",
  url: BASE_URL,
  description:
    "Browse free browser-based tools for images and PDFs on FreeConvert.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: allToolConfigs.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${BASE_URL}${tool.href}`,
    })),
  },
};

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }}
      />
      <AdRailSlots
        leftSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT}
        rightSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT}
      />
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]">
            100% client-side / no account / no upload
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-6xl">
            Free Online Image & PDF Tools
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Resize, compress and convert images. Merge, split, rotate and
            watermark PDFs. Everything runs directly in your browser.
          </p>
        </div>
      </section>

      <AdSlot
        className="pb-2"
        minHeight={96}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP}
      />

      <HomeTools />
    </main>
  );
}
