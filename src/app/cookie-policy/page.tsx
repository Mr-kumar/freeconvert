import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BASE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for FreeConvert.",
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
          _gid, and Google AdSense may use advertising cookies.
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
          Google services are governed by Google&apos;s privacy and cookie
          policies. You can review and manage Google ad settings from your Google
          account.
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
