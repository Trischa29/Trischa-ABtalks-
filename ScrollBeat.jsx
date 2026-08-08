import { cn } from "../../lib/cn";

// A content block that crossfades in/out as scroll progress `t` passes
// through [start, end]. Driven by plain numbers (not MotionValues) to
// avoid Motion's WAAPI-acceleration path misbehaving when many transforms
// share one scroll-linked source.
export function beatOpacity(t, start, end, edge = 0.035) {
  const hasFadeIn = start > 0;
  const hasFadeOut = end < 1;
  if (hasFadeIn && t < start) {
    const inStart = Math.max(0, start - edge);
    return t <= inStart ? 0 : (t - inStart) / (start - inStart);
  }
  if (hasFadeOut && t > end) {
    const outEnd = Math.min(1, end + edge);
    return t >= outEnd ? 0 : 1 - (t - end) / (outEnd - end);
  }
  return 1;
}

export default function ScrollBeat({ t, start, end, edge = 0.035, y = 14, className, children }) {
  const opacity = beatOpacity(t, start, end, edge);
  const hasFadeIn = start > 0;
  const inStart = Math.max(0, start - edge);
  const entryProgress = hasFadeIn ? Math.min(1, Math.max(0, (t - inStart) / (start - inStart))) : 1;
  const translateY = hasFadeIn ? y * (1 - entryProgress) : 0;

  return (
    <div
      style={{ opacity, transform: `translateY(${translateY}px)` }}
      className={cn("pointer-events-none absolute inset-0 flex flex-col justify-center px-6", className)}
    >
      {children}
    </div>
  );
}
