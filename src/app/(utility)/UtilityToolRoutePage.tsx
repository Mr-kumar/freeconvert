import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import { UtilityContentSections } from "@/components/utility/UtilityContentSections";
import { UtilityToolPageClient } from "@/components/utility/UtilityToolPageClient";
import {
  utilityToolBreadcrumbJsonLd,
  utilityToolFaqJsonLd,
  utilityToolJsonLd,
  type UtilityToolSlug,
} from "@/lib/utilityTools";
import { safeJsonLd } from "@/lib/utils";

export function UtilityToolRoutePage({ slug }: { slug: UtilityToolSlug }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(utilityToolJsonLd(slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(utilityToolFaqJsonLd(slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(utilityToolBreadcrumbJsonLd(slug)),
        }}
      />
      <AdRailSlots
        leftSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT}
        rightSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT}
      />
      <UtilityToolPageClient slug={slug} />
      <UtilityContentSections slug={slug} />
      <AdSlot
        className="pb-10"
        minHeight={96}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM}
      />
    </>
  );
}
