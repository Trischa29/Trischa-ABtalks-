import { motion } from "motion/react";
import { Check } from "lucide-react";
import CountUp from "./CountUp";
import JourneyGrid from "./JourneyGrid";

export default function CompletionState({
  day,
  total,
  completedCount,
  previousCompletedCount,
  streak,
  previousStreak,
  days,
  currentDay,
}) {
  const isFirstDay = day === 1;
  const remaining = Math.max(0, total - completedCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="relative overflow-hidden border border-[var(--color-success-dim)] rounded-[var(--radius-md)] px-6 py-7 text-center"
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

      {/* Focal point: the day just finished, not a generic "complete" badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
        className="relative"
      >
        <p className="font-display font-bold leading-[0.95] text-[clamp(2.2rem,8vw,3.2rem)] tracking-tight text-[var(--color-ink)]">
          Day {String(day).padStart(2, "0")}
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-success)]">
          <Check className="size-3.5" strokeWidth={3} />
          Completed
        </div>
      </motion.div>

      <p className="relative mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
        {isFirstDay ? "First build complete" : "You're still showing up."}
      </p>
      <p className="relative mt-1.5 font-sans text-[14px] text-[var(--color-ink-dim)] max-w-[30ch] mx-auto">
        {isFirstDay ? "Your 60-day journey has officially begun." : "Every day adds to the record."}
      </p>

      <div className="relative mt-6 mx-auto grid max-w-[220px] grid-cols-2 gap-4">
        <div>
          <div className="flex items-baseline justify-center gap-1 font-display font-semibold text-[22px] text-[var(--color-ink)]">
            <CountUp value={completedCount} from={previousCompletedCount ?? completedCount} />
            <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">/{total}</span>
          </div>
          <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            Complete
          </div>
        </div>
        {streak != null && (
          <div>
            <div className="flex items-baseline justify-center gap-1 font-display font-semibold text-[22px] text-[var(--color-accent)]">
              <CountUp value={streak} from={previousStreak ?? streak} />
            </div>
            <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
              Day Streak
            </div>
          </div>
        )}
      </div>

      {days && (
        <div className="relative mt-7 border-t border-[var(--color-line)] pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            {completedCount} / {total} days complete
            <span className="text-[var(--color-line-strong)]"> · </span>
            {remaining} to go
          </p>
          <JourneyGrid days={days} currentDay={currentDay} className="mt-4 mx-auto max-w-[300px]" />
        </div>
      )}
    </motion.div>
  );
}
