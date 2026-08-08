import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TaskCard from "../components/TaskCard";
import MomentumCard from "../components/MomentumCard";
import EmptyProfile from "../components/EmptyProfile";
import StreakDisplay from "../components/StreakDisplay";
import LaptopScene from "../components/journey/LaptopScene";
import Achievement from "../components/Achievement";
import Badge from "../components/Badge";
import SectionReveal from "../components/SectionReveal";
import ModelCredit from "../components/ModelCredit";
import { useStudentState } from "../hooks/useStudentState";
import { student, dayDetail, achievements, TOTAL_DAYS } from "../data/challenge";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  // ?state=missed|firstDay is a dev-only mock control for demoing the
  // alternate journey states — not part of the real product surface.
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  const view = stateParam === "missed" || stateParam === "firstDay" ? stateParam : "active";

  const progress = useStudentState();
  const greet = useMemo(greeting, []);
  const detail = dayDetail[progress.currentDay] ?? dayDetail[12];
  const timelineProgress = view === "firstDay" ? 0 : progress.completedDays;
  const remaining = TOTAL_DAYS - progress.currentDay;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div className="mx-auto max-w-[480px]">
        <div className="px-5">
          <PageHeader
            right={
              <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">
                {progress.currentDay} / {TOTAL_DAYS}
              </span>
            }
          />
        </div>

        {/* The laptop — your work, rendered live on its screen — with
            the real progress numbers flanking it, not buried by it */}
        <div className="relative">
          <SectionReveal>
            <LaptopScene className="h-[280px] w-full" fallbackClassName="h-[280px] px-5" />
          </SectionReveal>

          {view !== "firstDay" && (
            <>
              <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
                Completed
                <br />
                <span className="text-[var(--color-ink)] text-[13px]">{timelineProgress} days</span>
              </div>
              <div className="pointer-events-none absolute right-5 top-5 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
                Remaining
                <br />
                <span className="text-[var(--color-ink)] text-[13px]">{remaining} days</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  You are here — day {progress.currentDay}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            {greet}, {student.name}.
          </p>
          {view === "firstDay" ? (
            <h1 className="mt-1 font-display font-bold text-[30px] leading-tight">
              Your journey starts now.
            </h1>
          ) : (
            <>
              <h1 className="mt-1 font-display font-bold text-[30px] leading-tight text-balance">
                Your journey is already moving.
              </h1>
              <p className="mt-1 font-mono text-[13px] text-[var(--color-accent)]">
                {progress.streak} day streak
              </p>
            </>
          )}
          <div className="mt-3">
            <Badge tone="accent">{student.track}</Badge>
          </div>

          <div className="mt-6">
            {/* TaskCard is keyed off detail.day (not progress.currentDay) so the
                label always matches the content shown — only Day 12 has an
                authored mission in this mock dataset. */}
            {view === "active" && <TaskCard day={detail.day} detail={detail} />}
            {view === "missed" && <MomentumCard variant="missed" href={`/day/${progress.currentDay}`} />}
            {view === "firstDay" && <MomentumCard variant="firstDay" href="/day/12" />}
          </div>

          {view !== "firstDay" && (
            <SectionReveal className="mt-8">
              <StreakDisplay
                streak={progress.streak}
                longest={progress.longestStreak}
                progress={progress.completedDays}
                total={TOTAL_DAYS}
              />
            </SectionReveal>
          )}

          {view !== "firstDay" && (
            <SectionReveal className="mt-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
                Achievements
              </span>
              <div className="mt-3">
                {achievements.map((a) => {
                  const earned = a.atLeast
                    ? progress.completedDays >= a.atLeast
                    : progress.streak >= a.streakAtLeast;
                  return (
                    <Achievement key={a.id} label={a.label} earned={earned} requirement={a.requirement} />
                  );
                })}
              </div>
            </SectionReveal>
          )}

          <SectionReveal className="mt-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
              Profile
            </span>
            <div className="mt-4">
              <EmptyProfile />
            </div>
          </SectionReveal>

          <ModelCredit ids={["laptop", "city"]} className="mt-10 border-t border-[var(--color-line)] pt-6" />
        </div>
      </div>
    </main>
  );
}
