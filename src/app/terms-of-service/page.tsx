import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Terms of Service for using FreeConvert browser-based image, PDF, media and utility tools.";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description,
  path: "/terms-of-service",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="May 22, 2026"
      path="/terms-of-service"
      description={description}
    >
      <LegalSection title="Acceptance">
        <p>
          By accessing or using FreeConvert, you agree to these Terms of
          Service. If you do not agree, do not use the site. These terms apply
          to all visitors, including users of image tools, PDF tools, media
          tools, QR tools, text tools, calculators, developer utilities and
          informational pages.
        </p>
        <p>
          We may update these terms from time to time. The updated date on this
          page shows the latest version. Continued use of FreeConvert after a
          change means you accept the updated terms.
        </p>
      </LegalSection>
      <LegalSection title="Service Description">
        <p>
          FreeConvert provides free browser-based tools for file preparation and
          everyday utility tasks. Features may include resizing, compression,
          conversion, cropping, background removal, watermarking, merging,
          splitting, PDF page operations, QR generation, text cleanup,
          calculators, password tools, developer utilities, file checksums and
          media conversion.
        </p>
        <p>
          The service is provided for general convenience and productivity. We
          may change, add, limit or remove tools at any time. We do not promise
          that every feature will be available on every browser, device, file
          type or operating system.
        </p>
      </LegalSection>
      <LegalSection title="Browser-Based Processing">
        <p>
          Many tools are designed to process files locally in your browser.
          Local processing can improve privacy for routine tasks, but it also
          means performance depends on your device, browser memory, file size
          and browser support for required APIs or WebAssembly libraries.
        </p>
        <p>
          You are responsible for reviewing outputs before using them. A resized
          photo, compressed PDF, converted image, generated QR code, calculated
          value or edited document should be checked before it is submitted,
          printed, published, shared or relied upon.
        </p>
      </LegalSection>
      <LegalSection title="User Responsibilities">
        <p>
          You must use FreeConvert lawfully and responsibly. You are responsible
          for the files, text, values, links and other inputs you choose to
          process. You must have the rights or permission needed to use,
          transform, copy, download, share or submit the materials involved.
        </p>
        <p>
          You are also responsible for keeping original files when needed,
          choosing appropriate settings, checking final quality, meeting upload
          requirements and deciding whether a tool is suitable for your
          workflow. FreeConvert cannot know the rules of every institution,
          employer, website, government portal or recipient.
        </p>
      </LegalSection>
      <LegalSection title="Prohibited Uses">
        <p>
          You must not use FreeConvert to create, process, distribute or support
          illegal, infringing, abusive, deceptive, harmful, defamatory,
          harassing, sexually exploitative, privacy-invasive or malware-related
          content. You must not use the site to violate applicable law,
          including Indian law, information-technology rules, intellectual
          property law or privacy rights.
        </p>
        <p>
          You must not attempt to disrupt the service, bypass security controls,
          overload infrastructure, scrape the site in a harmful way, reverse
          engineer protected parts of the service, inject malicious code or use
          automated systems in a way that degrades availability for others.
        </p>
      </LegalSection>
      <LegalSection title="PDF Passwords and Sensitive Files">
        <p>
          Tools such as Protect PDF, Unlock PDF, Redact PDF and related document
          utilities are provided for lawful files that you own or are authorized
          to modify. Unlock PDF is not provided for cracking unknown passwords
          or bypassing restrictions on documents you do not have permission to
          change.
        </p>
        <p>
          You are responsible for choosing strong passwords, storing them
          safely, sharing them through appropriate channels and keeping secure
          backups. FreeConvert does not recover forgotten passwords and does not
          guarantee that every PDF viewer will enforce permission settings in
          the same way.
        </p>
      </LegalSection>
      <LegalSection title="No Professional Advice">
        <p>
          FreeConvert tools and guides are provided for general informational
          and productivity purposes. They are not legal, financial, medical,
          accounting, tax, security, compliance or professional advice. You
          should consult a qualified professional when a decision has legal,
          financial, health, compliance or high-risk consequences.
        </p>
        <p>
          Calculators and converters provide estimates based on entered values
          and common formulas. You should independently verify important
          results. File tools may change format, size, appearance or metadata,
          so outputs should be reviewed before use in official workflows.
        </p>
      </LegalSection>
      <LegalSection title="Intellectual Property">
        <p>
          You retain ownership of your files, inputs and outputs, subject to any
          rights held by others. FreeConvert does not claim ownership of files
          you process locally through the tools. You are responsible for
          ensuring that your use of those files is lawful.
        </p>
        <p>
          FreeConvert owns or licenses the site design, brand elements, code,
          text, layout, tool interfaces and related intellectual property. You
          may not copy, sell, resell, frame or commercially exploit the service
          except as allowed by law or with written permission.
        </p>
      </LegalSection>
      <LegalSection title="Third-Party Services and Libraries">
        <p>
          FreeConvert may use third-party libraries, browser APIs, hosting
          providers, analytics services, advertising services, CAPTCHA services,
          contact-form services, open-source software and model assets. These
          components may have their own licenses, policies, limits and technical
          behavior.
        </p>
        <p>
          We are not responsible for third-party websites, advertisements,
          scripts, libraries or services that we do not control. Links to
          external resources are provided for convenience and do not imply
          endorsement of all content, policies or practices on those sites.
        </p>
      </LegalSection>
      <LegalSection title="Availability and Changes">
        <p>
          We try to keep FreeConvert available and useful, but we do not
          guarantee uninterrupted access, error-free operation, permanent
          availability of any tool or compatibility with every browser or file.
          Maintenance, browser changes, provider outages or technical issues may
          affect the service.
        </p>
        <p>
          We may modify, suspend, rate-limit or discontinue any part of the site
          at any time. We may also block or limit usage that appears abusive,
          unlawful, automated in a harmful way or risky for the service or other
          users.
        </p>
      </LegalSection>
      <LegalSection title="Disclaimers">
        <p>
          FreeConvert is provided on an as-is and as-available basis. To the
          maximum extent permitted by law, we disclaim warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          accuracy, availability and error-free operation.
        </p>
        <p>
          We do not guarantee that outputs will satisfy any specific portal,
          employer, school, government department, court, business process,
          printing vendor or recipient. You must review outputs and confirm
          requirements before relying on them.
        </p>
      </LegalSection>
      <LegalSection title="Limitation of Liability">
        <p>
          To the maximum extent permitted by law, FreeConvert and its operators
          are not liable for indirect, incidental, special, consequential,
          exemplary or punitive damages, or for lost profits, lost data, lost
          business, rejected submissions, missed deadlines or losses arising
          from use of or inability to use the site.
        </p>
        <p>
          If liability cannot be excluded under applicable law, the total
          liability of FreeConvert for any claim relating to the site is limited
          to the amount you paid to use the relevant service, which is currently
          zero for normal free tool usage.
        </p>
      </LegalSection>
      <LegalSection title="Indemnity">
        <p>
          You agree to defend, indemnify and hold FreeConvert harmless from
          claims, damages, losses, liabilities, costs and expenses arising from
          your misuse of the site, your violation of these terms, your violation
          of law or rights of others, or your files, inputs, outputs and
          sharing decisions.
        </p>
      </LegalSection>
      <LegalSection title="Governing Law">
        <p>
          These terms are intended to be governed by the laws of India, without
          regard to conflict-of-law principles, unless mandatory local law gives
          you additional rights that cannot be waived. Courts with appropriate
          jurisdiction in India may handle disputes relating to these terms.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For questions about these terms, email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a>. For
          copyright notices, email{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
