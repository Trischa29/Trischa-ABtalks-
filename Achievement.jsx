import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export default function Achievement({ label, earned, requirement }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("border-b border-[var(--color-line)] last:border-b-0")}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 py-3 text-left"
        aria-expanded={open}
      >
        {earned ? (
          <Check className="size-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
        ) : (
          <Lock className="size-3.5 shrink-0 text-[var(--color-ink-mute)]" strokeWidth={2} />
        )}
        <span
          className={cn(
            "flex-1 font-mono text-[12px] uppercase tracking-[0.06em]",
            earned ? "text-[var(--color-ink)] font-medium" : "text-[var(--color-ink-mute)]"
          )}
        >
          {label}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-[var(--color-ink-mute)] transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-3 pl-6 font-mono text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
              {earned ? "Unlocked. " : ""}
              {requirement}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
