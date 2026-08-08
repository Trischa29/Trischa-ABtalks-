// Mocked product data. No backend — this is the single source of truth
// the UI reads from for the hackathon build.

export const TOTAL_DAYS = 60;

export const student = {
  name: "Trischa",
  track: "Web Development",
  currentDay: 12,
  completedDays: 11,
  streak: 11,
  longestStreak: 17,
};

// One entry per day 1..60. status: "complete" | "current" | "upcoming" | "missed"
export const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
  const day = i + 1;
  let status = "upcoming";
  if (day < 12) status = day === 6 ? "missed" : "complete";
  if (day === 12) status = "current";
  return { day, status };
});

export const dayDetail = {
  12: {
    day: 12,
    title: "Build something worth showing.",
    task: "Ship a personal portfolio landing page.",
    estimate: "2–3 hrs",
    difficulty: "Intermediate",
    skills: ["React", "CSS Layout", "Responsive Design"],
    description:
      "Today you're building the front door to your work — a single-page portfolio that a recruiter could land on and immediately understand what you build and how you think.",
    brief:
      "Design and ship a one-page portfolio site. It should introduce who you are, show 2–3 projects with real context (not just links), and give a clear way to get in touch. Optimize for a stranger scrolling on their phone in under 30 seconds.",
    checklist: [
      {
        id: "hero",
        label: "Hero",
        detail:
          "Your first impression. Include your name, a short introduction, a clear visual identity, and a primary CTA.",
      },
      {
        id: "projects",
        label: "Projects",
        detail: "Show 2–3 meaningful projects, each with a short 'why it matters' — not just a link.",
      },
      {
        id: "about",
        label: "About",
        detail: "Explain your interests and what you're learning. A few sentences — no generic bios.",
      },
      {
        id: "contact",
        label: "Contact",
        detail: "Give visitors a clear way to reach you — one channel is enough.",
      },
    ],
  },
};

// `atLeast` compares against completedDays; `streakAtLeast` compares
// against the current streak — achievements unlock for real as the
// (persisted) mock student progresses, not from a static flag.
export const achievements = [
  { id: "first-commit", label: "First Commit", atLeast: 1, requirement: "Submit your first GitHub proof." },
  { id: "seven-day", label: "7 Day Streak", streakAtLeast: 7, requirement: "Complete 7 days in a row." },
  { id: "build-public", label: "Built in Public", atLeast: 5, requirement: "Submit 5 LinkedIn posts." },
  { id: "fourteen-day", label: "14 Day Streak", streakAtLeast: 14, requirement: "Complete 14 days in a row." },
  { id: "thirty-day", label: "30 Day Streak", streakAtLeast: 30, requirement: "Complete 30 days in a row. Halfway point." },
  { id: "finisher", label: "60 Day Finisher", atLeast: 60, requirement: "Complete all 60 days." },
];

// Alternate dashboard states for demoing the momentum-recovery + first-day UX.
export const states = {
  active: { kind: "active" },
  missed: { kind: "missed", missedDay: 11 },
  firstDay: { kind: "firstDay" },
  emptyProfile: { kind: "emptyProfile" },
};
