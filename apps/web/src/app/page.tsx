"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UploadZone } from "@/components/UploadZone";
import { ToolGrid } from "@/components/ToolGrid";
import { FeatureGrid } from "@/components/FeatureGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingSection } from "@/components/PricingSection";
import { TOOLS } from "@/config/tools";
import { SITE } from "@/config/site";

export default function LandingPage() {
  const handleFiles = (files: File[]) => {
    if (files.length > 0) window.location.href = "/merge";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar showLogoIcon />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-16 text-center" aria-labelledby="hero-heading">
          <h1
            id="hero-heading"
            className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl"
          >
            Convert & edit files in seconds
          </h1>
          <p className="mt-3 text-lg text-[hsl(var(--muted-foreground))]">
            {SITE.tagline}
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <UploadZone
              accept="application/pdf,image/*"
              multiple
              onFiles={handleFiles}
            />
          </div>
        </section>

        <section id="tools" className="mb-16">
          <ToolGrid
            eyebrow="Popular tools"
            title="Most used tools"
            tools={TOOLS}
          />
        </section>

        <section className="mb-16">
          <FeatureGrid />
        </section>

        <section className="mb-16">
          <HowItWorks />
        </section>

        <section className="mb-16">
          <PricingSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
