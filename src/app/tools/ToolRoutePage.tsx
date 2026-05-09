import { ToolPageClient } from "@/components/tools/ToolPageClient";
import {
  getToolDefaults,
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolFaqJsonLd()) }}
      />
      <ToolPageClient defaults={defaults} slug={slug} />
    </>
  );
}
