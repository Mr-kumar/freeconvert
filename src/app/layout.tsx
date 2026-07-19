import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { normalizeAdSenseClientId } from "@/lib/adsense";
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
      alternateName: "freeconvert.in",
      description:
        "Free online image, PDF and utility tools. Files and inputs stay on your device.",
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
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@freeconvert.in",
        availableLanguage: ["English", "Hindi"],
      },
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
        caption: "FreeConvert Logo",
      },
      image: {
        "@id": `${BASE_URL}/#logo`,
      },
    },
  ],
};

const adsenseClientId = normalizeAdSenseClientId(
  process.env.NEXT_PUBLIC_ADSENSE_ID,
);
const hasGoogleMeasurement =
  Boolean(adsenseClientId) || Boolean(process.env.NEXT_PUBLIC_GA_ID);

const googleConsentDefaults = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
`;

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FreeConvert - Free Online Image, PDF & Utility Tools",
    template: "%s | FreeConvert",
  },
  applicationName: "FreeConvert",
  description:
    "Use free online image, PDF, QR, text, calculator, color, password and developer tools. No upload required.",
  keywords: [
    "free online tools",
    "free browser tools",
    "free online tools india",
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
    "merge pdf online free",
    "compress pdf online free",
    "free pdf tools no upload",
    "free image tools no upload",
    "split pdf online free",
    "pdf to jpg converter",
    "jpg to pdf converter",
    "rotate pdf online",
    "add watermark to pdf",
    "pdf metadata viewer",
    "qr code generator free",
    "upi qr code generator",
    "word counter online",
    "text case converter",
    "json formatter online",
    "base64 encoder decoder",
    "url encoder decoder",
    "password generator free",
    "password strength checker",
    "emi calculator online",
    "gst calculator online",
    "percentage calculator",
    "age calculator",
    "sip calculator",
    "color picker online",
    "color contrast checker",
    "unit converter online",
    "file hash checksum",
    "zip extractor online",
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
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "FreeConvert",
    title: "FreeConvert - Free Online Image, PDF & Utility Tools",
    description:
      "Free browser-based image, PDF, QR, text, calculator and developer tools. No upload required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FreeConvert - Free Online Image, PDF and Utility Tools",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeConvert - Free Online Image, PDF & Utility Tools",
    description:
      "Free browser-based image, PDF and utility tools. No upload and no signup.",
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#008ee9",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#008ee9",
    "msapplication-TileImage": "/mstile-150x150.png",
    "msapplication-config": "/browserconfig.xml",
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#008ee9" },
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
        {hasGoogleMeasurement ? (
          <Script
            id="google-consent-defaults"
            strategy="beforeInteractive"
          >
            {googleConsentDefaults}
          </Script>
        ) : null}
        {adsenseClientId ? (
          <Script
            async
            crossOrigin="anonymous"
            id="google-adsense-script"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="afterInteractive"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
