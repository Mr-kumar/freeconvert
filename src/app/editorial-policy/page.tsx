import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "FreeConvert.in editorial policy for file-preparation guides, tool explanations, testing notes and content updates.";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Policy",
  description,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      title="Editorial Policy"
      updated="May 22, 2026"
      path="/editorial-policy"
      description={description}
    >
      <LegalSection title="Purpose">
        <p>
          FreeConvert.in publishes tool pages and guides to help users prepare
          files for common workflows such as online forms, email attachments,
          document scans, QR sharing, OCR, image conversion and PDF cleanup. The
          goal is practical clarity: users should understand the task before
          selecting a file or copying a result.
        </p>
      </LegalSection>
      <LegalSection title="Editorial team">
        <p>
          Guides are published under the FreeConvert Editorial Team. The team
          writes from a product and file-workflow perspective, focusing on
          browser-based tools, upload limits, format compatibility, privacy
          checks and output review. Content is not legal, financial, medical or
          compliance advice.
        </p>
        <p>
          When a topic requires official or professional judgement, the content
          tells users to verify requirements with the relevant institution,
          recipient, portal or qualified professional.
        </p>
      </LegalSection>
      <LegalSection title="How guides are written">
        <p>
          Each guide is written around a real user task: reducing image size,
          preparing a passport-style photo, choosing JPG or WebP, compressing a
          PDF for email, protecting a document with a password or checking OCR
          output. Guides include examples, mistakes to avoid, review steps and
          related tools where relevant.
        </p>
        <p>
          We avoid copying third-party converter pages, merchant descriptions or
          generic keyword blocks. When a guide mentions common file sizes,
          formats or workflows, the aim is to explain practical tradeoffs in the
          user&apos;s own workflow rather than repeat search terms.
        </p>
      </LegalSection>
      <LegalSection title="Tool testing process">
        <p>
          Priority tools are tested manually before major content or AdSense
          review milestones. Testing checks whether a realistic input can be
          selected, processed and downloaded, and whether the page explains
          important limitations. Internal testing notes are tracked in the root{" "}
          <code>TOOL_QA_CHECKLIST.md</code> file.
        </p>
        <p>
          Browser tools can still behave differently across devices and file
          types. Users should review downloaded outputs and report reproducible
          issues through the <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
      <LegalSection title="Updates and corrections">
        <p>
          File formats, browser support and upload rules change over time. We
          update guides when tool behavior changes, when common workflows need
          clearer instructions or when users report confusing content. Blog
          pages show published and modified dates in metadata.
        </p>
        <p>
          To request a correction, email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a> with
          the page URL and a clear description of the issue.
        </p>
      </LegalSection>
      <LegalSection title="Advertising separation">
        <p>
          Editorial guidance is written for user utility, not to force ad
          clicks. Ads, when enabled after approval, should remain clearly
          labelled and separated from upload, processing and download controls.
          We do not place paid claims inside guide text unless they are clearly
          disclosed.
        </p>
      </LegalSection>
      <LegalSection title="Independence">
        <p>
          FreeConvert.in is an independent browser-based tools website and does
          not claim affiliation with similarly named converter brands. Editorial
          content is written for this website&apos;s tools and user workflows.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
