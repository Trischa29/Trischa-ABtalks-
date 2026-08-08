import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, TriangleAlert, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export default function ProofInput({
  index,
  icon: Icon,
  label,
  prompt,
  placeholder,
  value,
  onChange,
  status = "idle",
  errorText,
  successText,
  checkLabel,
  validatingLabel = "Validating...",
  onCheck,
  checks = [],
}) {
  const isValid = status === "valid";
  const isInvalid = status === "invalid";
  const isValidating = status === "validating";

  return (
    <div
      className={cn(
        "border rounded-[var(--radius-md)] p-4 transition-colors duration-300",
        isValid ? "border-[var(--color-success-dim)]" : "border-[var(--color-line-strong)]"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">
          {String(index).padStart(2, "0")}
        </span>
        {Icon && <Icon className="size-4 text-[var(--color-ink-dim)]" strokeWidth={1.8} />}
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
          {label}
        </span>
        <AnimatePresence>
          {isValid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="ml-auto flex items-center gap-1 text-[var(--color-success)]"
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2.5 font-display text-[18px] leading-snug text-[var(--color-ink)]">{prompt}</p>

      <div className="relative mt-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isValid || isValidating}
          aria-label={label}
          aria-invalid={isInvalid}
          className={cn(
            "w-full bg-[var(--color-bg-raised)] border rounded-[var(--radius-sm)] px-3.5 py-3",
            "font-mono text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)]",
            "outline-none transition-colors duration-200 disabled:opacity-70",
            isInvalid
              ? "border-[var(--color-warning)]"
              : isValid
                ? "border-[var(--color-success-dim)]"
                : "border-[var(--color-line-strong)] focus:border-[var(--color-accent)]"
          )}
        />
      </div>

      {!isValid && (
        <button
          type="button"
          onClick={onCheck}
          disabled={!value.trim() || isValidating}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em]",
            "text-[var(--color-accent)] disabled:text-[var(--color-ink-faint)] disabled:pointer-events-none",
            "transition-colors duration-200"
          )}
        >
          {isValidating ? (
            <>
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
              {validatingLabel}
            </>
          ) : (
            <>
              {checkLabel}
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </>
          )}
        </button>
      )}

      <AnimatePresence>
        {isInvalid && errorText && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--color-warning)]"
          >
            <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2} />
            {errorText}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checks.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 space-y-1.5"
          >
            {checks.map((c) => (
              <motion.li
                key={c.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 font-mono text-[12px] text-[var(--color-ink-dim)]"
              >
                {c.state === "checking" && (
                  <Loader2 className="size-3 animate-spin text-[var(--color-ink-mute)]" strokeWidth={2} />
                )}
                {c.state === "done" && (
                  <Check className="size-3 text-[var(--color-success)]" strokeWidth={2.5} />
                )}
                <span>{c.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isValid && successText && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--color-success)]"
          >
            <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
            {successText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
