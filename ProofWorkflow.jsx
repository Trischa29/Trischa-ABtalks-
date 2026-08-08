import { Code2, ShieldCheck, Eye, Check } from "lucide-react";
import { GithubMark, LinkedinMark } from "./icons";
import { cn } from "../lib/cn";

const STAGES = [
  { key: "code", label: "Code", note: "Written today, not someday.", Icon: Code2 },
  { key: "github", label: "GitHub", note: "A real commit, timestamped.", Icon: GithubMark },
  { key: "proof", label: "Proof", note: "Verified against the brief.", Icon: ShieldCheck },
  { key: "linkedin", label: "LinkedIn", note: "Posted where it counts.", Icon: LinkedinMark },
  { key: "visibility", label: "Visibility", note: "Seen by the people hiring.", Icon: Eye },
];

// Purely presentational — `progress` (0..1) is the caller's own local
// slice of the page's single master scroll value, so this activates in
// lockstep with the same GSAP-driven timeline as everything else on the
// page rather than tracking its own scroll.
export default function ProofWorkflow({ progress = 0, className }) {
  const activeIndex = Math.floor(progress * STAGES.length);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--color-line-strong)]" aria-hidden />
      <div
        className="absolute left-[15px] top-2 w-px bg-[var(--color-accent)]"
        style={{ height: `${progress * 100}%` }}
        aria-hidden
      />
      <div className="space-y-6">
        {STAGES.map((s, i) => {
          const isActive = i <= activeIndex;
          return (
            <div key={s.key} className="relative flex items-start gap-4">
              <div
                className={cn(
                  "relative z-10 flex size-[31px] shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  isActive
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "border-[var(--color-line-strong)] bg-[var(--color-bg)] text-[var(--color-ink-faint)]"
                )}
              >
                {isActive ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <s.Icon className="size-3.5" strokeWidth={1.8} />
                )}
              </div>
              <div className={cn("pt-1.5 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-45")}>
                <p className="font-display font-semibold text-[16px] leading-none">{s.label}</p>
                <p className="mt-1.5 font-mono text-[11px] text-[var(--color-ink-dim)]">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
