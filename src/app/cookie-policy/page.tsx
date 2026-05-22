import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Cookie Policy for FreeConvert, including consent storage, analytics, advertising cookies and browser controls.";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="May 22, 2026"
      path="/cookie-policy"
      description={description}
    >
      <LegalSection title="What Cookies Are">
        <p>
          Cookies are small files stored by your browser. Websites use them to
          remember preferences, measure usage, support security and provide
          features such as advertising or consent choices. Similar technologies
          include local storage, session storage, pixels and browser identifiers.
        </p>
        <p>
          FreeConvert uses a limited set of storage technologies so the site can
          remember consent choices, measure aggregate usage, prevent abuse and
          support advertising where enabled. Browser-based tool processing does
          not require an account.
        </p>
      </LegalSection>
      <LegalSection title="Essential Storage">
        <p>
          Essential storage may be used to remember your cookie consent choice,
          support security controls, keep basic interface behavior working and
          prevent repeated prompts. Without this storage, some preferences may
          reset when you revisit the site or clear browser data.
        </p>
      </LegalSection>
      <LegalSection title="Analytics Storage">
        <p>
          Analytics storage may be used to understand aggregate page views,
          popular tools, device types, browser behavior and performance issues.
          Analytics helps us improve navigation, content depth, tool reliability
          and page speed.
        </p>
        <p>
          Where required, analytics storage is disabled unless consent is
          granted. Analytics reports are used for site improvement and are not
          intended to inspect the contents of files processed locally in your
          browser.
        </p>
      </LegalSection>
      <LegalSection title="Advertising Storage">
        <p>
          If ads are enabled, Google AdSense or similar advertising partners may
          use cookies and similar technologies to serve, personalize, limit and
          measure advertisements. Google and other vendors may use visits to
          FreeConvert and other websites to help deliver relevant ads.
        </p>
        <p>
          Advertising storage is controlled through the consent banner where
          required, Google consent signals and your browser or account settings.
          If you decline advertising storage, ad personalization and measurement
          may be limited according to applicable rules and partner behavior.
        </p>
      </LegalSection>
      <LegalSection title="Third-Party Cookies">
        <p>
          Third-party services such as Google Analytics, Google AdSense,
          hCaptcha, Web3Forms or hosting and security providers may set or read
          cookies when their features are active. Their use of cookies is
          governed by their own terms and privacy policies.
        </p>
        <p>
          You can manage personalized advertising in{" "}
          <a href="https://adssettings.google.com/" rel="noreferrer" target="_blank">
            Google Ads Settings
          </a>{" "}
          and learn about broader advertising choices through{" "}
          <a href="https://www.aboutads.info/" rel="noreferrer" target="_blank">
            aboutads.info
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="Managing Cookies">
        <p>
          You can disable, delete or block cookies in your browser settings.
          You can also clear local storage to reset site preferences. Browser
          privacy extensions, private browsing modes and operating-system
          controls may further limit storage behavior.
        </p>
        <p>
          Blocking cookies may reset preferences or reduce the functionality of
          consent, analytics, advertising or contact-form protections. Core file
          tools are designed to remain usable without requiring an account.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update this Cookie Policy when site features, advertising
          partners, analytics tools, consent requirements or laws change. The
          updated date at the top of this page shows the latest version.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
