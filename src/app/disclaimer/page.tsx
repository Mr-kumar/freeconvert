import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Disclaimer for FreeConvert tools, guides, outputs, third-party services and advertising.";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="May 22, 2026"
      path="/disclaimer"
      description={description}
    >
      <LegalSection title="General Information">
        <p>
          FreeConvert provides browser-based file tools, utility tools and
          educational guides for general use. The site is intended to help with
          routine tasks such as resizing images, compressing PDFs, generating QR
          codes, checking text, converting formats and preparing files for
          upload.
        </p>
        <p>
          The information on this site is not professional advice. It should not
          be treated as legal, financial, medical, tax, compliance, security or
          official government guidance. Always verify requirements with the
          relevant institution, portal, recipient or professional advisor.
        </p>
      </LegalSection>
      <LegalSection title="Tool Outputs">
        <p>
          Tool outputs depend on your browser, device, source file, selected
          settings and the technical limits of file formats. A compressed file
          may lose quality, a converted image may change transparency, a PDF may
          render differently in another viewer and a calculated result may be
          affected by incorrect input values.
        </p>
        <p>
          You are responsible for reviewing every output before using it. Check
          file size, dimensions, page order, readability, passwords, QR content,
          copied text, calculated values and any important visual details before
          submitting, printing, publishing or sharing a file.
        </p>
      </LegalSection>
      <LegalSection title="No Guarantee of Acceptance">
        <p>
          FreeConvert cannot guarantee that an output will be accepted by a
          government portal, school, employer, bank, court, email provider,
          printer, marketplace or other third party. Each destination may have
          its own rules for file size, dimensions, format, naming, security,
          signatures, metadata and content.
        </p>
      </LegalSection>
      <LegalSection title="External Links and Services">
        <p>
          The site may link to third-party websites or use third-party services
          for analytics, advertising, CAPTCHA, contact forms, browser assets or
          supporting libraries. We do not control all third-party content,
          policies, availability, security practices or data handling.
        </p>
        <p>
          Visiting external links or interacting with third-party services is
          subject to their own terms and privacy policies. A link does not mean
          that FreeConvert endorses every statement, product or practice on that
          external site.
        </p>
      </LegalSection>
      <LegalSection title="Advertising and Affiliate Disclosure">
        <p>
          If advertisements are displayed, they may be served by Google AdSense
          or similar partners. Advertising partners may use cookies or similar
          technologies according to your consent choices and their own policies.
          FreeConvert does not control every advertisement shown by those
          networks.
        </p>
        <p>
          If affiliate links are added later, FreeConvert may earn a commission
          when you use those links, at no extra cost to you. Any such links
          should be evaluated independently before you purchase or rely on a
          third-party product or service.
        </p>
      </LegalSection>
      <LegalSection title="Limitation">
        <p>
          To the maximum extent permitted by law, FreeConvert is not responsible
          for losses, rejected uploads, missed deadlines, data loss, quality
          issues, incorrect results, compatibility problems or other damages
          arising from use of the site. Keep original files and verify important
          outputs before relying on them.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
