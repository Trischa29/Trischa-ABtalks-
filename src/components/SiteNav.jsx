import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/cn";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Today", to: "/day/12" },
];

// Minimal, always-available way back to the other two routes — small
// mono text, never competing with the cinematic layer for attention.
export default function SiteNav({ orientation = "row", className }) {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "flex gap-3.5",
        orientation === "row" ? "items-center" : "flex-col items-start gap-2",
        className
      )}
    >
      {LINKS.map((link) => {
        const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              active
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
