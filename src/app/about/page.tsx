import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About FreeConvert",
  description:
    "About FreeConvert, a free client-side image, PDF and utility tools website built for private browser processing.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage title="About">
      <LegalSection title="What It Is">
        <p>
          FreeConvert is a free collection of browser-based image, PDF and
          utility tools for resizing, compressing, converting, cropping,
          merging, splitting, QR generation, text cleanup, calculators,
          developer utilities and metadata inspection.
        </p>
      </LegalSection>
      <LegalSection title="Why It Exists">
        <p>
          Many file tools upload documents to remote servers. FreeConvert is
          built around the opposite model: process files locally where practical,
          keep the interface fast, and make useful tools available without
          signup.
        </p>
      </LegalSection>
      <LegalSection title="How It Works">
        <p>
          The app uses browser File APIs, Canvas, Web Workers, WebAssembly
          libraries and PDF processing libraries. The current version was built
          in 2026 for Indian users and global English-speaking users.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For bug reports, feature requests or business questions, use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
