import { motion } from "motion/react";
import { Check } from "lucide-react";
import CountUp from "./CountUp";

export default function CompletionState({ day, total, completedCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="relative overflow-hidden border border-[var(--color-success-dim)] rounded-[var(--radius-md)] px-6 py-8 text-center"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1 }}
        style={{
          background: "radial-gradient(circle at 50% 0%, var(--color-success) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.15 }}
        className="relative mx-auto flex size-12 items-center justify-center rounded-full border border-[var(--color-success-dim)]"
      >
        <Check className="size-5 text-[var(--color-success)]" strokeWidth={2.5} />
      </motion.div>

      <div className="relative mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
        Day {day} · Complete
      </div>

      <p className="relative mt-2 font-display text-[22px] text-[var(--color-ink)]">
        You're still showing up.
      </p>

      <div className="relative mt-4 flex items-baseline justify-center gap-1 font-mono text-[13px] text-[var(--color-ink-dim)]">
        <CountUp value={completedCount} />
        <span>/ {total}</span>
      </div>
    </motion.div>
  );
}
