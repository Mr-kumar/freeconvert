import { normalizeAdSensePublisherId } from "@/lib/adsense";

export const dynamic = "force-dynamic";

const GOOGLE_CERTIFICATION_AUTHORITY_ID = "f08c47fec0942fa0";

export function GET() {
  const publisherId = normalizeAdSensePublisherId(
    process.env.ADSENSE_PUBLISHER_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_ID,
  );

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${GOOGLE_CERTIFICATION_AUTHORITY_ID}\n`
    : [
        "# Configure ADSENSE_PUBLISHER_ID=pub-0000000000000000",
        "# or NEXT_PUBLIC_ADSENSE_ID=ca-pub-0000000000000000.",
        "# The live AdSense publisher line will be generated automatically.",
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": publisherId
        ? "public, max-age=3600, s-maxage=3600"
        : "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
