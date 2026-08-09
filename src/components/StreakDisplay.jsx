import CountUp from "./CountUp";

export default function StreakDisplay({ streak, longest, progress, total }) {
  const stats = [
    { label: "Streak", value: streak, unit: "days" },
    { label: "Longest", value: longest, unit: "days" },
    { label: "Complete", value: progress, unit: `/ ${total}` },
    { label: "Remaining", value: total - progress, unit: "days" },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-y border-[var(--color-line)] py-4">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="flex items-baseline gap-1 font-display font-semibold text-[24px] leading-none text-[var(--color-ink)]">
            <CountUp value={s.value} />
            <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">{s.unit}</span>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
