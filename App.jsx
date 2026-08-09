import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Day from "./pages/Day";

// Client-side navigation leaves the previous route's scrollY in place by
// default. For pinned/scroll-scrubbed pages that's fatal — the new
// route's ScrollTrigger computes its initial progress against whatever
// scrollY is already on the page, which can start it mid-story (or at
// the very end) instead of at 0. Force top-of-page on every route
// change, and take the browser out of the scroll-restoration business
// entirely so back/forward navigation can't reintroduce the same bug.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Dev-only utility, not part of the real product surface: visiting any
// route with ?reset=true clears the persisted mock student state and
// reloads on the clean URL. Not exposed as a button anywhere — this is
// for demoing the brand-new-student state without a real logout flow.
function DevReset() {
  const location = useLocation();
  useLayoutEffect(() => {
    if (new URLSearchParams(location.search).get("reset") === "true") {
      try {
        window.localStorage.removeItem("abtalks-state-v1");
      } catch {
        // storage unavailable — nothing to clear
      }
      window.location.href = location.pathname;
    }
  }, [location]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <DevReset />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/day/:day" element={<Day />} />
      </Routes>
    </>
  );
}
