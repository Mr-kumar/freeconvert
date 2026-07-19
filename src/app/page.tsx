import type { Metadata } from "next";
import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import { HomeTools } from "@/components/HomeTools";
import { allToolConfigs, BASE_URL } from "@/lib/tools";
import { utilityTools } from "@/lib/utilityTools";
import { safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FreeConvert - Free Online Image, PDF, HTML, Media & Utility Tools",
  description:
    "Use free online image, PDF, HTML, media, QR, text, calculator, color, password and developer tools in your browser. No upload or account required.",
  keywords: [
    "free online image tools",
    "free online pdf tools",
    "free online html tools",
    "html to pdf online",
    "html viewer online",
    "html formatter online",
    "free online tools",
    "qr code generator free",
    "upi qr code generator",
    "word counter online",
    "json formatter online",
    "password generator free",
    "emi calculator online",
    "gst calculator online",
    "compress image online",
    "resize image online",
    "merge pdf online",
    "compress pdf online",
    "heic to jpg online",
    "video compressor online",
    "mp4 to mp3 converter",
    "pdf editor online",
    "character counter online",
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
    title: "Free Online Image, PDF, HTML, Media & Utility Tools | FreeConvert",
    description:
      "Free browser-based tools for images, PDFs, HTML code, media files, QR codes, text, calculators, colors, passwords and developer utilities.",
    url: BASE_URL,
    siteName: "FreeConvert",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image, PDF, HTML, Media & Utility Tools | FreeConvert",
    description:
      "Free browser-based image, PDF, HTML, media and utility tools. No upload and no account required.",
    images: ["/opengraph-image"],
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE_URL}/#tools`,
  name: "Free Online Image, PDF, HTML, Media and Utility Tools",
  url: BASE_URL,
  description:
    "Browse free browser-based tools for images, PDFs, HTML code, media files, QR codes, text, calculators and developer utilities on FreeConvert.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...allToolConfigs, ...utilityTools].map((tool, index) => ({
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
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-9 text-center sm:px-6 sm:py-20">
          <p className="mb-4 inline-flex max-w-full rounded-full bg-white px-3 py-2 text-xs font-semibold leading-5 text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)] sm:mb-5 sm:px-4 sm:text-sm">
            100% client-side / no account / no upload
          </p>
          <h1 className="mx-auto max-w-[21rem] font-display text-[2.15rem] font-extrabold leading-[1.08] text-[var(--text)] min-[380px]:text-4xl sm:max-w-4xl sm:text-6xl sm:leading-tight">
            Free Online Image, PDF, HTML, Media & Utility Tools
          </h1>
          <p className="mx-auto mt-4 max-w-[22rem] text-base leading-7 text-[var(--muted)] sm:mt-5 sm:max-w-3xl sm:text-lg sm:leading-8">
            Resize images, merge PDFs, preview HTML, convert HTML to PDF, compress
            videos, extract text, generate QR codes and use daily calculators.
            Everything runs directly in your browser.
          </p>
        </div>
      </section>

      <AdSlot
        className="pb-2"
        format="horizontal"
        minHeight={96}
        minViewportWidth={640}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP}
      />

      <HomeTools />
    </main>
  );
}
