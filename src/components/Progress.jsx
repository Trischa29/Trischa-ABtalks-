import { motion } from "motion/react";
import { springLazy } from "../lib/motion";
import { cn } from "../lib/cn";

export default function Progress({ value, max = 100, className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn("h-[3px] w-full bg-[var(--color-line)] overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <motion.div
        className="h-full bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={springLazy}
      />
    </div>
  );
}
