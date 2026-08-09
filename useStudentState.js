import { useCallback, useEffect, useState } from "react";
import { TOTAL_DAYS } from "../data/challenge";

// Persisted (localStorage) mock student progress — no backend, but the
// state genuinely survives navigation/refresh, and completing a day
// really does update the dashboard. Module-level cache + listener list
// so every component using the hook stays in sync without a Context
// provider.
//
// Default state represents a brand-new student: no track picked, day
// one, zero streak, nothing completed. The "active, day 12, 12-day
// streak" dashboard is not a hardcoded starting point — it's what this
// same state looks like after a student has actually picked a track
// and completed days for real.
const STORAGE_KEY = "abtalks-state-v1";

function defaultState() {
  return {
    currentDay: 1,
    streak: 0,
    longestStreak: 0,
    completedDaySet: [],
    missedDays: [],
    track: null,
    checklistByDay: {},
    proofByDay: {},
  };
}

function loadInitial() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.completedDaySet)) {
        // Merge over defaults so state saved before a field existed
        // (track, checklistByDay, proofByDay) doesn't come back undefined.
        return { ...defaultState(), ...parsed };
      }
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

  const selectTrack = useCallback((track) => {
    persist({ ...cache, track });
  }, []);

  const toggleChecklistItem = useCallback((day, id) => {
    const current = cache.checklistByDay[day] ?? [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    persist({ ...cache, checklistByDay: { ...cache.checklistByDay, [day]: next } });
  }, []);

  const setProofVerified = useCallback((day, channel, verified, url) => {
    const dayProof = cache.proofByDay[day] ?? {};
    persist({
      ...cache,
      proofByDay: {
        ...cache.proofByDay,
        [day]: { ...dayProof, [channel]: { verified, url } },
      },
    });
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
    track: raw.track,
    isDayComplete: (day) => raw.completedDaySet.includes(day),
    getChecklist: (day) => raw.checklistByDay[day] ?? [],
    getProof: (day) => raw.proofByDay[day] ?? {},
    days,
    completeDay,
    selectTrack,
    toggleChecklistItem,
    setProofVerified,
    resetProgress,
  };
}
