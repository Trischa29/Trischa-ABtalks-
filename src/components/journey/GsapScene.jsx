import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { beatOpacity } from "../../lib/scrollMath";
import { cn } from "../../lib/cn";

// A scroll-scrubbed scene: fades/slides in as the master track progress
// enters [start, end] and back out past it, mounted the whole time (so
// real inputs/buttons inside keep their state), with pointer-events
// switched on only while it's actually visible.
export default function GsapScene({ subscribe, start, end, edge = 0.035, y = 18, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: start > 0 ? y : 0 });

    const unsub = subscribe((t) => {
      const opacity = beatOpacity(t, start, end, edge);
      const hasFadeIn = start > 0;
      const inStart = Math.max(0, start - edge);
      const entry = hasFadeIn ? Math.min(1, Math.max(0, (t - inStart) / (start - inStart))) : 1;
      gsap.set(el, {
        opacity,
        y: hasFadeIn ? y * (1 - entry) : 0,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
      });
    });

    return unsub;
  }, [subscribe, start, end, edge, y]);

  return (
    <div ref={ref} className={cn("absolute inset-0 flex flex-col justify-center", className)}>
      {children}
    </div>
  );
}
