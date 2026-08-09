import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

// Compact, full-length companion to JourneyStrip's 7-key-day strip — same
// dot visual language (filled = complete, accent glow = current, warning
// border = missed, subtle border = upcoming), just every day instead of a
// handful, for the one place a student should see the entire 60-day shape
// of the challenge at a glance: right after finishing a build.
export default function JourneyGrid({ days, currentDay, className }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { delayChildren: 0.3, staggerChildren: 0.008 } } }}
      className={cn("grid grid-cols-10 gap-[5px] sm:gap-1.5", className)}
    >
      {days.map(({ day, status }) => {
        const isCurrent = day === currentDay;
        const isComplete = status === "complete";
        return (
          <motion.span
            key={day}
            title={`Day ${String(day).padStart(2, "0")}`}
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 420, damping: 26 } },
            }}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-[3px]",
              isCurrent
                ? "bg-[var(--color-accent)] shadow-[0_0_0_3px_rgba(91,127,255,0.18)]"
                : isComplete
                  ? "bg-[var(--color-ink)]"
                  : status === "missed"
                    ? "bg-transparent border border-[var(--color-warning)]"
                    : "bg-[var(--color-line)]/50"
            )}
          >
            {isComplete && <Check className="size-2.5 text-[var(--color-bg)]" strokeWidth={3} />}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
