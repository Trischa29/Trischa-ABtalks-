import { useEffect, useRef, useState } from "react";

// Mocked async verification: debounce typing, "check" the URL shape,
// then reveal a couple of checklist lines before settling on valid/invalid.
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

    if (!value.trim()) {
      setStatus("idle");
      return;
    }

    setStatus("validating");

    const debounce = setTimeout(() => {
      if (!pattern.test(value.trim())) {
        setStatus("invalid");
        return;
      }

      checkLabels.forEach((label, i) => {
        timers.current.push(
          setTimeout(() => {
            setChecks((prev) => [...prev.filter((c) => c.label !== label), { label, state: "checking" }]);
          }, 300 + i * 500)
        );
        timers.current.push(
          setTimeout(() => {
            setChecks((prev) => prev.map((c) => (c.label === label ? { ...c, state: "done" } : c)));
            if (i === checkLabels.length - 1) setStatus("valid");
          }, 650 + i * 500)
        );
      });
    }, 500);

    timers.current.push(debounce);
    return clearTimers;
  }, [value]);

  return {
    value,
    setValue,
    status,
    checks,
    errorText: status === "invalid" ? invalidMessage : undefined,
    isValid: status === "valid",
  };
}
