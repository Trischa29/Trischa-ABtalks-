import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate } from "motion/react";

export default function CountUp({ value, from = 0, className }) {
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return (
    <span className={className} ref={ref}>
      {from}
    </span>
  );
}
