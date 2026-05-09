import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: "DMCA and copyright infringement policy for FreeConvert.",
  alternates: {
    canonical: `${BASE_URL}/dmca`,
  },
};

export default function DmcaPage() {
  return (
    <LegalPage title="DMCA">
      <LegalSection title="Policy">
        <p>
          FreeConvert respects intellectual property rights. If you believe
          content connected to FreeConvert infringes your copyright, send a DMCA
          request.
        </p>
      </LegalSection>
      <LegalSection title="Send A Request">
        <p>
          Email copyright requests to{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>.
        </p>
      </LegalSection>
      <LegalSection title="Include">
        <ul className="list-inside list-disc space-y-2">
          <li>Your name and contact information.</li>
          <li>A description of the copyrighted work.</li>
          <li>The URL or material you believe is infringing.</li>
          <li>A statement that you have a good-faith belief the use is unauthorized.</li>
          <li>A statement that the information is accurate.</li>
          <li>Your physical or electronic signature.</li>
        </ul>
      </LegalSection>
      <LegalSection title="Response Time">
        <p>
          We aim to review valid copyright requests within 5 business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
