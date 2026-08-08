import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import ModelCredit from "../components/ModelCredit";
import SiteNav from "../components/SiteNav";
import CityScene from "../components/journey/CityScene";
import GsapScene from "../components/journey/GsapScene";
import { useScrollTrack } from "../hooks/useScrollTrack";
import { useLenis } from "../hooks/useLenis";
import { useStudentState } from "../hooks/useStudentState";
import { localProgress } from "../lib/scrollMath";
import { TOTAL_DAYS } from "../data/challenge";
import { Link } from "react-router-dom";

const TRACK_HEIGHT_VH = 850;

const SCENES = {
  hero: [0, 0.08],
  howItWorks: [0.1, 0.24],
  journey: [0.26, 0.42],
  dashboardIntro: [0.58, 0.82],
  cta: [0.88, 1],
};

const howItWorks = [
  { n: "01", label: "Pick a track", note: "Choose the coding track you actually want to get good at." },
  { n: "02", label: "Build", note: "Build something every day. Small enough to finish." },
  { n: "03", label: "Commit", note: "Submit your GitHub commit." },
  { n: "04", label: "Post", note: "Share your progress through LinkedIn." },
  { n: "05", label: "Compound", note: "Keep building and maintain your public learning streak." },
];

const journeyDays = [1, 7, 12, 14, 30, 45, 60];

function useLocalSceneProgress(subscribe, start, end) {
  const [t, setT] = useState(0);
  useEffect(() => subscribe((global) => setT(localProgress(global, start, end))), [subscribe, start, end]);
  return t;
}

export default function Landing() {
  useLenis();
  const trackRef = useRef(null);
  const { progressRef, subscribe } = useScrollTrack(trackRef);
  const progress = useStudentState();
  const todayComplete = progress.isDayComplete(progress.currentDay);

  const [headerDay, setHeaderDay] = useState(1);
  useEffect(
    () =>
      subscribe((global) => {
        const d = Math.min(TOTAL_DAYS, Math.max(1, Math.round(1 + global * (TOTAL_DAYS - 1))));
        setHeaderDay((prev) => (prev === d ? prev : d));
      }),
    [subscribe]
  );

  const journeyT = useLocalSceneProgress(subscribe, SCENES.journey[0], SCENES.journey[1]);
  const activeJourneyIndex = Math.min(journeyDays.length - 1, Math.floor(journeyT * journeyDays.length));

  return (
    <main className="relative bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <CityScene progressRef={progressRef} className="absolute inset-0" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,7,12,0.4) 0%, rgba(7,7,12,0.08) 26%, rgba(7,7,12,0.1) 66%, rgba(7,7,12,0.6) 100%)",
            }}
          />

          <header className="pointer-events-none absolute top-0 inset-x-0 flex items-start justify-between px-5 pt-5 z-10">
            <div className="flex items-center gap-4">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                AB<span className="text-[var(--color-accent)]">.</span>
              </span>
              <SiteNav className="pointer-events-auto" />
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                digital build system
              </p>
              <p className="font-mono text-[11px] text-[var(--color-accent)]">
                {String(headerDay).padStart(2, "0")} / {TOTAL_DAYS}
              </p>
            </div>
          </header>

          {/* SCENE 1 — hero */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.hero[0]}
            end={SCENES.hero[1]}
            className="justify-end pb-28 items-start text-left px-6"
          >
            <p className="font-display font-bold uppercase leading-none tracking-tight text-[clamp(1.6rem,7vw,2.4rem)] text-[var(--color-accent)]">
              ABTalks
            </p>
            <h1 className="mt-2 font-display font-bold uppercase leading-[0.9] tracking-tight text-[clamp(2.2rem,11vw,3.6rem)]">
              The 60-day
              <br />
              coding challenge.
            </h1>
            <h2 className="mt-2 font-display font-semibold uppercase leading-[1.05] tracking-tight text-[clamp(1.2rem,5.5vw,1.7rem)] text-[var(--color-ink-dim)]">
              Build every day.
              <br />
              Show your work.
            </h2>
            <p className="mt-4 max-w-[34ch] font-sans text-[14px] leading-relaxed text-[var(--color-ink-dim)]">
              ABTalks runs a 60-day coding challenge for Indian college students. Students pick a track,
              build something every day, and maintain a public learning streak by submitting a GitHub
              commit and a LinkedIn post.
            </p>
            <p className="mt-5 w-fit font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              01 → 60 · build / commit / post
            </p>
          </GsapScene>

          {/* SCENE 2 — how it works */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.howItWorks[0]}
            end={SCENES.howItWorks[1]}
            className="items-start text-left px-6 justify-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              How it works
            </p>
            <div className="mt-5 space-y-3.5 max-w-[340px]">
              {howItWorks.map((s) => (
                <div key={s.n} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-[var(--color-accent)] w-4 shrink-0">{s.n}</span>
                  <div>
                    <p className="font-display font-semibold text-[18px] leading-tight">{s.label}</p>
                    <p className="font-mono text-[11px] text-[var(--color-ink-dim)]">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </GsapScene>

          {/* SCENE 3 — 60-day journey (scroll-driven day checkpoints) */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.journey[0]}
            end={SCENES.journey[1]}
            className="items-center text-center justify-center px-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
              60 days, compressed into one skyline
            </p>
            <div className="relative mt-8 w-full max-w-[420px]">
              <div className="absolute left-0 right-0 top-[8px] h-px bg-[var(--color-line-strong)]" />
              <div
                className="absolute left-0 top-[8px] h-px bg-[var(--color-accent)]"
                style={{ width: `${(activeJourneyIndex / (journeyDays.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {journeyDays.map((d, i) => {
                  const active = i === activeJourneyIndex;
                  const past = i < activeJourneyIndex;
                  return (
                    <div key={d} className="flex flex-col items-center gap-2.5">
                      <span
                        className={`block size-3 rounded-full border ${
                          active
                            ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_0_5px_rgba(91,127,255,0.16)]"
                            : past
                              ? "bg-[var(--color-ink)] border-[var(--color-ink)]"
                              : "bg-transparent border-[var(--color-line-strong)]"
                        }`}
                      />
                      <span
                        className={`font-mono text-[10px] ${
                          active ? "text-[var(--color-accent)]" : past ? "text-[var(--color-ink-dim)]" : "text-[var(--color-ink-faint)]"
                        }`}
                      >
                        {String(d).padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </GsapScene>

          {/* SCENE 4 — dashboard introduction, laptop now in frame */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.dashboardIntro[0]}
            end={SCENES.dashboardIntro[1]}
            className="items-end text-right px-6 justify-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Every build. Every streak.
            </p>
            <h2 className="mt-3 font-display font-bold leading-[1.05] text-[clamp(1.6rem,5.5vw,2.2rem)] text-balance max-w-[16ch] ml-auto">
              One workspace to run the whole challenge.
            </h2>
            <p className="mt-3 max-w-[32ch] font-sans text-[14px] leading-relaxed text-[var(--color-ink-dim)] ml-auto">
              Your streak, today's build, and 60 days of proof — all tracked in one place.
            </p>
          </GsapScene>

          {/* SCENE 5 — closing CTA (the one route-changing button on this page) */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.cta[0]}
            end={SCENES.cta[1]}
            className="items-center text-center justify-center px-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]">
              Ready to build?
            </p>
            <h2 className="mt-3 font-display font-bold uppercase leading-[1] text-[clamp(1.8rem,8vw,2.5rem)] text-balance">
              60 days from now,
              <br />
              you're not the
              <br />
              same builder.
            </h2>
            <div className="mt-6 pointer-events-auto">
              <Button to="/dashboard">Start the challenge</Button>
            </div>
          </GsapScene>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-5">
        <footer className="py-12 border-t border-[var(--color-line)]">
          <div className="flex flex-col gap-9 sm:flex-row sm:justify-between">
            <div>
              <span className="font-display text-[15px] font-semibold tracking-tight">
                AB<span className="text-[var(--color-accent)]">.</span>
              </span>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                60-day coding challenge
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                Build every day. Build in public.
              </p>
            </div>

            <div className="flex gap-9 sm:gap-11">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                  Site
                </p>
                <SiteNav orientation="column" className="mt-2.5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                  Contact
                </p>
                <a
                  href="mailto:hello@abtalks.in"
                  className="mt-2.5 block font-mono text-[11px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
                >
                  hello@abtalks.in
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                  Social
                </p>
                <p className="mt-2.5 font-mono text-[11px] text-[var(--color-ink-dim)]">Instagram</p>
                <p className="mt-1.5 font-mono text-[11px] text-[var(--color-ink-dim)]">LinkedIn</p>
              </div>
            </div>
          </div>

          <div className="mt-9 pt-6 border-t border-[var(--color-line)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
                Today's proof
              </span>
              {todayComplete ? (
                <span className="font-mono text-[11px] text-[var(--color-success)]">GitHub ✓ · LinkedIn ✓</span>
              ) : (
                <Link
                  to={`/day/${progress.currentDay}`}
                  className="font-mono text-[11px] text-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors"
                >
                  Submit today →
                </Link>
              )}
            </div>
            <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">© ABTalks</span>
          </div>

          <ModelCredit ids={["city", "laptop"]} className="mt-6" />
        </footer>
      </div>
    </main>
  );
}
