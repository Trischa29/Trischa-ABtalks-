# AI Usage Log

This file documents the significant AI prompts used while building ABTalks during this hackathon.

## Initial brief

The following brief was given to Claude at the start of the build. It set the product context, design direction, required routes, and build process for the whole project.

> You are the lead product designer, UX designer, creative director, and frontend engineer for this hackathon project.
>
> We are redesigning ABTalks, a 60-day coding challenge for Indian college students.
>
> This is primarily a PRODUCT DESIGN + FRONTEND EXPERIENCE challenge, not a backend challenge. The judges will automatically open and screenshot exactly these routes at a 390px mobile viewport: `/`, `/dashboard`, `/day/12`. The goal is to make these three experiences feel so polished, intentional, intuitive, and visually distinctive that they could plausibly be a real premium technology product.
>
> Avoid the generic AI-generated aesthetic (gradient-background-plus-floating-cards, glassmorphism, template-y sections, random animation). Aim for a highly art-directed, futuristic, editorial, student-focused developer product, inspired by the craft level of Studio Namma (studionamma.com) — referenced for quality and design thinking only, not for copying layout or identity.
>
> Product: ABTalks runs a 60-day coding challenge. Students pick a track, build daily, prove work via a GitHub commit and a LinkedIn post, and maintain a public streak. Philosophy: BUILD → PROVE → GROW. Mobile-first at 390px is the primary design requirement; desktop is a secondary enhancement.
>
> Required routes: `/` (landing/narrative), `/dashboard` (today's task, streak, 60-day journey, achievements), `/day/12` (mission brief, checklist, guided proof-of-work flow with mocked GitHub/LinkedIn validation, and a satisfying completion experience). No auth, no real APIs — mocked data only.
>
> Also specified in detail: a full visual system (near-black + warm off-white + one electric accent, Space Grotesk/Inter/mono type), a "momentum recovery" feature for missed days (empathetic, not punishing), a first-day state, an empty-profile state, a reusable component library (Button, Badge, Progress, ChallengeTimeline, StreakDisplay, Achievement, TaskCard, ProofInput, CompletionState, PageHeader, SectionReveal), motion built with Motion/Framer Motion used purposefully (not decoratively), accessibility basics, and a staged build process (design tokens → landing → dashboard → day → alternate states → polish), testing at 390px after each stage.

## Build notes (round 1 — editorial 2D design)

- Environment had no Node.js/npm or Homebrew preinstalled; Node was downloaded directly from nodejs.org and wired into the shell profile before scaffolding the Vite + React + Tailwind v4 + React Router + Motion + lucide-react project.
- The installed `lucide-react` version does not ship brand/logo icons (no `Github`/`Linkedin` exports), so small custom inline SVG marks (`src/components/icons.jsx`) were built instead — which also fit the brief's instruction to keep the visual identity original rather than leaning on a generic icon library.
- Chose an "ignition orange" (`#ff5a2e`) as the single electric accent against a near-black/warm-off-white foundation, specifically to avoid the common purple-AI-gradient look.
- The 60-day progress visualization was deliberately built as a dot/square grid with distinct states (complete / current-pulsing / missed / upcoming) rather than a percentage bar, per the brief's instruction to make progress visually distinctive.
- The proof-of-work flow (`useProofField` hook + `ProofInput` component) simulates async verification with debounced input, staged "checking → found" messages, and idle/validating/valid/invalid states, entirely mocked client-side.

## Round 2 brief — full 3D / scroll-driven rebuild

After the first pass shipped, the following brief asked for a ground-up rebuild: genuine 3D via React Three Fiber, a single "journey" concept (a 3D path with 60 nodes) reused across all three routes, real scroll-driven camera choreography on the landing page (not just fade-in sections), mobile-optimized 3D with a WebGL fallback and `prefers-reduced-motion` support, and instructions to keep meaningful git commits throughout rather than one final commit. It explicitly ruled out generic dashboard/card layouts, decorative-only 3D, and GSAP unless truly necessary (Motion + R3F preferred).

Key decisions made in response:
- Modeled the "journey" as one `THREE.CatmullRomCurve3` (`src/three/journeyGeometry.js`) that every route reads positions from, so the visual system is genuinely one shared thing, not three separate builds.
- Landing's cinematic camera dolly is driven by Motion's `useScroll`, read inside an R3F `useFrame` loop — no GSAP needed.
- Hit a real Motion bug: multiple `useTransform` hooks derived from one shared scroll-linked `MotionValue`, rendered via `style`, triggered Motion's WAAPI-acceleration path and produced silently swapped/incorrect opacity values between unrelated elements (reproducible, not an environment artifact — confirmed via direct DOM inspection of computed styles). Fixed by driving the scroll-linked text "beats" from plain React state instead of bound MotionValues (`ScrollBeat.jsx`), sidestepping the WAAPI path entirely.
- WebGL-unavailable fallback reuses the flat dot-grid `ChallengeTimeline` component built in round 1, so there's no dead code and no degraded-looking fallback.

## Round 3 brief — non-negotiable requirements + color pivot

A follow-up brief tightened the requirements while the 3D rebuild was in progress: explicitly forbade an orange-dominant palette in favor of near-black + electric blue/violet, required that the dashboard's streak/task/progress/achievements stay legible (not hidden behind purely abstract 3D), required the Active/Missed/Day-1 preview controls to be dev-only rather than visible tabs, and reiterated the git-commit and PROMPTS.md requirements.

- Repainted the whole design-token system and every hardcoded three.js color from orange to a black/blue/violet system in one pass (`src/index.css`, `JourneyNodes.jsx`, `JourneyGlow.jsx`, `JourneyPath.jsx`).
- Interpreted the brief's four hero-concept options (robotic face / floating city / abstract structure / dimensional portal) by treating the existing journey-path scene itself as the "dimensional portal containing the 60-day journey" — avoided building a second, unrelated 3D centerpiece under time pressure, and said so explicitly rather than silently dropping the requirement.
- Deprioritized the brief's custom-cursor/hover-word-interaction system (desktop-only) since the brief itself states mobile at 390px is primary and desktop is secondary — flagged this tradeoff instead of quietly skipping it.
- Moved the dashboard's Active/Missed/Day-1 state switcher from a visible pill row to a `?state=` query param, per "these are testing states and should only exist through development/mock controls."
- Code-split the R3F/three.js bundle behind `React.lazy` (`LazyJourneyScene.jsx`) after a production build flagged a 1.3MB main chunk — brought the critical/text-rendering bundle down to ~404KB (129KB gzipped), with the ~900KB 3D chunk loading async.

## Round 4 brief — art direction escalation, then a further push against scoping down

Two follow-up briefs landed close together. The first said the result still read as "a normal website with 3D behind it" — weak typography, thin layout, not enough real product information, 3D not integrated deeply, no meaningful interactions — and asked for a substantial redesign of typography/layout/information architecture/interactions, while explicitly ruling out a literal modeled robotic head, a separate city scene, a separate network scene, and per-word cursor animations as too high-risk to attempt well in the time available. The second brief pushed back hard on treating that as permission to build something "safe" — it wanted one extraordinary interactive system, not ten average effects, and restated the robot/transformation/cursor asks in more detail while also saying explicitly that faking the transformation with particles, instancing, opacity, and camera movement (rather than a true geometry morph) was fine.

Response: the second brief's own permitted techniques (particles, instancing, position interpolation, camera movement) matched what was already being proposed, so no further scope negotiation was needed — the plan was to build it well rather than re-argue the point.

- Typography replaced end to end: Sora (display, bold/geometric) + Inter (body) + JetBrains Mono (technical), with real scale hierarchy and `clamp()` sizing so headlines don't overflow at 390px.
- Built an "intelligence core" as the landing's opening 3D state instead of a literal robot head: a Fibonacci-sphere lattice of the 60 day-nodes with synaptic connection lines (`journeyGeometry.js` cluster generator, `IntelligenceLinks.jsx`), pointer-reactive via camera parallax (reusing the compact-mode pattern) rather than rotating the object — sidesteps a coordinate-space sync problem between rotating nodes and rotating links. It "unspools" into the journey path as the user scrolls the first ~16% of the pinned track, driven by a per-frame position lerp in `JourneyNodes.jsx`, not a React state update — keeps it smooth without re-rendering.
- Hit and fixed a real overflow bug: Sora's wider glyphs clipped "SOMETHING." off the 390px viewport at the font size that worked fine with the old typeface — fixed with `clamp()`-based sizing as part of the same pass rather than patched in isolation.
- Landing rebuilt with asymmetric, alternating left/right-aligned scroll beats that overlap the 3D layer directly, plus the specific product information the brief said was missing: the BUILD/COMMIT/POST/REPEAT daily loop, the CHOOSE/BUILD/PROVE/COMPOUND four-stage explanation, and real per-milestone storytelling copy (not one-liners) for days 7/14/30/60.
- Dashboard redesigned around spatial labels (COMPLETED/REMAINING/YOU ARE HERE) floating over the 3D canvas instead of a separate stat block, and achievements became a tap-to-expand list revealing the actual unlock requirement, per the brief's "clicking one reveals how to unlock it."
- Day 12's task breakdown became a tap-to-expand accordion, and completion now fires a `JourneyWave` — a bright pulse that travels along the path to the current node — reusing the same shared journey system rather than a completion-specific scene.
- Added a custom desktop cursor (dot + lagging ring, rAF-driven, expands on interactive hover) gated behind `(hover: hover) and (pointer: fine)` so it never mounts on touch devices — the brief's cursor system was the one item scoped down further (no per-word contextual mini-animations), since those are high build cost for a desktop-only, secondary surface.

## Round 5 brief — "THE CURRENT CITY IS NOT A CITY"

A follow-up brief rejected the procedural instanced-building skyline outright, in forceful terms: *"If I screenshot the scene and hide all UI: I SHOULD STILL IMMEDIATELY KNOW THAT IT IS A FUTURISTIC CITY."* It asked for a genuinely architectural city (solid volumes, floors, facades, windows, roads, landmarks, cinematic camera) rather than lines/circles/nodes standing in for one. A second brief ("FINAL DIRECTION — SIMPLIFY THE VISUAL CONCEPT") then asked to drop the robotic-head/neural-sphere/node-network concept entirely and make the city the sole 3D hero across the product, using real GLTF/GLB assets "where appropriate." When asked directly whether an existing built website's 3D model could be reused, the answer given was no — that would mean using another site's proprietary, unlicensed asset (different from a CC0/CC-BY library), and the response instead was to source or design the assets properly.

- Retired the entire procedural "journey" system (`JourneyScene`, `JourneyNodes`, `JourneyPath`, `JourneyGlow`, `JourneyCamera`, `JourneyWave`, `CityBuildings`, `journeyGeometry.js`, `buildingTexture.js`) rather than layering a fourth concept on top of it.

## Round 6 brief — "FUNCTIONALITY IS NON-NEGOTIABLE" + real 3D assets

The final brief restated the product spec end to end (three real routes navigable by URL, dashboard/day-12 functional requirements, edge states, localStorage persistence) and closed with the explicit priority rule: *"If you have to choose between A COOL ANIMATION and A REQUIRED ABTALKS FUNCTION, CHOOSE THE FUNCTION."* Alongside it, three real Sketchfab GLTF exports were provided as local zip files: a sci-fi drone, a cyberpunk laptop, and a cyberpunk city — with a page-to-model assignment (landing → city, dashboard → laptop with the city rendered live on its screen, Day 12 → drone with a subtle idle animation, explicitly not "endlessly spin").

- Checked each model's `license.txt` before use: city (mortalityrexotable) and laptop (Berk Gedik) are CC-BY-4.0, the drone (Elinor Quittner) is CC-BY-NC-SA-4.0 — all three require attribution, which is now surfaced in-app via a `ModelCredit` component on the page that uses each asset, using the exact required credit text/links from each license file rather than paraphrasing them.
- Optimized all three with `gltf-transform` (Draco geometry compression, texture downscale + WebP, mesh simplification) before committing them — raw exports were 20–160MB each; the city alone was reduced to ~11.5MB and the laptop/drone to under 1MB each, while preserving named materials (needed to target the laptop's "Screen" mesh later).
- Built `useStudentState`, a localStorage-backed hook (module-level cache + pub/sub, not React Context) as the one non-negotiable piece of real state: current day, streak, longest streak, and completed days all persist across navigation and refresh, and `completeDay` is idempotent.
- The laptop's live-rendered city screen was the hardest technical problem this round: two attempts at a manual `useFBO` + `gl.render()` render-to-texture pipeline produced a black screen for reasons isolated (via a red-cube diagnostic) to the manual render path itself, not the model. Switched to drei's `<RenderTexture>` component instead, which required extracting the screen mesh's transform relative to the GLTF root via `THREE.Matrix4` decomposition and mounting it as an explicit sibling `<mesh>` (RenderTexture needs a real JSX material target, not one buried inside `<primitive object={scene}>`) — this worked on the first try after the approach change.
- Drone idle animation is a small sinusoidal hover + slow yaw + subtle roll driven in `useFrame`, deliberately not a continuous spin, per the brief.
- Final pass: deleted every file left unreferenced once Landing/Dashboard/Day all switched to City/Laptop/Drone scenes (11 files), verified with `npm run build` after each change, and re-tested all three routes plus the `?state=firstDay` / `?state=missed` dashboard edge states at a 390px viewport — no overflow, no console errors, all three models rendering correctly.
