"use client";

import { useRef, useSyncExternalStore } from "react";
import { normalizeAdSenseClientId, normalizeAdSenseSlotId } from "@/lib/adsense";
import { cn } from "@/lib/utils";
import { useAdSenseSlot } from "@/components/useAdSenseSlot";

interface AdSlotProps {
  slot?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  minHeight?: number;
  minViewportWidth?: number;
}

function subscribeToHydration(callback: () => void) {
  const frame = window.requestAnimationFrame(callback);
  return () => window.cancelAnimationFrame(frame);
}

function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function useMinViewportWidth(minViewportWidth?: number) {
  return useSyncExternalStore(
    subscribeToResize,
    () => !minViewportWidth || window.innerWidth >= minViewportWidth,
    () => !minViewportWidth,
  );
}

export function AdSlot({
  slot,
  className,
  format = "auto",
  minHeight = 96,
  minViewportWidth,
}: AdSlotProps) {
  const client = normalizeAdSenseClientId(process.env.NEXT_PUBLIC_ADSENSE_ID);
  const normalizedSlot = normalizeAdSenseSlotId(slot);
  const shellRef = useRef<HTMLDivElement>(null);
  const mounted = useHydrated();
  const matchesViewport = useMinViewportWidth(minViewportWidth);

  useAdSenseSlot({
    enabled: Boolean(client && normalizedSlot && mounted && matchesViewport),
    slotKey: `${client}:${normalizedSlot}:${format}`,
    targetRef: shellRef,
  });

  if (!client || !normalizedSlot || !matchesViewport) {
    return null;
  }

  return (
    <section
      aria-label="Advertisement"
      className={cn("ad-slot mx-auto w-full max-w-7xl px-4 sm:px-6", className)}
    >
      <div className="ad-shell" ref={shellRef}>
        <p className="ad-label">Advertisement</p>
        {mounted ? (
          <ins
            suppressHydrationWarning
            className="adsbygoogle"
            data-ad-client={client}
            data-ad-format={format}
            data-ad-slot={normalizedSlot}
            data-full-width-responsive="true"
            style={{ display: "block", minHeight, width: "100%" }}
          />
        ) : null}
      </div>
    </section>
  );
}
