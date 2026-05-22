import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Contact FreeConvert for bug reports, feature requests, privacy questions, DMCA requests and business inquiries.";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact FreeConvert",
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      updated="May 22, 2026"
      path="/contact"
      description={description}
      schemaType="ContactPage"
    >
      <LegalSection title="Email">
        <p>
          Email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a> for bug
          reports, feature requests, DMCA, privacy or business questions.
        </p>
        <p>
          Include the tool URL, browser name, device type and a short
          description of the issue when reporting a bug. For file-output
          problems, describe the file type and settings used, but do not send
          sensitive documents unless we specifically ask for a safe sample.
        </p>
        <p>
          Expected response time is usually within 3 to 5 business days.
          Copyright notices can also be sent to{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>.
        </p>
      </LegalSection>
      <LegalSection title="Message">
        <ContactForm />
      </LegalSection>
    </LegalPage>
  );
}
