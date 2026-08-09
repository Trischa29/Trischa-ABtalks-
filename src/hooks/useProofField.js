import { useCallback, useEffect, useRef, useState } from "react";

// Mocked async verification, triggered explicitly by a "Check ->" button
// (not on every keystroke) — types, then presses check, then watches it
// validate. Editing the value after a check invalidates the prior result.
//
// `initialValue`/`initialVerified` let a caller restore a previously
// persisted verification (see useStudentState's proofByDay) without
// replaying the check animation — the field just opens already valid.
export function useProofField({ pattern, invalidMessage, checkLabels, initialValue = "", initialVerified = false }) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState(initialVerified ? "valid" : "idle"); // idle | validating | valid | invalid
  const [checks, setChecks] = useState(
    initialVerified ? checkLabels.map((label) => ({ label, state: "done" })) : []
  );
  const skipNextReset = useRef(initialVerified);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    // The initial mount also runs this effect (value changed from
    // "nothing" to its initial value) — skip exactly that one run so a
    // restored "already verified" field doesn't immediately reset itself.
    if (skipNextReset.current) {
      skipNextReset.current = false;
      return clearTimers;
    }
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
