// Pure scroll-progress math shared by the GSAP-driven scene system.
// No Framer/React dependency — safe to use from both R3F (per-frame ref
// reads) and plain DOM mutation (GSAP scene reveals).

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

// Remaps global track progress into a scene's own local 0..1 range.
export function localProgress(t, start, end) {
  if (end <= start) return t >= start ? 1 : 0;
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

export function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}
