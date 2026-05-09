import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BASE_URL } from "@/lib/tools";
import { safeJsonLd } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "FreeConvert",
      description: "Free online image tools. No upload required.",
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "FreeConvert",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon`,
        width: 512,
        height: 512,
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FreeConvert - Free Online Image Tools. No Upload Required.",
    template: "%s | FreeConvert.in",
  },
  description:
    "FreeConvert offers free online image tools to resize, compress, convert, crop, remove background, add watermark and more. Processing runs in your browser.",
  keywords: [
    "free image converter online india",
    "image resizer online free",
    "compress image online free",
    "convert image format free",
    "crop image online free",
    "remove background from image free",
    "add watermark to image free",
    "merge images online",
    "jpeg to png converter",
    "png to webp converter",
    "image metadata viewer",
  ],
  authors: [{ name: "FreeConvert", url: BASE_URL }],
  creator: "FreeConvert",
  publisher: "FreeConvert",
  generator: "Next.js",
  category: "technology",
  classification: "Free Online Tools",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "en-US": BASE_URL,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "FreeConvert",
    title: "FreeConvert - Free Online Image Tools",
    description:
      "Resize, compress, convert, crop and edit images free. Processing runs in your browser.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FreeConvert - Free Online Image Tools",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeConvert - Free Online Image Tools",
    description:
      "Resize, compress, convert, crop and remove image backgrounds free. No uploads.",
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FreeConvert",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon", type: "image/png" }],
    apple: "/apple-icon",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
