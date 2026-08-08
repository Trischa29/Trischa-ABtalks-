import { useEffect, useRef } from "react";
import { useFinePointer } from "../hooks/useFinePointer";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = 'a, button, input, [role="button"], [data-cursor-hover]';

export default function CustomCursor() {
  const isFine = useFinePointer();
  const reducedMotion = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const pressed = useRef(false);

  useEffect(() => {
    if (!isFine) return;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (e) => {
      hovering.current = !!e.target.closest?.(INTERACTIVE_SELECTOR);
    };

    const onDown = () => {
      pressed.current = true;
    };
    const onUp = () => {
      pressed.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf;
    const tick = () => {
      const lerpFactor = reducedMotion ? 1 : 0.22;
      ring.current.x += (target.current.x - ring.current.x) * lerpFactor;
      ring.current.y += (target.current.y - ring.current.y) * lerpFactor;
      if (ringRef.current) {
        const scale = pressed.current ? 0.8 : hovering.current ? 1.7 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = hovering.current ? "0.5" : "1";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [isFine, reducedMotion]);

  if (!isFine) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] size-1.5 rounded-full bg-[var(--color-ink)]"
        style={{ transform: "translate(-100px, -100px)" }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] size-7 rounded-full border border-[var(--color-accent)] transition-[opacity] duration-150"
        style={{ transform: "translate(-100px, -100px)" }}
        aria-hidden
      />
    </>
  );
}
