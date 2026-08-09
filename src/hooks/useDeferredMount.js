import { useEffect, useState } from "react";

// Each route mounts a brand-new <Canvas> (its own WebGLRenderer/GL
// context) right as the previous route's Canvas is torn down. Mounting
// immediately can race the GPU/driver still reclaiming the old
// context's resources, which can surface as an immediate context-loss
// event on the new one — and the resize bookkeeping tied to that first
// frame doesn't reliably catch up afterward. A one-tick delay before
// the new Canvas actually mounts gives the old context's teardown a
// moment to finish first.
export function useDeferredMount(delay = 350) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return ready;
}
