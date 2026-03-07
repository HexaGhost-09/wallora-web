"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const track = async () => {
      try {
        await fetch("/api/track/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
          }),
        });
      } catch (e) {
        // Silently fail analytics
      }
    };

    track();
  }, [pathname]);

  return null;
}
