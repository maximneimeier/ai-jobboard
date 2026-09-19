"use client";

import { useEffect } from "react";

// Integration hook only: no cookies, personal data, or external analytics requests.
export function LandingEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-landing-event]");
      if (!target) return;
      window.dispatchEvent(
        new CustomEvent("landing:interaction", {
          detail: {
            event: target.dataset.landingEvent,
            placement: target.dataset.placement ?? "unknown",
          },
        }),
      );
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
