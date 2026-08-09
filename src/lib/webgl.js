// THREE.WebGLRenderer.dispose() (what R3F calls when a Canvas unmounts)
// releases its own internal state but does NOT tell the browser/GPU to
// actually reclaim the underlying context — that's left to garbage
// collection, on the browser's own schedule. When the next route's
// Canvas requests a new context immediately afterward (a normal SPA
// nav), it can race that GC and get handed a context that's
// immediately lost. Forcing it via the WEBGL_lose_context extension on
// unmount makes the handoff deterministic instead of racy.
export function loseContextOnUnmount(state) {
  return () => {
    state.gl.getContext().getExtension("WEBGL_lose_context")?.loseContext();
  };
}

// A Canvas mounting shortly after a previous route's Canvas unmounted
// can hit a transient WebGL context loss during setup (GPU/driver
// still reclaiming the old context's resources). Three.js's renderer
// restores itself automatically, but the canvas is left at its
// pre-restore size — nothing re-triggers R3F's own resize logic,
// since the container's actual DOM size never changed. Re-measure and
// resize explicitly once the context comes back.
export function resyncSizeOnContextRestore(state) {
  const canvas = state.gl.domElement;
  const container = canvas.parentElement;

  // Unconditional — after a context hiccup, R3F's own `state.size` can
  // already report the right CSS size while the underlying `gl.setSize()`
  // call that was supposed to accompany it silently no-opped against
  // the lost context, so comparing against `state.size` to decide
  // whether a resize is needed isn't reliable here.
  const resync = () => {
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    if (width > 0 && height > 0) state.setSize(width, height);
  };

  // Three independent triggers, since no single one is reliable on its
  // own: immediately (covers the common case), on a later
  // webglcontextrestored event (covers a context that was actively
  // lost-then-recovered), and on a couple of short delays regardless of
  // whether any context event ever fired (covers the container simply
  // not having its final layout size yet at the moment onCreated ran —
  // there's no event for "the container finished laying out").
  resync();
  canvas.addEventListener("webglcontextrestored", resync);
  setTimeout(resync, 100);
  setTimeout(resync, 500);
}

let cached = null;

export function hasWebGL() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    cached = false;
  }
  return cached;
}
