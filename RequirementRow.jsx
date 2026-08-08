import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export default function RequirementRow({ index, title, children, checked, onToggle, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("border-b border-[var(--color-line)] last:border-b-0", className)}>
      <div className="flex items-center gap-3 py-3.5">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={checked}
          aria-label={checked ? `Mark ${title} incomplete` : `Mark ${title} complete`}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors duration-200",
            checked
              ? "bg-[var(--color-success)] border-[var(--color-success)] text-[var(--color-bg)]"
              : "border-[var(--color-line-strong)] text-transparent hover:border-[var(--color-ink-mute)]"
          )}
        >
          <Check className="size-3" strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2.5 text-left"
          aria-expanded={open}
        >
          <span className="font-mono text-[11px] text-[var(--color-ink-mute)] w-5 shrink-0">
            {String(index).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "flex-1 font-display font-semibold text-[16px] leading-snug transition-colors duration-200",
              checked ? "text-[var(--color-ink-dim)] line-through decoration-[var(--color-ink-faint)]" : "text-[var(--color-ink)]"
            )}
          >
            {title}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-[var(--color-ink-mute)] transition-transform duration-200",
              open && "rotate-180"
            )}
            strokeWidth={2}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-3.5 pl-8 font-mono text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
