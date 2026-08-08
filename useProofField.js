import { useCallback, useEffect, useRef, useState } from "react";

// Mocked async verification, triggered explicitly by a "Check ->" button
// (not on every keystroke) — types, then presses check, then watches it
// validate. Editing the value after a check invalidates the prior result.
export function useProofField({ pattern, invalidMessage, checkLabels }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | validating | valid | invalid
  const [checks, setChecks] = useState([]);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    setChecks([]);
    setStatus("idle");
    return clearTimers;
  }, [value]);

  const check = useCallback(() => {
    if (!value.trim()) return;
    clearTimers();
    setChecks([]);
    setStatus("validating");

    if (!pattern.test(value.trim())) {
      timers.current.push(setTimeout(() => setStatus("invalid"), 550));
      return;
    }

    checkLabels.forEach((label, i) => {
      timers.current.push(
        setTimeout(() => {
          setChecks((prev) => [...prev.filter((c) => c.label !== label), { label, state: "checking" }]);
        }, 350 + i * 500)
      );
      timers.current.push(
        setTimeout(() => {
          setChecks((prev) => prev.map((c) => (c.label === label ? { ...c, state: "done" } : c)));
          if (i === checkLabels.length - 1) setStatus("valid");
        }, 700 + i * 500)
      );
    });
  }, [value, pattern, checkLabels]);

  return {
    value,
    setValue,
    status,
    checks,
    check,
    errorText: status === "invalid" ? invalidMessage : undefined,
    isValid: status === "valid",
  };
}
