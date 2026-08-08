import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export default function ExpandableRow({ icon, title, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("border-b border-[var(--color-line)] last:border-b-0", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 py-3.5 text-left"
        aria-expanded={open}
      >
        {icon}
        <span className="flex-1 font-display font-semibold text-[16px] leading-snug">{title}</span>
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
            <div className="pb-3.5 font-mono text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
