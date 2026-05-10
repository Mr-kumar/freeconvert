import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using FreeConvert image and PDF tools.",
  alternates: {
    canonical: `${BASE_URL}/terms-of-service`,
  },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection title="Acceptance">
        <p>
          By using FreeConvert, you agree to these terms. If you do not agree,
          do not use the site.
        </p>
      </LegalSection>
      <LegalSection title="Service">
        <p>
          FreeConvert provides free browser-based image and PDF tools including
          resize, compression, conversion, crop, background removal,
          watermarking, merge, split, rotate, filters and metadata viewing.
        </p>
      </LegalSection>
      <LegalSection title="Ownership">
        <p>
          You retain ownership of your files and outputs. FreeConvert owns the
          site design, code, brand and related intellectual property.
        </p>
      </LegalSection>
      <LegalSection title="Prohibited Uses">
        <p>
          You must not use FreeConvert to process or distribute illegal,
          infringing, abusive or harmful content, or to violate applicable law,
          including Indian law and the Information Technology Act where relevant.
        </p>
      </LegalSection>
      <LegalSection title="Disclaimer And Liability">
        <p>
          FreeConvert is provided as is, without warranties. We do not guarantee
          uninterrupted availability, error-free output or fitness for a
          particular purpose. To the maximum extent allowed by law, FreeConvert is
          not liable for losses arising from use of the site.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update these terms or modify the service. Continued use means
          you accept the current terms.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a> for
          questions about these terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
