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
import { student, dayDetail, achievements, buildHistory, TOTAL_DAYS } from "../data/challenge";

const STANDING_RANK = 24;
const TRACK_HEIGHT_VH = 720;

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

export default function Dashboard() {
  // ?state=missed|firstDay is a dev-only mock control for demoing the
  // alternate journey states — not part of the real product surface.
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  const view = stateParam === "missed" || stateParam === "firstDay" ? stateParam : "active";

  const progress = useStudentState();
  const greet = useMemo(greeting, []);
  const detail = dayDetail[progress.currentDay] ?? dayDetail[12];
  const remaining = TOTAL_DAYS - progress.currentDay;

  useLenis();
  const trackRef = useRef(null);
  const { progressRef, subscribe } = useScrollTrack(trackRef);

  const revealT = useLocalSceneProgress(subscribe, 0.12, 0.29);
  const revealed = Math.min(1, revealT / 0.7);

  const cta =
    view === "firstDay"
      ? { title: "Every builder starts somewhere.", label: "Start Day 1", href: "/day/12" }
      : view === "missed"
        ? { title: "The path behind you hasn't moved.", label: "Keep moving", href: `/day/${progress.currentDay}` }
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

          {/* SCENE 1 — arrival: laptop dominates, status appears subtly */}
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
              {view === "firstDay" ? (
                <h1 className="mt-2 font-display font-bold leading-[1.08] text-[clamp(1.7rem,5.5vw,2.4rem)] text-balance max-w-[18ch] ml-auto">
                  Your journey starts now.
                </h1>
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
          {view !== "firstDay" && (
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
          {view !== "firstDay" && (
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

          {/* SCENE 4 — today's build (or momentum recovery / first-day) */}
          <GsapScene subscribe={subscribe} start={0.46} end={0.63} className="justify-center px-6 sm:px-10 lg:px-16">
            <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
              {view === "active" ? (
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
                  <p className="mt-2 font-mono font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[36ch]">{detail.task}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge>
                      <Clock className="size-3" strokeWidth={2} />
                      {detail.estimate}
                    </Badge>
                    <Badge>
                      <Gauge className="size-3" strokeWidth={2} />
                      {detail.difficulty}
                    </Badge>
                    <Badge tone="accent">{student.track}</Badge>
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
              ) : (
                <>
                  <span className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                    Day {progress.currentDay}
                  </span>
                  <h2 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.6rem,4.5vw,2.1rem)] text-balance max-w-[20ch]">
                    {view === "missed" ? "Yesterday didn't go to plan." : "Every builder starts somewhere."}
                  </h2>
                  <p className="mt-2 font-mono font-medium text-[13px] text-[var(--color-ink-dim)] max-w-[36ch]">
                    {view === "missed"
                      ? "The path behind you hasn't moved. Pick it back up."
                      : "0 day streak — that's exactly where day one is supposed to start."}
                  </p>
                </>
              )}
            </div>
          </GsapScene>

          {/* SCENE 5 — achievements + standing */}
          {view !== "firstDay" && (
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
                    return (
                      <Achievement key={a.id} label={a.label} earned={earned} requirement={a.requirement} />
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between max-w-[420px] border-t border-[var(--color-line)] pt-4">
                  <span className="font-mono font-medium text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-dim)]">
                    Standing in {student.track}
                  </span>
                  <span className="font-display font-bold text-[20px] text-[var(--color-accent)]">
                    #{STANDING_RANK}
                  </span>
                </div>
              </div>
            </GsapScene>
          )}

          {/* SCENE 6 — build history: proof the loop actually repeats */}
          {view !== "firstDay" && (
            <GsapScene subscribe={subscribe} start={0.74} end={0.89} className="justify-center px-6 sm:px-10 lg:px-16">
              <div className="w-fit max-w-full rounded-2xl bg-[var(--color-bg-raised-2)]/90 backdrop-blur-md px-6 py-5 sm:px-7 sm:py-6">
                <p className="font-mono font-medium text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
                  Build history
                </p>
                <h3 className="mt-2 font-display font-semibold text-[20px] text-balance max-w-[24ch]">
                  You keep shipping.
                </h3>
                <div className="mt-5 max-w-[420px] divide-y divide-[var(--color-line)]">
                  {buildHistory.map((item) => (
                    <div key={item.day} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <span className="font-mono text-[10px] text-[var(--color-accent)]">
                          Day {String(item.day).padStart(2, "0")}
                        </span>
                        <p className="mt-0.5 font-display font-semibold text-[14px]">{item.title}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.06em]">
                        <span className={item.github ? "text-[var(--color-success)]" : "text-[var(--color-ink-mute)]"}>
                          GitHub {item.github ? "✓" : "—"}
                        </span>
                        <span className={item.linkedin ? "text-[var(--color-success)]" : "text-[var(--color-ink-mute)]"}>
                          LinkedIn {item.linkedin ? "✓" : "—"}
                        </span>
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
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Ready to build?
              </p>
              <h2 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.6rem,5vw,2.2rem)] text-balance max-w-[20ch]">
                {cta.title}
              </h2>
              <div className="mt-6">
                <Button to={cta.href}>{cta.label}</Button>
              </div>
              <ModelCredit ids={["laptop", "city"]} className="mt-10" />
            </div>
          </GsapScene>
        </div>
      </div>
    </main>
  );
}
