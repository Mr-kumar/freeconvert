"use client";

import { useEffect } from "react";
import { normalizeAdSenseClientId } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function pushAd() {
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    // AdSense can throw before approval, during local preview, or with blockers.
  }
}

function RailAd({
  client,
  side,
  slot,
}: {
  client: string;
  side: "left" | "right";
  slot: string;
}) {
  return (
    <aside
      aria-label={`${side} advertisement`}
      className={`ad-rail ad-rail-${side}`}
    >
      <div className="ad-shell ad-rail-shell">
        <p className="ad-label">Advertisement</p>
        <ins
          className="adsbygoogle"
          data-ad-client={client}
          data-ad-format="auto"
          data-ad-slot={slot}
          data-full-width-responsive="true"
          style={{ display: "block", minHeight: 600, width: "100%" }}
        />
      </div>
    </aside>
  );
}

export function AdRailSlots({
  leftSlot,
  rightSlot,
}: {
  leftSlot?: string;
  rightSlot?: string;
}) {
  const client = normalizeAdSenseClientId(process.env.NEXT_PUBLIC_ADSENSE_ID);

  useEffect(() => {
    if (!client) {
      return;
    }

    if (leftSlot) {
      pushAd();
    }

    if (rightSlot) {
      pushAd();
    }
  }, [client, leftSlot, rightSlot]);

  if (!client || (!leftSlot && !rightSlot)) {
    return null;
  }

  return (
    <>
      {leftSlot ? <RailAd client={client} side="left" slot={leftSlot} /> : null}
      {rightSlot ? <RailAd client={client} side="right" slot={rightSlot} /> : null}
    </>
  );
}
