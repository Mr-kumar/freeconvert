import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact FreeConvert",
  description:
    "Contact FreeConvert for bug reports, feature requests, DMCA requests and business questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <LegalSection title="Email">
        <p>
          Email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a> for bug
          reports, feature requests, DMCA, privacy or business questions.
        </p>
        <p>Expected response time is usually within 3 to 5 business days.</p>
      </LegalSection>
      <LegalSection title="Message">
        <ContactForm />
      </LegalSection>
    </LegalPage>
  );
}
