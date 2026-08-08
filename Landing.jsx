import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SectionReveal from "../components/SectionReveal";
import ModelCredit from "../components/ModelCredit";
import CityScene from "../components/journey/CityScene";
import ScrollBeat from "../components/journey/ScrollBeat";
import { GithubMark, LinkedinMark } from "../components/icons";
import { TOTAL_DAYS } from "../data/challenge";

const loop = [
  { n: "01", label: "Build", note: "Ship one focused piece of work." },
  { n: "02", label: "Commit", note: "Push it. It exists now." },
  { n: "03", label: "Post", note: "Put it where people can see it." },
  { n: "04", label: "Repeat", note: "Tomorrow, the loop closes again." },
];

const stages = [
  { n: "01", label: "Choose", note: "Pick the track you actually want to get good at." },
  { n: "02", label: "Build", note: "One focused task, every day. Small enough to finish." },
  { n: "03", label: "Prove", note: "Submit your GitHub work and your LinkedIn post." },
  { n: "04", label: "Compound", note: "60 days of public proof, not 60 private tutorials." },
];

const proofFlow = [
  { label: "Code", note: "Written today, not someday." },
  { label: "GitHub", note: "A real commit, timestamped." },
  { label: "Proof", note: "Verified against the brief." },
  { label: "LinkedIn", note: "Posted where it counts." },
  { label: "Visibility", note: "Seen by the people hiring." },
];

export default function Landing() {
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [displayDay, setDisplayDay] = useState(1);
  const [t, setT] = useState(0);
  const [warping, setWarping] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const d = Math.min(TOTAL_DAYS, Math.max(1, Math.round(1 + v * (TOTAL_DAYS - 1))));
    setDisplayDay((prev) => (prev === d ? prev : d));
    setT(v);
  });

  const enterJourney = (e) => {
    e.preventDefault();
    setWarping(true);
    setTimeout(() => navigate("/dashboard"), 420);
  };

  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Pinned cinematic journey — scroll drives the 3D camera + narrative beats */}
      <div ref={trackRef} className="relative" style={{ height: "660vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <CityScene scrollProgress={scrollYProgress} className="absolute inset-0" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,7,12,0.4) 0%, rgba(7,7,12,0.08) 26%, rgba(7,7,12,0.1) 66%, rgba(7,7,12,0.6) 100%)",
            }}
          />

          <header className="pointer-events-none absolute top-0 inset-x-0 flex items-start justify-between px-5 pt-5 z-10">
            <span className="font-display text-[15px] font-semibold tracking-tight">
              AB<span className="text-[var(--color-accent)]">.</span>
            </span>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
                digital build system
              </p>
              <p className="font-mono text-[11px] text-[var(--color-accent)]">
                {String(displayDay).padStart(2, "0")} / {TOTAL_DAYS}
              </p>
            </div>
          </header>

          {/* Beat 1 — hero: asymmetric, overlapping the intelligence core */}
          <ScrollBeat t={t} start={0} end={0.08} className="justify-end pb-28 items-start text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
              A 60-day build challenge
            </p>
            <h1 className="mt-3 font-display font-bold uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,13vw,4rem)]">
              60
              <br />
              days.
            </h1>
            <h2 className="mt-1 font-display font-semibold uppercase leading-[0.95] tracking-tight text-[clamp(1.5rem,7.5vw,2.4rem)] text-[var(--color-ink-dim)]">
              Build something
              <br />
              real.
            </h2>
            <p className="mt-4 max-w-[30ch] font-sans text-[14px] leading-relaxed text-[var(--color-ink-dim)]">
              Choose a track. Build something every day. Commit your work. Share it publicly.
            </p>
            <div className="mt-6 flex items-center gap-3 pointer-events-auto">
              <Button onClick={enterJourney} to="#">
                Enter the city
              </Button>
            </div>
            <p className="mt-5 w-fit font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              01 → 60 · build / commit / post
            </p>
          </ScrollBeat>

          {/* Beat 2 — the transformation itself */}
          <ScrollBeat t={t} start={0.115} end={0.15} className="items-center text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              60 days, compressed into one skyline
            </p>
          </ScrollBeat>

          {/* Beat 3 — reframe */}
          <ScrollBeat t={t} start={0.19} end={0.27} className="items-start text-left pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              Coding is easy to start
            </p>
            <h2 className="mt-3 font-display font-bold uppercase leading-[0.95] text-[clamp(2rem,9.5vw,2.9rem)] text-balance">
              Consistency
              <br />
              is hard.
            </h2>
            <p className="mt-4 max-w-[32ch] font-sans text-[14px] leading-relaxed text-[var(--color-ink-dim)]">
              ABTalks turns consistency into a visible system — not another course you never finish.
            </p>
          </ScrollBeat>

          {/* Beat 4 — the daily loop */}
          <ScrollBeat t={t} start={0.3} end={0.39} className="items-end text-right pr-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              How a day works
            </p>
            <div className="mt-4 space-y-3">
              {loop.map((s) => (
                <div key={s.n}>
                  <p className="font-display font-semibold text-[20px] leading-tight w-fit ml-auto">
                    <span className="font-mono text-[12px] text-[var(--color-accent)] mr-2">{s.n}</span>
                    {s.label}
                  </p>
                  <p className="font-mono text-[11px] text-[var(--color-ink-dim)]">{s.note}</p>
                </div>
              ))}
            </div>
          </ScrollBeat>

          {/* Beat 5 — Day 07 */}
          <ScrollBeat t={t} start={0.42} end={0.49} className="items-start text-left">
            <p className="font-mono text-[52px] leading-none text-[var(--color-ink-faint)]">07</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)] mt-1">
              Rhythm
            </p>
            <h3 className="mt-3 font-display font-semibold text-[26px] leading-[1.1] text-balance">
              One week in.
            </h3>
            <p className="mt-2 max-w-[28ch] font-mono text-[12px] text-[var(--color-ink-dim)]">
              The habit starts to form. It stops feeling like a decision.
            </p>
          </ScrollBeat>

          {/* Beat 6 — Day 14 */}
          <ScrollBeat t={t} start={0.52} end={0.6} className="items-end text-right pr-5">
            <p className="font-mono text-[52px] leading-none text-[var(--color-ink-faint)]">14</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)] mt-1">
              Momentum
            </p>
            <h3 className="mt-3 font-display font-semibold text-[26px] leading-[1.1] text-balance">
              Proof starts
              <br />
              compounding.
            </h3>
            <p className="mt-2 max-w-[28ch] font-mono text-[12px] text-[var(--color-ink-dim)]">
              14 days of public proof is worth more than a shelf of tutorials — it's evidence you can
              consistently build.
            </p>
          </ScrollBeat>

          {/* Beat 7 — Day 30 */}
          <ScrollBeat t={t} start={0.63} end={0.71} className="items-start text-left">
            <p className="font-mono text-[52px] leading-none text-[var(--color-ink-faint)]">30</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)] mt-1">
              Body of work
            </p>
            <h3 className="mt-3 font-display font-semibold text-[26px] leading-[1.1] text-balance">
              Halfway.
            </h3>
            <p className="mt-2 max-w-[28ch] font-mono text-[12px] text-[var(--color-ink-dim)]">
              Look back at day one. You wouldn't recognize that version of you.
            </p>
          </ScrollBeat>

          {/* Beat 7b — Day 45 */}
          <ScrollBeat t={t} start={0.755} end={0.815} className="items-end text-right pr-5">
            <p className="font-mono text-[52px] leading-none text-[var(--color-ink-faint)]">45</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)] mt-1">
              Compounding
            </p>
            <h3 className="mt-3 font-display font-semibold text-[26px] leading-[1.1] text-balance">
              It's not motivation
              <br />
              anymore.
            </h3>
            <p className="mt-2 max-w-[28ch] font-mono text-[12px] text-[var(--color-ink-dim)]">
              45 days in, showing up stops being a choice you make and starts being infrastructure.
            </p>
          </ScrollBeat>

          {/* Beat 8 — the product, plainly */}
          <ScrollBeat t={t} start={0.74} end={0.84} className="items-start text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              What ABTalks actually is
            </p>
            <div className="mt-4 space-y-2.5">
              {stages.map((s) => (
                <div key={s.n} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-[var(--color-accent)] w-4 shrink-0">{s.n}</span>
                  <div>
                    <span className="font-display font-semibold text-[17px]">{s.label} </span>
                    <span className="font-mono text-[11px] text-[var(--color-ink-dim)]">{s.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollBeat>

          {/* Beat 9 — Day 60 climax */}
          <ScrollBeat t={t} start={0.9} end={1} className="items-center text-center">
            <p className="font-mono text-[52px] leading-none text-[var(--color-accent)]">60</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)] mt-1">
              Finisher
            </p>
            <h2 className="mt-3 font-display font-bold uppercase leading-[1] text-[clamp(1.8rem,8.5vw,2.5rem)] text-balance">
              60 days later,
              <br />
              you're not the
              <br />
              same builder.
            </h2>
            <div className="mt-6 pointer-events-auto">
              <Button onClick={enterJourney} to="#">
                Enter the city
              </Button>
            </div>
          </ScrollBeat>

          {warping && (
            <div className="absolute inset-0 z-30 bg-[var(--color-bg)] animate-[fadeIn_0.4s_ease-in_forwards] opacity-0" />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[560px] px-5">
        {/* How you prove it */}
        <section className="py-16 border-t border-[var(--color-line)]">
          <SectionReveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
              Build in public
            </span>
            <h2 className="mt-3 font-display font-semibold text-[26px] leading-[1.15] text-balance">
              The work has to leave the platform.
            </h2>
          </SectionReveal>

          <div className="mt-8 relative pl-6 border-l border-[var(--color-line)]">
            {proofFlow.map((f, i) => (
              <SectionReveal key={f.label} className={`relative ${i !== proofFlow.length - 1 ? "pb-7" : ""}`}>
                <span className="absolute -left-[29px] top-1 size-2 rounded-full bg-[var(--color-accent)]" />
                <div className="flex items-center gap-2">
                  {f.label === "GitHub" && <GithubMark className="size-3.5 text-[var(--color-ink-dim)]" />}
                  {f.label === "LinkedIn" && (
                    <LinkedinMark className="size-3.5 text-[var(--color-ink-dim)]" />
                  )}
                  <p className="font-display font-semibold text-[16px]">{f.label}</p>
                </div>
                <p className="mt-1 font-mono text-[12px] text-[var(--color-ink-dim)]">{f.note}</p>
              </SectionReveal>
            ))}
          </div>
        </section>

        <footer className="py-10 border-t border-[var(--color-line)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">ABTalks © 2026</span>
            <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">Build. Prove. Grow.</span>
          </div>
          <ModelCredit ids={["city"]} className="mt-3" />
        </footer>
      </div>
    </main>
  );
}
