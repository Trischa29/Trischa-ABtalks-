import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { springSnappy } from "../lib/motion";

const variants = {
  primary: "bg-[var(--color-accent)] text-[var(--color-accent-ink)]",
  ghost: "bg-transparent text-[var(--color-ink)] border border-[var(--color-line-strong)]",
  inverse: "bg-[var(--color-ink)] text-[var(--color-bg)]",
};

const MotionLink = motion.create(Link);

export default function Button({
  children,
  variant = "primary",
  showArrow = true,
  loading = false,
  className,
  as = "button",
  to,
  ...props
}) {
  const Comp = to ? MotionLink : (motion[as] ?? motion.button);
  if (to) props.to = to;
  return (
    <Comp
      whileHover={{ x: showArrow ? 2 : 0 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      className={cn(
        "group inline-flex items-center justify-center gap-2 px-6 py-3.5",
        "font-medium text-[15px] tracking-tight rounded-[var(--radius-sm)]",
        "transition-colors duration-200",
        variants[variant],
        loading && "opacity-70 pointer-events-none",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
      <span>{children}</span>
      {showArrow && !loading && (
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </Comp>
  );
}
