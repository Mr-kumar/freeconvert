"use client";

import { useEffect, useRef, type RefObject } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function useAdSenseSlot({
  enabled,
  slotKey,
  targetRef,
}: {
  enabled: boolean;
  slotKey: string;
  targetRef: RefObject<HTMLElement | null>;
}) {
  const pushedSlotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || pushedSlotRef.current === slotKey) {
      return;
    }

    let frame = 0;
    let observer: ResizeObserver | undefined;

    function tryPush() {
      const target = targetRef.current;

      if (!target || pushedSlotRef.current === slotKey) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const hasLayoutBox = target.getClientRects().length > 0;

      if (!hasLayoutBox || rect.width <= 0) {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedSlotRef.current = slotKey;
        observer?.disconnect();
      } catch {
        // AdSense can throw in preview, blockers, before approval, or while the script is not ready.
      }
    }

    frame = window.requestAnimationFrame(tryPush);

    const target = targetRef.current;
    if (target && "ResizeObserver" in window) {
      observer = new ResizeObserver(tryPush);
      observer.observe(target);
    }

    window.addEventListener("resize", tryPush);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", tryPush);
      observer?.disconnect();
    };
  }, [enabled, slotKey, targetRef]);
}
