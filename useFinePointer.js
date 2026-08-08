import { useEffect, useState } from "react";

// True only for devices with a real hover-capable, precise pointer
// (desktop mouse/trackpad) — the custom cursor is a desktop enhancement.
export function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}
