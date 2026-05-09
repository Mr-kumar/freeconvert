import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for FreeConvert, including client-side image processing, cookies, analytics and advertising disclosures.",
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="Overview">
        <p>
          FreeConvert is designed so image processing happens in your browser.
          Your selected images are not uploaded to FreeConvert servers for the
          tools provided on this site.
        </p>
      </LegalSection>
      <LegalSection title="Data We May Collect">
        <p>
          We may collect basic usage information such as pages visited, browser
          type, approximate region, device type and referral source through
          privacy-conscious analytics or Google Analytics if enabled.
        </p>
        <p>
          If Google AdSense is enabled, Google and its partners may use cookies
          or similar technologies to serve and measure ads.
        </p>
      </LegalSection>
      <LegalSection title="Images And Files">
        <p>
          Images are processed locally with browser APIs, Canvas and WebAssembly
          libraries. Files remain on your device unless you choose to send them
          elsewhere outside FreeConvert.
        </p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>
          FreeConvert uses local storage for cookie consent. Third-party services
          such as Google Analytics and Google AdSense may set cookies after
          consent where required.
        </p>
      </LegalSection>
      <LegalSection title="Your Choices">
        <p>
          You can disable cookies in your browser settings. You can also use
          Google&apos;s ad settings and analytics opt-out tools to control Google
          tracking.
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
