import { PDFToolPageClient } from "@/components/pdf/PDFToolPageClient";
import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import { ToolContentSections } from "@/components/ToolContentSections";
import {
  getPDFToolDefaults,
  pdfToolFaqJsonLd,
  pdfToolJsonLd,
} from "@/lib/tools";
import type { PDFToolSlug } from "@/lib/types";
import { safeJsonLd } from "@/lib/utils";

export interface PDFToolPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function PDFToolRoutePage({
  slug,
  searchParams,
}: PDFToolPageProps & { slug: PDFToolSlug }) {
  const params = await searchParams;
  const defaults = getPDFToolDefaults(slug, params);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pdfToolJsonLd(slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pdfToolFaqJsonLd(slug)) }}
      />
      <AdRailSlots
        leftSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT}
        rightSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT}
      />
      <PDFToolPageClient defaults={defaults} slug={slug} />
      <AdSlot
        className="pb-2"
        minHeight={96}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM}
      />
      <ToolContentSections kind="pdf" slug={slug} />
    </>
  );
}
