import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Privacy Policy for FreeConvert, including browser-based file processing, cookies, analytics, advertising, contact forms and user choices.";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 22, 2026"
      path="/privacy-policy"
      description={description}
    >
      <LegalSection title="Overview">
        <p>
          FreeConvert is designed around browser-based image, PDF, media and
          utility tools. For supported tools, the selected files and entered
          values are processed on your device using browser APIs, Canvas, Web
          Workers, WebAssembly and client-side libraries. The site does not
          require an account for ordinary tool usage.
        </p>
        <p>
          This policy explains what information may be processed when you visit
          the site, use a tool, contact us, accept cookies or see advertising.
          It also explains the practical choices available to you. If you do not
          agree with this policy, do not use the site.
        </p>
      </LegalSection>
      <LegalSection title="Files and Tool Inputs">
        <p>
          Image, PDF, text, QR, calculator, color, password, developer, archive
          and media tools are built to run locally where practical. Files are
          read by the browser so the output can be created on your device. The
          original files remain under your control unless you choose to share
          them outside FreeConvert.
        </p>
        <p>
          Some tools load large browser libraries, models or worker files to
          perform tasks such as OCR, background removal, PDF encryption or media
          conversion. Those libraries may be fetched from FreeConvert or trusted
          third-party asset locations, but the file-processing task itself is
          intended to happen in the browser for supported workflows.
        </p>
      </LegalSection>
      <LegalSection title="Information We May Collect">
        <p>
          We may collect basic technical and usage information such as pages
          visited, approximate region, device type, browser type, referring
          page, performance events, consent status and error signals. This helps
          us understand which tools are useful, diagnose issues and improve site
          reliability.
        </p>
        <p>
          If you contact us, we may receive your name, email address, message
          content, attachments or any other information you choose to provide.
          Contact messages may be processed through email systems, Web3Forms or
          spam-prevention services such as hCaptcha when those integrations are
          enabled.
        </p>
      </LegalSection>
      <LegalSection title="Cookies and Browser Storage">
        <p>
          FreeConvert uses local storage to remember cookie consent and may use
          cookies or similar technologies for essential operation, analytics,
          advertising and abuse prevention. Essential storage supports basic
          site behavior. Analytics storage helps measure aggregate usage.
          Advertising storage supports ad delivery, measurement and frequency
          controls when ads are enabled.
        </p>
        <p>
          You can control cookies through your browser settings and the consent
          banner where shown. Clearing cookies or local storage may reset
          preferences. Some browser privacy tools may block analytics,
          advertising or embedded third-party services automatically.
        </p>
      </LegalSection>
      <LegalSection title="Analytics and Advertising">
        <p>
          FreeConvert may use privacy-conscious analytics, Vercel Analytics,
          Google Analytics or similar measurement tools to understand aggregate
          traffic and performance. Where required, analytics storage is disabled
          unless consent is granted.
        </p>
        <p>
          If Google AdSense or another advertising partner is enabled,
          third-party vendors including Google may use cookies or similar
          technologies to serve, personalize and measure ads. Google advertising
          systems may use visits to this and other websites to help deliver
          relevant ads, subject to your consent choices and applicable law.
        </p>
      </LegalSection>
      <LegalSection title="Third-Party Services">
        <p>
          The site may use third-party services for analytics, advertising,
          hosting, security checks, contact forms, CAPTCHA, fonts, browser
          models or public asset delivery. These services process data according
          to their own policies and technical requirements.
        </p>
        <p>
          Examples may include Google Analytics, Google AdSense, Google Consent
          Mode, hCaptcha, Web3Forms, Vercel services, static model hosting for
          client-side processing and public browser-library assets. We try to
          keep integrations limited to services that support the site purpose.
        </p>
      </LegalSection>
      <LegalSection title="How Information Is Used">
        <p>
          Information may be used to provide the site, remember choices, improve
          tools, measure performance, prevent abuse, respond to messages,
          maintain security, comply with legal obligations and support
          advertising where enabled.
        </p>
        <p>
          We do not sell files selected for local tool processing. We do not
          require accounts for normal use, and we do not intentionally build
          user profiles from the content of locally processed files.
        </p>
      </LegalSection>
      <LegalSection title="Data Retention">
        <p>
          Browser-processed files and inputs generally remain on your device.
          Consent choices may remain in local storage until cleared. Contact
          messages may be retained for support, safety, legal or business record
          purposes. Analytics and advertising data retention depends on the
          settings and policies of the relevant service providers.
        </p>
        <p>
          We keep information only as long as reasonably needed for the purposes
          described in this policy, unless a longer period is required for legal,
          security, dispute-resolution or compliance reasons.
        </p>
      </LegalSection>
      <LegalSection title="Your Choices and Rights">
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, restrict or object to certain processing of personal
          information. You may also have rights related to data portability or
          consent withdrawal. To make a request, contact us using the email
          below.
        </p>
        <p>
          You can also use browser controls, Google Ads Settings, Google
          Analytics opt-out tools and industry opt-out pages to manage certain
          tracking and advertising choices. Some choices are device-specific and
          may need to be repeated on different browsers.
        </p>
      </LegalSection>
      <LegalSection title="Children">
        <p>
          FreeConvert is not directed to children under 13. We do not knowingly
          collect personal information from children under 13. If you believe a
          child provided personal information through the site, contact us so we
          can review and take appropriate action.
        </p>
      </LegalSection>
      <LegalSection title="International Use">
        <p>
          FreeConvert is operated for users in India and global English-speaking
          audiences. Third-party service providers may process information in
          other countries. By using the site, you understand that technical and
          service data may be handled in locations where our providers operate.
        </p>
        <p>
          We aim to follow applicable privacy and information-technology
          requirements, including consent expectations for analytics and
          advertising where required. This policy may be updated as laws,
          services or site features change.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For privacy questions or rights requests, email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a>. For
          copyright notices, use{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
