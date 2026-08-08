// Shared motion tokens — keep every animation in the app pulling from here
// so the product feels like one physical system, not scattered one-offs.

export const springSnappy = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };
export const springSoft = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 };
export const springLazy = { type: "spring", stiffness: 140, damping: 22, mass: 1 };

export const easeOutExpo = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: easeOutExpo } },
};

export function stagger(delayChildren = 0.05, staggerChildren = 0.06) {
  return {
    hidden: {},
    show: {
      transition: { delayChildren, staggerChildren },
    },
  };
}
