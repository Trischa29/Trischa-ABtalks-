import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ProofInput from "../components/ProofInput";
import CompletionState from "../components/CompletionState";
import ExpandableRow from "../components/ExpandableRow";
import ModelCredit from "../components/ModelCredit";
import DroneScene from "../components/journey/DroneScene";
import { GithubMark, LinkedinMark } from "../components/icons";
import { useProofField } from "../hooks/useProofField";
import { useStudentState } from "../hooks/useStudentState";
import { dayDetail, student, TOTAL_DAYS } from "../data/challenge";

export default function Day() {
  const { day: dayParam } = useParams();
  const day = Number(dayParam) || student.currentDay;
  const detail = dayDetail[day] ?? dayDetail[student.currentDay];
  const progress = useStudentState();
  const [completed, setCompleted] = useState(() => progress.isDayComplete(detail.day));
  // Distinguishes "just completed this visit" (show the full proof →
  // completion transition) from "revisiting an already-done day" (show
  // only the completion state — empty proof inputs would be misleading).
  const wasAlreadyComplete = useRef(completed).current;

  const github = useProofField({
    pattern: /github\.com\/[^\s/]+\/[^\s/]+/i,
    invalidMessage: "That doesn't look like a repository URL.",
    checkLabels: ["Repository found", "Commit found"],
  });

  const linkedin = useProofField({
    pattern: /linkedin\.com\/(posts|feed)\/[^\s]+/i,
    invalidMessage: "That doesn't look like a LinkedIn post URL.",
    checkLabels: ["Post found"],
  });

  const readyCount = (github.isValid ? 1 : 0) + (linkedin.isValid ? 1 : 0);
  const bothReady = readyCount === 2;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div className="mx-auto max-w-[480px] pb-20">
        <div className="px-5">
          <PageHeader backTo="/dashboard" backLabel="Dashboard" />
        </div>

        <DroneScene className="h-[200px] w-full" fallbackClassName="h-[60px]" />

        <div className="px-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
            Day {detail.day} / {TOTAL_DAYS}
          </span>

          <h1 className="mt-3 font-display text-[28px] leading-[1.15] text-balance">{detail.title}</h1>
        <p className="mt-2 font-mono text-[13px] text-[var(--color-ink-dim)]">{detail.task}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{detail.estimate}</Badge>
          <Badge>{detail.difficulty}</Badge>
          {detail.skills.map((s) => (
            <Badge key={s} tone="accent">
              {s}
            </Badge>
          ))}
        </div>

        <section className="mt-9 border-t border-[var(--color-line)] pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            The brief
          </span>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--color-ink-dim)]">
            {detail.brief}
          </p>
        </section>

        <section className="mt-9 border-t border-[var(--color-line)] pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            What you'll make
          </span>
          <div className="mt-2">
            {detail.checklist.map((item, i) => (
              <ExpandableRow
                key={item.id}
                icon={
                  <span className="font-mono text-[12px] text-[var(--color-accent)] w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                }
                title={item.label}
              >
                {item.detail}
              </ExpandableRow>
            ))}
          </div>
        </section>

        <section className="mt-9 border-t border-[var(--color-line)] pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
            Prove the work
          </span>

          {!wasAlreadyComplete && (
            <div className="mt-4 space-y-3">
              <ProofInput
                index={1}
                icon={GithubMark}
                label="GitHub"
                prompt="Show us the code."
                placeholder="github.com/username/repo"
                value={github.value}
                onChange={(e) => !completed && github.setValue(e.target.value)}
                status={github.status}
                errorText={github.errorText}
                checks={github.checks}
              />
              <ProofInput
                index={2}
                icon={LinkedinMark}
                label="LinkedIn"
                prompt="Tell the world what you made."
                placeholder="linkedin.com/posts/..."
                value={linkedin.value}
                onChange={(e) => !completed && linkedin.setValue(e.target.value)}
                status={linkedin.status}
                errorText={linkedin.errorText}
                checks={linkedin.checks}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {wasAlreadyComplete ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <CompletionState day={detail.day} total={TOTAL_DAYS} completedCount={progress.completedDays} />
              </motion.div>
            ) : !completed ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className={`size-1.5 rounded-full transition-colors duration-300 ${
                        i < readyCount ? "bg-[var(--color-success)]" : "bg-[var(--color-line-strong)]"
                      }`}
                    />
                  ))}
                  <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">
                    {readyCount} / 2 proofs ready
                  </span>
                </div>
                <Button
                  onClick={() => {
                    progress.completeDay(detail.day);
                    setCompleted(true);
                  }}
                  disabled={!bothReady}
                  className={`w-full ${!bothReady ? "opacity-50" : ""}`}
                  variant={bothReady ? "primary" : "ghost"}
                  showArrow={bothReady}
                >
                  Complete Day {detail.day}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <CompletionState day={detail.day} total={TOTAL_DAYS} completedCount={progress.completedDays} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <ModelCredit ids={["drone"]} className="mt-9 border-t border-[var(--color-line)] pt-6" />
        </div>
      </div>
    </main>
  );
}
