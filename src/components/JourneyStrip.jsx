import { motion } from "motion/react";
import { cn } from "../lib/cn";
import { stagger, fadeUp, easeOutExpo } from "../lib/motion";

const KEY_DAYS = [1, 7, 12, 14, 30, 45, 60];

// A handful of key days, illuminated by real status, standing in for the
// full 60-day grid — communicates where-am-I / where-have-I-been /
// what's-next without 60 boring identical dots.
export default function JourneyStrip({ days, currentDay, totalDays = 60, className }) {
  const statusOf = (d) => days[d - 1]?.status ?? "upcoming";
  const progressPct = (Math.max(0, currentDay - 1) / (totalDays - 1)) * 100;

  return (
    <div className={cn("relative pt-1.5", className)}>
      <div className="absolute left-0 right-0 top-[8.5px] h-px bg-[var(--color-line-strong)]" />
      <motion.div
        className="absolute left-0 top-[8.5px] h-px bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        whileInView={{ width: `${progressPct}%` }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, ease: easeOutExpo }}
      />
      <motion.div
        variants={stagger(0.06, 0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="relative flex justify-between"
      >
        {KEY_DAYS.map((d) => {
          const status = statusOf(d);
          const isCurrent = d === currentDay;
          return (
            <motion.div key={d} variants={fadeUp} className="flex flex-col items-center gap-2.5">
              <motion.span
                whileHover={{ scale: 1.25 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className={cn(
                  "block size-3.5 rounded-full border",
                  isCurrent
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_0_5px_rgba(91,127,255,0.16)]"
                    : status === "complete"
                      ? "bg-[var(--color-ink)] border-[var(--color-ink)]"
                      : status === "missed"
                        ? "bg-transparent border-[var(--color-warning)]"
                        : "bg-transparent border-[var(--color-line-strong)]"
                )}
              />
              <span
                className={cn(
                  "font-mono text-[10px]",
                  isCurrent
                    ? "text-[var(--color-accent)]"
                    : status === "complete"
                      ? "text-[var(--color-ink-dim)]"
                      : "text-[var(--color-ink-mute)]"
                )}
              >
                {String(d).padStart(2, "0")}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
