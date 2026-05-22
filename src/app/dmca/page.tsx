import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "DMCA and copyright infringement policy for FreeConvert content, pages and related materials.";

export const metadata: Metadata = buildPageMetadata({
  title: "DMCA Policy",
  description,
  path: "/dmca",
});

export default function DmcaPage() {
  return (
    <LegalPage
      title="DMCA"
      updated="May 22, 2026"
      path="/dmca"
      description={description}
    >
      <LegalSection title="Copyright Policy">
        <p>
          FreeConvert respects intellectual property rights. If you believe that
          content available on or through FreeConvert infringes your copyright,
          you may send a takedown request using the contact information below.
        </p>
        <p>
          This policy is intended for copyright complaints about site content,
          pages, text, images, branding or materials connected to FreeConvert.
          Browser-processed user files are generally handled locally on the
          user&apos;s device and are not published by FreeConvert as site content.
        </p>
      </LegalSection>
      <LegalSection title="Send A Notice">
        <p>
          Email copyright requests to{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>. To help
          us review the request efficiently, include enough detail to identify
          both the copyrighted work and the material you believe is infringing.
        </p>
      </LegalSection>
      <LegalSection title="What To Include">
        <ul className="list-inside list-disc space-y-2">
          <li>Your full name, organization if applicable and contact email.</li>
          <li>A description of the copyrighted work you claim is infringed.</li>
          <li>The exact URL or location of the material on FreeConvert.</li>
          <li>A statement that you have a good-faith belief the use is unauthorized.</li>
          <li>A statement that the information in your notice is accurate.</li>
          <li>A statement that you are the copyright owner or authorized to act for the owner.</li>
          <li>Your physical or electronic signature.</li>
        </ul>
      </LegalSection>
      <LegalSection title="Counter Notices">
        <p>
          If material is removed and you believe the removal was a mistake or
          misidentification, you may send a counter notice with your contact
          information, the removed material, a good-faith statement and your
          consent to appropriate jurisdiction where required by applicable law.
        </p>
        <p>
          We may forward notices, counter notices and related information to the
          parties involved, hosting providers, legal advisors or other entities
          as needed to process the request.
        </p>
      </LegalSection>
      <LegalSection title="Repeat Infringement">
        <p>
          FreeConvert may restrict or remove access to content, features or
          users involved in repeated or serious infringement claims where
          appropriate. We may also decline incomplete, abusive, fraudulent or
          legally insufficient requests.
        </p>
      </LegalSection>
      <LegalSection title="Response Time">
        <p>
          We aim to review valid copyright requests within 5 business days, but
          complex requests may take longer. Sending complete, accurate
          information helps us respond more quickly.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
