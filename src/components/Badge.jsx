import { cn } from "../lib/cn";

const tones = {
  neutral: "text-[var(--color-ink-dim)] border-[var(--color-line-strong)]",
  accent: "text-[var(--color-accent)] border-[var(--color-line-accent)]",
  success: "text-[var(--color-success)] border-[color-mix(in_srgb,var(--color-success)_35%,transparent)]",
  warning: "text-[var(--color-warning)] border-[color-mix(in_srgb,var(--color-warning)_35%,transparent)]",
};

export default function Badge({ children, tone = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-full)]",
        "border font-mono text-[11px] uppercase tracking-[0.08em] leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
