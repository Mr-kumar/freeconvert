"use client";

import { useEffect } from "react";
import { normalizeAdSenseClientId } from "@/lib/adsense";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  minHeight?: number;
}

export function AdSlot({
  slot,
  className,
  format = "auto",
  minHeight = 96,
}: AdSlotProps) {
  const client = normalizeAdSenseClientId(process.env.NEXT_PUBLIC_ADSENSE_ID);

  useEffect(() => {
    if (!client || !slot) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense can throw in preview, blockers, or before approval.
    }
  }, [client, slot]);

  if (!client || !slot) {
    return null;
  }

  return (
    <section
      aria-label="Advertisement"
      className={cn("ad-slot mx-auto w-full max-w-7xl px-4 sm:px-6", className)}
    >
      <div className="ad-shell">
        <p className="ad-label">Advertisement</p>
        <ins
          className="adsbygoogle"
          data-ad-client={client}
          data-ad-format={format}
          data-ad-slot={slot}
          data-full-width-responsive="true"
          style={{ display: "block", minHeight }}
        />
      </div>
    </section>
  );
}
