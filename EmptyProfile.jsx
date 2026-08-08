import { User } from "lucide-react";
import Button from "./Button";

export default function EmptyProfile() {
  return (
    <div className="border border-dashed border-[var(--color-line-strong)] rounded-[var(--radius-md)] p-5">
      <div className="flex size-9 items-center justify-center rounded-full border border-[var(--color-line-strong)]">
        <User className="size-4 text-[var(--color-ink-mute)]" strokeWidth={1.8} />
      </div>
      <p className="mt-4 font-display text-[19px] text-[var(--color-ink)]">Your story starts here.</p>
      <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
        A complete profile is what recruiters see first. Add your track and a one-line pitch — it takes
        under a minute.
      </p>
      <Button variant="ghost" showArrow={false} className="mt-4 w-full">
        Complete your profile
      </Button>
    </div>
  );
}
