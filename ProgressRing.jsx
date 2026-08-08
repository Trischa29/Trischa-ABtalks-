import { cn } from "../lib/cn";

// Pure, prop-driven — no internal animation. Scroll-driven callers pass
// an already-interpolated `value` each frame so the ring fills and the
// number counts up in lockstep with the user's scroll, not a canned
// mount-triggered tween.
export default function ProgressRing({ value, max, size = 104, strokeWidth = 5, sublabel, className }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value / max));
  const dashoffset = circumference * (1 - pct);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline gap-1 font-display font-semibold text-[22px] leading-none text-[var(--color-ink)]">
          <span>{Math.round(value)}</span>
          <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">/{max}</span>
        </div>
        {sublabel && (
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
