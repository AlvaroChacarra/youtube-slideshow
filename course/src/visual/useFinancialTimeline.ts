import { useEffect, useRef, type RefObject } from "react";

declare global {
  interface Window { __BOND_DEBUG__?: { timelines: number; visibilityListeners: number } }
}

export function useFinancialTimeline(stage: number, selector = "[data-motion]"): RefObject<HTMLDivElement | null> {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    let timeline: { pause: () => void; resume: () => void; kill: () => void } | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const debug = window.__BOND_DEBUG__ ??= { timelines: 0, visibilityListeners: 0 };
    const visibility = () => document.hidden ? timeline?.pause() : timeline?.resume();
    document.addEventListener("visibilitychange", visibility);
    debug.visibilityListeners += 1;
    void import("gsap").then(({ gsap }) => {
      if (cancelled || !root.current) return;
      context = gsap.context(() => {
        timeline = gsap.timeline({ paused: true })
          .fromTo(selector, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .34, stagger: .045, ease: "power3.out" });
        timeline.resume();
        debug.timelines += 1;
      }, root);
    });
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", visibility);
      debug.visibilityListeners = Math.max(0, debug.visibilityListeners - 1);
      if (timeline) {
        timeline.kill();
        debug.timelines = Math.max(0, debug.timelines - 1);
      }
      context?.revert();
    };
  }, [selector, stage]);
  return root;
}
