import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

// Pins `trackRef` for its full height and exposes scroll progress (0..1)
// both as a per-frame-readable ref (for R3F) and via subscription (for
// GSAP-driven DOM scene reveals). One ScrollTrigger is the single source
// of truth for the whole page's cinematic timeline.
export function useScrollTrack(trackRef) {
  const progressRef = useRef(0);
  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (!trackRef.current) return;

    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        listenersRef.current.forEach((fn) => fn(self.progress));
      },
      onRefresh: (self) => {
        progressRef.current = self.progress;
        listenersRef.current.forEach((fn) => fn(self.progress));
      },
    });

    // Scenes register their listeners in child effects that run before
    // this one, but ScrollTrigger only calls onUpdate on an actual
    // scroll/refresh event — without this, scene 1 (progress 0) never
    // gets painted in until the user's first scroll tick.
    progressRef.current = st.progress;
    listenersRef.current.forEach((fn) => fn(st.progress));

    return () => st.kill();
  }, [trackRef]);

  // Stable across re-renders — Dashboard/Day re-render on every scroll
  // tick (live counters), and if this identity churned, every GsapScene's
  // effect would unsubscribe/resubscribe mid-iteration of the very
  // forEach that's calling them, silently dropping updates for scenes
  // later in iteration order.
  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  return { progressRef, subscribe };
}
