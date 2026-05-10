import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description: "Disclaimer for FreeConvert image, PDF and utility tools and advertising.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <LegalSection title="As Is">
        <p>
          FreeConvert is provided as is. We make no guarantees about accuracy,
          quality, availability or results produced by the tools.
        </p>
      </LegalSection>
      <LegalSection title="User Responsibility">
        <p>
          You are responsible for the files you process and how you use any
          outputs. Review important files before publishing or sharing them.
        </p>
      </LegalSection>
      <LegalSection title="External Links">
        <p>
          FreeConvert may link to third-party websites. We are not responsible
          for their content, security or privacy practices.
        </p>
      </LegalSection>
      <LegalSection title="Advertising">
        <p>
          If ads are displayed, they may be served by Google AdSense or similar
          partners. FreeConvert does not control every ad displayed by those
          networks.
        </p>
      </LegalSection>
      <LegalSection title="Affiliate Links">
        <p>
          If affiliate links are added later, we may earn a commission when you
          use those links, at no extra cost to you.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
