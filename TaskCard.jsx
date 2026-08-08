import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Clock, Gauge } from "lucide-react";
import Button from "./Button";
import Badge from "./Badge";

export default function TaskCard({ day, detail }) {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);

  const enterMission = (e) => {
    e.preventDefault();
    setEntering(true);
    setTimeout(() => navigate(`/day/${day}`), 380);
  };

  return (
    <div className="relative border border-[var(--color-line-strong)] rounded-[var(--radius-md)] p-5 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "var(--color-accent)" }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
          Today's mission
        </span>
        <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">Day {day} / 60</span>
      </div>

      <h2 className="relative mt-3 font-display font-semibold text-[24px] leading-[1.15] text-[var(--color-ink)] text-balance">
        {detail.title}
      </h2>

      <p className="relative mt-2 font-mono text-[13px] text-[var(--color-ink-dim)]">{detail.task}</p>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <Badge>
          <Clock className="size-3" strokeWidth={2} />
          {detail.estimate}
        </Badge>
        <Badge>
          <Gauge className="size-3" strokeWidth={2} />
          {detail.difficulty}
        </Badge>
      </div>

      <div className="relative mt-5 border-t border-[var(--color-line)] pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
          What you need to build
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {detail.checklist.map((item, i) => (
            <li key={item.id} className="flex items-baseline gap-2 font-mono text-[12px] text-[var(--color-ink-dim)]">
              <span className="text-[var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.div layout className="relative mt-5">
        <Button onClick={enterMission} to="#" className="w-full" loading={entering}>
          Enter mission
        </Button>
      </motion.div>
    </div>
  );
}
