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
