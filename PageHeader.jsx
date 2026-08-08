import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/cn";

export default function PageHeader({ backTo, backLabel = "Back", right, className }) {
  return (
    <header className={cn("flex items-center justify-between h-16 shrink-0", className)}>
      {backTo ? (
        <Link
          to={backTo}
          className="flex items-center gap-1.5 -ml-1.5 px-1.5 py-1 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          {backLabel}
        </Link>
      ) : (
        <Link to="/" className="font-display text-[15px] font-medium tracking-tight text-[var(--color-ink)]">
          AB<span className="text-[var(--color-accent)]">.</span>
        </Link>
      )}
      {right}
    </header>
  );
}
