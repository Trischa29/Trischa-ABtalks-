import { useCallback, useEffect, useState } from "react";
import { student, TOTAL_DAYS } from "../data/challenge";

// Persisted (localStorage) mock student progress — no backend, but the
// state genuinely survives navigation/refresh, and completing a day
// really does update the dashboard. Module-level cache + listener list
// so every component using the hook stays in sync without a Context
// provider.
const STORAGE_KEY = "abtalks-state-v1";
const MISSED_DAYS = [6];

function defaultState() {
  const completedDaySet = Array.from({ length: student.completedDays }, (_, i) => i + 1).filter(
    (d) => !MISSED_DAYS.includes(d)
  );
  return {
    currentDay: student.currentDay,
    streak: student.streak,
    longestStreak: student.longestStreak,
    completedDaySet,
    missedDays: MISSED_DAYS,
  };
}

function loadInitial() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.completedDaySet)) return parsed;
    }
  } catch {
    // corrupt/blocked storage — fall through to defaults
  }
  return defaultState();
}

let cache = loadInitial();
let listeners = [];

function persist(next) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode etc.) — state still works for this session
  }
  listeners.forEach((fn) => fn(next));
}

export function useStudentState() {
  const [raw, setRaw] = useState(cache);

  useEffect(() => {
    listeners.push(setRaw);
    return () => {
      listeners = listeners.filter((fn) => fn !== setRaw);
    };
  }, []);

  const completeDay = useCallback((day) => {
    if (cache.completedDaySet.includes(day)) return;
    const completedDaySet = [...cache.completedDaySet, day];
    const streak = cache.streak + 1;
    const longestStreak = Math.max(cache.longestStreak, streak);
    const currentDay = day === cache.currentDay ? Math.min(TOTAL_DAYS, day + 1) : cache.currentDay;
    persist({ ...cache, completedDaySet, streak, longestStreak, currentDay });
  }, []);

  const resetProgress = useCallback(() => persist(defaultState()), []);

  const completedDays = raw.completedDaySet.length;

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1;
    let status = "upcoming";
    if (raw.completedDaySet.includes(day)) status = "complete";
    else if (raw.missedDays.includes(day)) status = "missed";
    if (day === raw.currentDay) status = "current";
    return { day, status };
  });

  return {
    currentDay: raw.currentDay,
    streak: raw.streak,
    longestStreak: raw.longestStreak,
    completedDays,
    isDayComplete: (day) => raw.completedDaySet.includes(day),
    days,
    completeDay,
    resetProgress,
  };
}
