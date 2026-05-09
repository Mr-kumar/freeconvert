"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const CONSENT_KEY = "fc_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [consented, setConsented] = useState(false);
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = localStorage.getItem(CONSENT_KEY);
      const legacyValue = localStorage.getItem("freeconvert-cookie-consent");

      if (value === "true" || legacyValue === "accepted") {
        setConsented(true);
        setVisible(false);
        return;
      }

      setVisible(value !== "false");
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "true");
    setConsented(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "false");
    setConsented(false);
    setVisible(false);
  }

  const showAnalytics = consented && analyticsId;
  const showAds = consented && adsenseId;

  return (
    <>
      {showAds ? (
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="afterInteractive"
        />
      ) : null}
      {showAnalytics ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {visible ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-white p-4 shadow-xl shadow-slate-300/50">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
              We use cookies for analytics and ads. Your images are processed
              locally and never uploaded.{" "}
              <Link className="font-semibold text-[var(--accent)]" href="/cookie-policy">
                Learn more
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--text)]"
                type="button"
                onClick={decline}
              >
                Decline
              </button>
              <button className="button-primary shrink-0" type="button" onClick={accept}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
