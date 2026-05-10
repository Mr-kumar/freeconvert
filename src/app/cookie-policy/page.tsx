import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for FreeConvert, including local storage, analytics, advertising cookies and consent choices.",
  alternates: {
    canonical: `${BASE_URL}/cookie-policy`,
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy">
      <LegalSection title="Cookies We Use">
        <p>
          FreeConvert uses local storage to remember cookie consent. If analytics
          or ads are enabled, Google Analytics may use cookies such as _ga and
          _gid, and Google AdSense may use advertising cookies including
          cookies associated with Google or DoubleClick domains.
        </p>
      </LegalSection>
      <LegalSection title="Purpose">
        <p>
          Cookies and local storage help remember consent, measure site usage,
          detect performance issues and support advertising where enabled.
        </p>
      </LegalSection>
      <LegalSection title="Third Parties">
        <p>
          Third-party vendors including Google may use cookies to serve ads
          based on prior visits to this site or other websites. Google services
          are governed by Google&apos;s privacy and cookie policies.
        </p>
        <p>
          You can manage personalized advertising in{" "}
          <a href="https://adssettings.google.com/" rel="noreferrer" target="_blank">
            Google Ads Settings
          </a>{" "}
          or opt out of some third-party personalized advertising through{" "}
          <a href="https://www.aboutads.info/" rel="noreferrer" target="_blank">
            aboutads.info
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="Consent">
        <p>
          The cookie banner stores your choice in local storage. Accepting
          grants analytics and advertising storage where available. Declining
          keeps those storage signals denied unless another legally required
          consent message applies in your region.
        </p>
      </LegalSection>
      <LegalSection title="Disable Cookies">
        <p>
          You can disable or delete cookies in your browser settings. Some site
          preferences may reset after clearing local storage.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
