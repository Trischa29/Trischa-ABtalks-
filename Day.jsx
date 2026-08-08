import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Gauge } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ProofInput from "../components/ProofInput";
import ProofWorkflow from "../components/ProofWorkflow";
import RequirementRow from "../components/RequirementRow";
import CompletionState from "../components/CompletionState";
import ModelCredit from "../components/ModelCredit";
import DroneScene from "../components/journey/DroneScene";
import GsapScene from "../components/journey/GsapScene";
import { GithubMark, LinkedinMark } from "../components/icons";
import { useProofField } from "../hooks/useProofField";
import { useStudentState } from "../hooks/useStudentState";
import { useScrollTrack } from "../hooks/useScrollTrack";
import { useLenis } from "../hooks/useLenis";
import { localProgress } from "../lib/scrollMath";
import { dayDetail, student, TOTAL_DAYS } from "../data/challenge";

const TRACK_HEIGHT_VH = 700;

const SCENES = {
  arrival: [0, 0.14],
  task: [0.13, 0.32],
  workflow: [0.31, 0.5],
  github: [0.49, 0.64],
  linkedin: [0.63, 0.76],
  status: [0.75, 0.86],
  complete: [0.85, 1],
};

function useLocalSceneProgress(subscribe, start, end) {
  const [t, setT] = useState(0);
  useEffect(() => subscribe((global) => setT(localProgress(global, start, end))), [subscribe, start, end]);
  return t;
}

export default function Day() {
  const { day: dayParam } = useParams();
  const day = Number(dayParam) || student.currentDay;
  const detail = dayDetail[day] ?? dayDetail[student.currentDay];
  const progress = useStudentState();

  const [completed, setCompleted] = useState(() => progress.isDayComplete(detail.day));
  // Distinguishes "just completed this visit" (show the full proof ->
  // completion transition) from "revisiting an already-done day" (show
  // only the completion state — empty proof inputs would be misleading).
  const wasAlreadyComplete = useRef(completed).current;
  const prevStats = useRef({ completedDays: progress.completedDays, streak: progress.streak });

  const [checkedItems, setCheckedItems] = useState(() => new Set());
  const toggleItem = (id) =>
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const [pulseKey, setPulseKey] = useState(0);
  const bumpPulse = () => setPulseKey((k) => k + 1);

  const github = useProofField({
    pattern: /github\.com\/[^\s/]+\/[^\s/]+/i,
    invalidMessage: "Enter a valid GitHub URL.",
    checkLabels: ["Repository found", "Commit found"],
  });

  const linkedin = useProofField({
    pattern: /linkedin\.com\/(posts|feed)\/[^\s]+/i,
    invalidMessage: "Enter a valid LinkedIn URL.",
    checkLabels: ["Post found"],
  });

  const prevGithubValid = useRef(false);
  useEffect(() => {
    if (github.isValid && !prevGithubValid.current) bumpPulse();
    prevGithubValid.current = github.isValid;
  }, [github.isValid]);

  const prevLinkedinValid = useRef(false);
  useEffect(() => {
    if (linkedin.isValid && !prevLinkedinValid.current) bumpPulse();
    prevLinkedinValid.current = linkedin.isValid;
  }, [linkedin.isValid]);

  const readyCount = (github.isValid ? 1 : 0) + (linkedin.isValid ? 1 : 0);
  const bothReady = readyCount === 2;
  const checkedCount = checkedItems.size;

  useLenis();
  const trackRef = useRef(null);
  const { progressRef, subscribe } = useScrollTrack(trackRef);
  const workflowT = useLocalSceneProgress(subscribe, ...SCENES.workflow);
  const energy = Math.min(1, Math.max(workflowT, readyCount * 0.35, completed ? 0.85 : 0));

  const handleComplete = () => {
    prevStats.current = { completedDays: progress.completedDays, streak: progress.streak };
    progress.completeDay(detail.day);
    setCompleted(true);
    bumpPulse();
  };

  return (
    <main className="relative bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <DroneScene
            progressRef={progressRef}
            className="absolute inset-0"
            fallbackClassName="absolute inset-0"
            energy={energy}
            pulseKey={pulseKey}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(260deg, rgba(7,7,12,0.55) 0%, rgba(7,7,12,0.05) 42%, rgba(7,7,12,0.05) 60%, rgba(7,7,12,0.68) 100%)",
            }}
          />

          <PageHeader backTo="/dashboard" backLabel="Dashboard" className="absolute top-0 inset-x-0 px-5 sm:px-8 pt-5 sm:pt-6 z-10" />

          {/* SCENE 1 — mission arrival */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.arrival[0]}
            end={SCENES.arrival[1]}
            className="items-start text-left justify-end pb-20 px-6 sm:px-10 lg:px-16"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
              Day {detail.day} / {TOTAL_DAYS} · Today's build
            </span>
            <h1 className="mt-3 font-display font-bold leading-[1.05] text-[clamp(1.9rem,6vw,2.6rem)] text-balance max-w-[16ch]">
              {detail.title}
            </h1>
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
          </GsapScene>

          {/* SCENE 2 — understand the task */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.task[0]}
            end={SCENES.task[1]}
            className="justify-center px-6 sm:px-10 lg:px-16"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              What you're building
            </span>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--color-ink-dim)] max-w-[42ch]">
              {detail.description}
            </p>
            <div className="mt-6 max-w-[440px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
                  Requirements
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">
                  {checkedCount} / {detail.checklist.length}
                </span>
              </div>
              {detail.checklist.map((item, i) => (
                <RequirementRow
                  key={item.id}
                  index={i + 1}
                  title={item.label}
                  checked={checkedItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                >
                  {item.detail}
                </RequirementRow>
              ))}
            </div>
          </GsapScene>

          {/* SCENE 3 — build in public workflow */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.workflow[0]}
            end={SCENES.workflow[1]}
            className="justify-center px-6 sm:px-10 lg:px-16"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
              Build in public
            </span>
            <h2 className="mt-2 font-display font-semibold text-[22px] leading-[1.2] text-balance max-w-[18ch]">
              The work has to leave the platform.
            </h2>
            <ProofWorkflow progress={workflowT} className="mt-8 max-w-[360px]" />
          </GsapScene>

          {/* SCENE 4 — GitHub proof */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.github[0]}
            end={SCENES.github[1]}
            className="justify-center px-6 sm:px-10 lg:px-16"
          >
            {wasAlreadyComplete ? (
              <p className="font-mono text-[13px] text-[var(--color-success)] max-w-[360px]">
                GitHub commit already verified for this day.
              </p>
            ) : (
              <div className="max-w-[420px]">
                <ProofInput
                  index={1}
                  icon={GithubMark}
                  label="GitHub"
                  prompt="Show us the code."
                  placeholder="github.com/username/repo"
                  value={github.value}
                  onChange={(e) => github.setValue(e.target.value)}
                  onCheck={github.check}
                  checkLabel="Check Proof"
                  validatingLabel="Validating..."
                  successText="GitHub commit detected"
                  status={github.status}
                  errorText={github.errorText}
                  checks={github.checks}
                />
              </div>
            )}
          </GsapScene>

          {/* SCENE 5 — LinkedIn proof */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.linkedin[0]}
            end={SCENES.linkedin[1]}
            className="justify-center px-6 sm:px-10 lg:px-16"
          >
            {wasAlreadyComplete ? (
              <p className="font-mono text-[13px] text-[var(--color-success)] max-w-[360px]">
                LinkedIn post already verified for this day.
              </p>
            ) : (
              <div className="max-w-[420px]">
                <ProofInput
                  index={2}
                  icon={LinkedinMark}
                  label="LinkedIn"
                  prompt="Tell the world what you made."
                  placeholder="linkedin.com/posts/..."
                  value={linkedin.value}
                  onChange={(e) => linkedin.setValue(e.target.value)}
                  onCheck={linkedin.check}
                  checkLabel="Check Proof"
                  validatingLabel="Verifying..."
                  successText="LinkedIn post found"
                  status={linkedin.status}
                  errorText={linkedin.errorText}
                  checks={linkedin.checks}
                />
              </div>
            )}
          </GsapScene>

          {/* SCENE 6 — proof status */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.status[0]}
            end={SCENES.status[1]}
            className="items-center text-center justify-center px-6"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]">
              Proof of work
            </span>
            <div className="mt-3 flex items-center gap-2">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={`size-2 rounded-full transition-colors duration-300 ${
                    i < (wasAlreadyComplete ? 2 : readyCount) ? "bg-[var(--color-success)]" : "bg-[var(--color-line-strong)]"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 font-display font-bold text-[clamp(2rem,6vw,2.8rem)] leading-none">
              {wasAlreadyComplete ? 2 : readyCount}{" "}
              <span className="text-[var(--color-ink-mute)] text-[0.5em] font-mono">/ 2 verified</span>
            </p>
          </GsapScene>

          {/* SCENE 7 — complete day (functional, not navigation) */}
          <GsapScene
            subscribe={subscribe}
            start={SCENES.complete[0]}
            end={SCENES.complete[1]}
            className="items-center text-center justify-center px-6"
          >
            {wasAlreadyComplete || completed ? (
              <div className="w-full max-w-[380px]">
                <CompletionState
                  day={detail.day}
                  total={TOTAL_DAYS}
                  completedCount={progress.completedDays}
                  previousCompletedCount={wasAlreadyComplete ? undefined : prevStats.current.completedDays}
                  streak={progress.streak}
                  previousStreak={wasAlreadyComplete ? undefined : prevStats.current.streak}
                />
              </div>
            ) : (
              <div className="">
                <Button
                  onClick={handleComplete}
                  disabled={!bothReady}
                  className={!bothReady ? "opacity-50" : ""}
                  variant={bothReady ? "primary" : "ghost"}
                  showArrow={bothReady}
                >
                  Complete Day {detail.day}
                </Button>
              </div>
            )}
            <ModelCredit ids={["drone"]} className="mt-10" />
          </GsapScene>
        </div>
      </div>
    </main>
  );
}
