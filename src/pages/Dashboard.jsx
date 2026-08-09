import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, Gauge } from "lucide-react";
import PageHeader from "../components/PageHeader";
import GsapScene from "../components/journey/GsapScene";
import LaptopScene from "../components/journey/LaptopScene";
import Achievement from "../components/Achievement";
import ProgressRing from "../components/ProgressRing";
import JourneyStrip from "../components/JourneyStrip";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ModelCredit from "../components/ModelCredit";
import { useStudentState } from "../hooks/useStudentState";
import { useScrollTrack } from "../hooks/useScrollTrack";
import { useLenis } from "../hooks/useLenis";
import { localProgress } from "../lib/scrollMath";
import { student, dayDetail, achievements, TRACK_OPTIONS, TOTAL_DAYS } from "../data/challenge";

const STANDING_RANK = 24;
const TRACK_HEIGHT_VH = 720;
const MISSED_DEMO_DAY = 13;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// Reads its own live slice of the master scroll progress, remapped to
// [start,end], so numbers count up and the ring fills IN LOCKSTEP WITH
// SCROLL — not a mount-triggered tween. Scroll back up and it empties
// back out, exactly like the rest of the cinematic timeline.
function useLocalSceneProgress(subscribe, start, end) {
  const [t, setT] = useState(0);
  useEffect(() => subscribe((global) => setT(localProgress(global, start, end))), [subscribe, start, end]);
  return t;
}

// Overlays a "streak just paused" snapshot on top of real state, purely
// for demoing the missed-day UX to a judge without requiring 13 real
// days of progress first — the brief explicitly allows this state to be
// reachable without being the default. Not part of the real product
// surface; real actions (selecting a track, completing a day) still
// write through to the real persisted state underneath.
function buildMissedDemoProgress(real) {
  const completedDayNumbers = Array.from({ length: MISSED_DEMO_DAY - 1 }, (_, i) => i + 1);
  const currentDay = MISSED_DEMO_DAY + 1;
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1;
    let status = "upcoming";
    if (day < MISSED_DEMO_DAY) status = "complete";
    else if (day === MISSED_DEMO_DAY) status = "missed";
    if (day === currentDay) status = "current";
    return { day, status };
  });
  return {
    ...real,
    currentDay,
    streak: 0,
    longestStreak: Math.max(real.longestStreak, 12),
    completedDays: completedDayNumbers.length,
    track: real.track || "Web Development",
    days,
    isDayComplete: (d) => d < MISSED_DEMO_DAY,
  };
}

export default function Dashboard() {
  // ?state=missed is a dev-only overlay for demoing the momentum-recovery
  // UX without grinding 13 real days first — not part of the real product
  // surface. Everything else on this page is driven by real, persisted
  // student state: no track picked and zero completed days is the actual
  // default for a brand-new student, not a demo.
  const [searchParams] = useSearchParams();
  const demoMissed = searchParams.get("state") === "missed";

  const realProgress = useStudentState();
  const progress = demoMissed ? buildMissedDemoProgress(realProgress) : realProgress;

  const greet = useMemo(greeting, []);
  const hasTrack = !!progress.track;
  const hasStarted = progress.completedDays > 0;

  // Only day 1 and day 12 have fully authored content (the rest of the
  // 60 days are out of scope for a hackathon mock). Prefer day 12 as the
  // fallback rather than day 1 — once day 1 is actually completed,
  // falling back to it again would show its own already-checked
  // checklist as if it were still today's pending task.
  const detail = dayDetail[progress.currentDay] ?? dayDetail[12] ?? dayDetail[1];
  const remaining = TOTAL_DAYS - progress.currentDay;

  const completedDayNumbers = useMemo(
    () =>
      progress.days
        .filter((d) => d.status === "complete")
        .map((d) => d.day)
        .sort((a, b) => b - a),
    [progress.days]
  );
  const historyItems = useMemo(
    () =>
      completedDayNumbers.slice(0, 5).map((day) => ({
        day,
        title: dayDetail[day]?.title ?? `Day ${day} build`,
      })),
    [completedDayNumbers]
  );

  useLenis();
  const trackRef = useRef(null);
  const { progressRef, subscribe } = useScrollTrack(trackRef);

  const revealT = useLocalSceneProgress(subscribe, 0.12, 0.29);
  const revealed = Math.min(1, revealT / 0.7);

  const cta = demoMissed
    ? { title: "The path behind you hasn't moved.", label: "Keep moving", href: `/day/${progress.currentDay}` }
    : !hasStarted
      ? { title: "Every builder starts somewhere.", label: `Start Day ${progress.currentDay}`, href: `/day/${progress.currentDay}` }
      : { title: detail.title, label: `Open Day ${detail.day}`, href: `/day/${detail.day}` };

  return (
    <main className="relative bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <LaptopScene progressRef={progressRef} className="absolute inset-0" fallbackClassName="absolute inset-0" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(7,7,12,0.55) 0%, rgba(7,7,12,0.05) 40%, rgba(7,7,12,0.05) 62%, rgba(7,7,12,0.72) 100%)",
            }}
          />

          <PageHeader
            className="absolute top-0 inset-x-0 px-5 sm:px-8 pt-5 sm:pt-6 z-10"
            right={
              <span className="font-mono font-medium text-[11px] text-[var(--color-ink-dim)]">
                {progress.currentDay} / {TOTAL_DAYS}
              </span>
            }
          />

          {/* SCENE 1 — arrival: empty profile + track picker, day-one state, or real progress */}
          <GsapScene
            subscribe={subscribe}
            start={0}
            end={0.13}
            className="items-end text-right justify-end pb-20 px-6 sm:px-10 lg:px-16"
          >
            <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
              <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                {greet}, {student.name}.
              </p>

              {!hasTrack ? (
                <>
                  <h1 className="mt-2 font-display font-bold leading-[1.08] text-[clamp(1.7rem,5.5vw,2.4rem)] text-balance max-w-[20ch] ml-auto">
                    Your journey starts here.
                  </h1>
                  <p className="mt-3 font-sans font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[32ch] ml-auto">
                    Your builder profile is still empty. Complete your first challenge to begin building your
                    public track record.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Track
                      </p>
                      <p className="mt-1 font-display font-bold text-[16px] text-[var(--color-ink-mute)]">
                        Not selected
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Projects
                      </p>
                      <p className="mt-1 font-display font-bold text-[16px]">0</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Days completed
                      </p>
                      <p className="mt-1 font-display font-bold text-[16px]">0</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Streak
                      </p>
                      <p className="mt-1 font-display font-bold text-[16px]">0</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                      Choose your track
                    </p>
                    <div className="mt-2.5 flex flex-wrap justify-end gap-2 pointer-events-auto">
                      {TRACK_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => realProgress.selectTrack(t)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-full)] border font-mono text-[11px] uppercase tracking-[0.08em] leading-none border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : demoMissed ? (
                <>
                  <h1 className="mt-1 font-display font-bold leading-[0.95] text-[clamp(2.4rem,9vw,4rem)] tracking-tight">
                    Day {MISSED_DEMO_DAY}
                    <span className="text-[var(--color-warning)]"> — missed</span>
                  </h1>
                  <p className="mt-3 font-mono text-[13px] text-[var(--color-warning)]">Your streak has paused.</p>
                  <p className="mt-3 font-sans font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[32ch] ml-auto">
                    Don't worry — you can start building again today.
                  </p>
                </>
              ) : !hasStarted ? (
                <>
                  <h1 className="mt-1 font-display font-bold leading-[0.95] text-[clamp(2.4rem,9vw,4rem)] tracking-tight">
                    Day {progress.currentDay}
                    <span className="text-[var(--color-ink-dim)]">/{TOTAL_DAYS}</span>
                  </h1>
                  <p className="mt-3 font-mono text-[13px] text-[var(--color-accent)]">
                    Your journey starts here · 0 day streak
                  </p>
                  <p className="mt-3 font-sans font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[32ch] ml-auto">
                    You haven't built your streak yet. Complete today's build to start it.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="mt-1 font-display font-bold leading-[0.95] text-[clamp(2.4rem,9vw,4rem)] tracking-tight">
                    Day {progress.currentDay}
                    <span className="text-[var(--color-ink-dim)]">/{TOTAL_DAYS}</span>
                  </h1>
                  <p className="mt-3 font-mono text-[13px] text-[var(--color-accent)]">
                    {progress.streak} day streak · {progress.completedDays}/{TOTAL_DAYS} complete
                  </p>
                  <p className="mt-3 font-sans font-medium text-[13px] text-[var(--color-ink-dim)]">
                    Your journey is already moving.
                  </p>
                </>
              )}
            </div>
          </GsapScene>

          {/* SCENE 2 — your progress: live scroll-linked counters + ring */}
          {hasTrack && hasStarted && (
            <GsapScene
              subscribe={subscribe}
              start={0.12}
              end={0.31}
              className="items-end text-right justify-center px-6 sm:px-10 lg:px-16"
            >
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                  Your progress
                </p>
                <div className="mt-6 flex items-end justify-end gap-8">
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="font-mono font-medium text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Streak
                      </p>
                      <p className="mt-1 font-display font-bold leading-none text-[32px] text-[var(--color-accent)]">
                        {Math.round(revealed * progress.streak)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono font-medium text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Best
                      </p>
                      <p className="mt-1 font-display font-bold leading-none text-[32px]">
                        {Math.round(revealed * progress.longestStreak)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono font-medium text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                        Remaining
                      </p>
                      <p className="mt-1 font-display font-bold leading-none text-[32px]">
                        {Math.round(revealed * remaining)}
                      </p>
                    </div>
                  </div>
                  <ProgressRing value={revealed * progress.completedDays} max={TOTAL_DAYS} sublabel="Complete" />
                </div>
              </div>
            </GsapScene>
          )}

          {/* SCENE 3 — 60-day journey */}
          {hasTrack && hasStarted && (
            <GsapScene subscribe={subscribe} start={0.29} end={0.48} className="justify-center px-6 sm:px-10 lg:px-16">
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                  60-day journey
                </p>
                <h3 className="mt-2 font-display font-semibold text-[20px] text-balance max-w-[24ch]">
                  Where you've been, where you're headed.
                </h3>
                <JourneyStrip days={progress.days} currentDay={progress.currentDay} className="mt-9 max-w-[520px]" />
              </div>
            </GsapScene>
          )}

          {/* SCENE 4 — today's build (skipped until a track is picked) */}
          {hasTrack && (
            <GsapScene subscribe={subscribe} start={0.46} end={0.63} className="justify-center px-6 sm:px-10 lg:px-16">
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                {demoMissed ? (
                  <>
                    <span className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                      Day {progress.currentDay}
                    </span>
                    <h2 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.6rem,4.5vw,2.1rem)] text-balance max-w-[20ch]">
                      Yesterday didn't go to plan.
                    </h2>
                    <p className="mt-2 font-mono font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[36ch]">
                      The path behind you hasn't moved. Pick it back up.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Today's build
                      </span>
                      <span className="font-mono font-medium text-[11px] text-[var(--color-ink-dim)]">
                        Day {detail.day} / {TOTAL_DAYS}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.6rem,4.5vw,2.1rem)] text-balance max-w-[20ch]">
                      {detail.title}
                    </h2>
                    <p className="mt-2 font-mono font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[36ch]">
                      {detail.task}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge>
                        <Clock className="size-3" strokeWidth={2} />
                        {detail.estimate}
                      </Badge>
                      <Badge>
                        <Gauge className="size-3" strokeWidth={2} />
                        {detail.difficulty}
                      </Badge>
                      <Badge tone="accent">{progress.track}</Badge>
                    </div>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-[520px]">
                      {detail.checklist.map((item, i) => (
                        <div
                          key={item.id}
                          className="border border-[var(--color-line)] rounded-[var(--radius-md)] px-3 py-2.5"
                        >
                          <span className="font-mono text-[10px] text-[var(--color-accent)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="mt-0.5 font-display font-semibold text-[13px]">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </GsapScene>
          )}

          {/* SCENE 5 — achievements + standing */}
          {hasTrack && hasStarted && (
            <GsapScene subscribe={subscribe} start={0.61} end={0.76} className="justify-center px-6 sm:px-10 lg:px-16">
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                  Achievements
                </p>
                <h3 className="mt-2 font-display font-semibold text-[20px] text-balance max-w-[24ch]">
                  Proof you've kept showing up.
                </h3>
                <div className="mt-5 max-w-[420px]">
                  {achievements.map((a) => {
                    const earned = a.atLeast
                      ? progress.completedDays >= a.atLeast
                      : progress.streak >= a.streakAtLeast;
                    return <Achievement key={a.id} label={a.label} earned={earned} requirement={a.requirement} />;
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between max-w-[420px] border-t border-[var(--color-line)] pt-4">
                  <span className="font-mono font-medium text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                    Standing in {progress.track ?? "your track"}
                  </span>
                  <span className="font-display font-bold text-[20px] text-[var(--color-accent)]">
                    #{STANDING_RANK}
                  </span>
                </div>
              </div>
            </GsapScene>
          )}

          {/* SCENE 6 — build history: derived from real completed days */}
          {hasTrack && hasStarted && (
            <GsapScene subscribe={subscribe} start={0.74} end={0.89} className="justify-center px-6 sm:px-10 lg:px-16">
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                  Build history
                </p>
                <h3 className="mt-2 font-display font-semibold text-[20px] text-balance max-w-[24ch]">
                  You keep shipping.
                </h3>
                <div className="mt-5 max-w-[420px] divide-y divide-[var(--color-line)]">
                  {historyItems.map((item) => (
                    <div key={item.day} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <span className="font-mono text-[10px] text-[var(--color-accent)]">
                          Day {String(item.day).padStart(2, "0")}
                        </span>
                        <p className="mt-0.5 font-display font-semibold text-[14px]">{item.title}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.06em]">
                        <span className="text-[var(--color-success)]">GitHub ✓</span>
                        <span className="text-[var(--color-success)]">LinkedIn ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GsapScene>
          )}

          {/* SCENE 7 — closing CTA (the one route-changing button on this page) */}
          <GsapScene
            subscribe={subscribe}
            start={0.87}
            end={1}
            className="items-center text-center justify-center px-6"
          >
            <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-6 sm:px-8">
              {hasTrack ? (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    Ready to build?
                  </p>
                  <h2 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.6rem,5vw,2.2rem)] text-balance max-w-[20ch]">
                    {cta.title}
                  </h2>
                  <div className="mt-6">
                    <Button to={cta.href}>{cta.label}</Button>
                  </div>
                </>
              ) : (
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
                  Choose a track above to begin.
                </p>
              )}
              <ModelCredit ids={["laptop", "city"]} className="mt-10" />
            </div>
          </GsapScene>
        </div>
      </div>
    </main>
  );
}
