import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Contact FreeConvert",
  description:
    "Contact FreeConvert for bug reports, feature requests, DMCA requests and business questions.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

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
