import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import { ToolContentSections } from "@/components/ToolContentSections";
import {
  getToolDefaults,
  toolBreadcrumbJsonLd,
  toolFaqJsonLd,
  toolJsonLd,
} from "@/lib/tools";
import type { ToolSlug } from "@/lib/types";
import { safeJsonLd } from "@/lib/utils";

export interface ToolPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function ToolRoutePage({
  slug,
  searchParams,
}: ToolPageProps & { slug: ToolSlug }) {
  const params = await searchParams;
  const defaults = getToolDefaults(slug, params);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolJsonLd(slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolFaqJsonLd(slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolBreadcrumbJsonLd(slug)) }}
      />
      <AdRailSlots
        leftSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT}
        rightSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT}
      />
      <ToolPageClient defaults={defaults} slug={slug} />
      <AdSlot
        className="pb-2"
        minHeight={96}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM}
      />
      <ToolContentSections kind="image" slug={slug} />
    </>
  );
}
