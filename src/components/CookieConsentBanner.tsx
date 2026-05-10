"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { normalizeAdSenseClientId } from "@/lib/adsense";

const CONSENT_KEY = "fc_cookie_consent";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(value: ConsentValue) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  const gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [consented, setConsented] = useState(false);
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = normalizeAdSenseClientId(process.env.NEXT_PUBLIC_ADSENSE_ID);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = localStorage.getItem(CONSENT_KEY);
      const legacyValue = localStorage.getItem("freeconvert-cookie-consent");

      if (value === "true" || legacyValue === "accepted") {
        updateGoogleConsent("granted");
        setConsented(true);
        setVisible(false);
        return;
      }

      if (value === "false") {
        updateGoogleConsent("denied");
      }

      setVisible(value !== "false");
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "true");
    updateGoogleConsent("granted");
    setConsented(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "false");
    updateGoogleConsent("denied");
    setConsented(false);
    setVisible(false);
  }

  const showAnalytics = consented && analyticsId;
  const showAds = Boolean(adsenseId);

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
        <div className="fixed bottom-3 left-1/2 z-50 w-[min(358px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-3 shadow-xl shadow-slate-300/50 sm:w-[calc(100vw-2rem)] sm:p-4">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-words text-xs leading-5 text-[var(--muted)] sm:max-w-3xl sm:text-sm sm:leading-6">
              We use cookies for analytics and ads. Your files are processed
              locally and never uploaded.{" "}
              <Link className="font-semibold text-[var(--accent)]" href="/cookie-policy">
                Learn more
              </Link>
            </p>
            <div className="grid w-full min-w-0 shrink-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-3">
              <button
                className="min-h-11 w-full min-w-0 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--text)]"
                type="button"
                onClick={decline}
              >
                Decline
              </button>
              <button className="button-primary w-full shrink-0 whitespace-nowrap px-4" type="button" onClick={accept}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
