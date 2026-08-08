import { motion } from "motion/react";
import Button from "./Button";

const copy = {
  missed: {
    eyebrow: "Day 12",
    lines: ["Yesterday didn't go to plan.", "Your journey is still here."],
    action: "The path behind you hasn't moved. Pick it back up.",
    cta: "Keep moving",
  },
  firstDay: {
    eyebrow: "Day 1",
    lines: ["Every builder", "starts somewhere."],
    action: "0 day streak — that's exactly where day one is supposed to start.",
    cta: "Start Day 1",
  },
};

export default function MomentumCard({ variant, href = "/day/12" }) {
  const c = copy[variant];
  return (
    <div className="relative border border-[var(--color-line-strong)] rounded-[var(--radius-md)] p-5 overflow-hidden">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
        {c.eyebrow}
      </span>

      <div className="mt-3 space-y-1">
        {c.lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[22px] leading-[1.2] text-[var(--color-ink)] text-balance"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <p className="mt-4 font-mono text-[13px] text-[var(--color-ink-dim)]">{c.action}</p>

      <div className="mt-5">
        <Button to={href} className="w-full">
          {c.cta}
        </Button>
      </div>
    </div>
  );
}
