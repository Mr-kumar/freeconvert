import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for FreeConvert, including client-side image and PDF processing, cookies, analytics and advertising disclosures.",
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="Overview">
        <p>
          FreeConvert is designed so image and PDF processing happens in your
          browser. Your selected files are not uploaded to FreeConvert servers
          for the tools provided on this site.
        </p>
      </LegalSection>
      <LegalSection title="Data We May Collect">
        <p>
          We may collect basic usage information such as pages visited, browser
          type, approximate region, device type and referral source through
          privacy-conscious analytics or Google Analytics if enabled.
        </p>
        <p>
          If Google AdSense is enabled, third-party vendors including Google may
          use cookies or similar technologies to serve, personalize and measure
          ads based on visits to this site and other sites on the internet.
        </p>
        <p>
          Contact messages may be sent by email or processed through Web3Forms
          if the contact integration is enabled. hCaptcha may be used to prevent
          spam on the contact form.
        </p>
      </LegalSection>
      <LegalSection title="Files">
        <p>
          Images and PDFs are processed locally with browser APIs, Canvas,
          WebAssembly and PDF libraries. Files remain on your device unless you
          choose to send them elsewhere outside FreeConvert.
        </p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>
          FreeConvert uses local storage for cookie consent. Third-party services
          such as Google Analytics and Google AdSense may set cookies after
          consent where required.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables Google and its
          partners to serve ads based on your visit to FreeConvert and other
          websites. Other certified ad vendors or ad networks may also use
          cookies if enabled in the AdSense account.
        </p>
      </LegalSection>
      <LegalSection title="Your Choices">
        <p>
          You can disable cookies in your browser settings. You can also use
          Google&apos;s{" "}
          <a href="https://adssettings.google.com/" rel="noreferrer" target="_blank">
            Ads Settings
          </a>{" "}
          and{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noreferrer" target="_blank">
            Analytics opt-out tools
          </a>{" "}
          to control Google tracking. Some third-party vendors also provide
          opt-out choices through{" "}
          <a href="https://www.aboutads.info/" rel="noreferrer" target="_blank">
            aboutads.info
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="Regional Consent">
        <p>
          Where required by law, FreeConvert asks for consent before using
          analytics or advertising storage. For users in the EEA, UK and
          Switzerland, Google advertising messages may be shown through a
          Google-certified consent management platform configured in AdSense.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For privacy questions, email{" "}
          <a href="mailto:hello@freeconvert.in">hello@freeconvert.in</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
