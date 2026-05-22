"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeAdSenseClientId, normalizeAdSenseSlotId } from "@/lib/adsense";
import { useAdSenseSlot } from "@/components/useAdSenseSlot";

const RAIL_MEDIA_QUERY = "(min-width: 1900px)";

function useCanRenderRailAds() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(RAIL_MEDIA_QUERY);

    function update() {
      setCanRender(query.matches);
    }

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return canRender;
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
  const railRef = useRef<HTMLElement>(null);

  useAdSenseSlot({
    enabled: Boolean(client && slot),
    slotKey: `${client}:${slot}:${side}`,
    targetRef: railRef,
  });

  return (
    <aside
      aria-label={`${side} advertisement`}
      className={`ad-rail ad-rail-${side}`}
      ref={railRef}
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
  const left = normalizeAdSenseSlotId(leftSlot);
  const right = normalizeAdSenseSlotId(rightSlot);
  const railAdsEnabled = process.env.NEXT_PUBLIC_ENABLE_RAIL_ADS === "true";
  const canRenderRailAds = useCanRenderRailAds();

  if (!railAdsEnabled || !canRenderRailAds || !client || (!left && !right)) {
    return null;
  }

  return (
    <>
      {left ? <RailAd client={client} side="left" slot={left} /> : null}
      {right ? <RailAd client={client} side="right" slot={right} /> : null}
    </>
  );
}
