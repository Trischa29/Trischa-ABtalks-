// Mocked product data. No backend — this is the single source of truth
// the UI reads from for the hackathon build.

export const TOTAL_DAYS = 60;

// Static identity only — track, streak, progress, etc. are real,
// persisted state (see useStudentState), not hardcoded here.
export const student = {
  name: "Trischa",
};

export const TRACK_OPTIONS = ["Web Development", "App Development", "AI / ML", "Data", "Other"];

export const dayDetail = {
  1: {
    day: 1,
    title: "Say hello to the world.",
    task: "Ship a single page that says who you are and what you're learning.",
    estimate: "45 min",
    difficulty: "Beginner",
    skills: ["HTML", "CSS"],
    description:
      "Day one isn't about being impressive — it's about showing up. Build a simple one-page site with your name, what you're learning, and why. This becomes the seed your portfolio grows from over the next 60 days.",
    brief:
      "Ship a minimal one-page site. Include your name, the track you picked, and one honest sentence on why you're doing this challenge. Keep it small enough to finish today — done beats perfect.",
    checklist: [
      {
        id: "name",
        label: "Your name",
        detail: "Say who you are — first line, no clever framing needed.",
      },
      {
        id: "learning",
        label: "What you're learning",
        detail: "One or two lines on the track you picked and what you want to get good at.",
      },
      {
        id: "why",
        label: "Why you're here",
        detail: "One honest sentence on why you're doing this challenge.",
      },
      {
        id: "ship",
        label: "Ship it",
        detail: "Push it live somewhere, even just GitHub Pages. A live link beats a local file.",
      },
    ],
  },
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

