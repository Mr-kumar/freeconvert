import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About FreeConvert",
  description:
    "About FreeConvert, a free client-side image tools website built for private image processing.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <LegalPage title="About">
      <LegalSection title="What It Is">
        <p>
          FreeConvert is a free collection of browser-based image tools for
          resizing, compressing, converting, cropping, watermarking, merging,
          background removal, filters and metadata inspection.
        </p>
      </LegalSection>
      <LegalSection title="Why It Exists">
        <p>
          Many image tools upload files to remote servers. FreeConvert is built
          around the opposite model: process images locally where practical, keep
          the interface fast, and make useful tools available without signup.
        </p>
      </LegalSection>
      <LegalSection title="How It Works">
        <p>
          The app uses browser File APIs, Canvas, Web Workers and WebAssembly
          libraries. The current version was built in 2026 for Indian users and
          global English-speaking users.
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
