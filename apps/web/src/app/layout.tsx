import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "PDF merge",
    "compress PDF",
    "reduce PDF size",
    "JPG to PDF",
    "image compressor",
    "free PDF tools",
    "online file converter",
  ],
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
