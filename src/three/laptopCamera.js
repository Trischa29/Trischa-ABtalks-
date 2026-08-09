import * as THREE from "three";

// Camera path spanning the ENTIRE dashboard scroll track (arrival ->
// progress -> journey -> today's build -> achievements -> closing CTA),
// tuned to the laptop model's rest framing (camera resting around
// [0, 0.4, 2.85], fov ~40).
const CAMERA_WAYPOINTS = [
  [0, 0.55, 3.25],
  [0.16, 0.42, 2.7],
  [0.04, 0.5, 2.95],
  [-0.12, 0.4, 2.6],
  [0.1, 0.48, 2.9],
  [0, 0.62, 3.35],
];

const LOOK_WAYPOINTS = [
  [0, 0.02, 0],
  [0, -0.06, 0],
  [0, 0.0, 0],
  [0.06, -0.06, 0],
  [0, 0.0, 0],
  [0, 0.05, 0],
];

export function buildLaptopCamera() {
  const cameraCurve = new THREE.CatmullRomCurve3(
    CAMERA_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.4
  );
  const lookCurve = new THREE.CatmullRomCurve3(
    LOOK_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.4
  );
  return { cameraCurve, lookCurve };
}

// The laptop's own left-shift (composition, not camera): ramps left
// through the progress/journey beats, eases back toward center for
// today's build/achievements/closing CTA.
export function laptopShiftX(t) {
  if (t < 0.05) return 0;
  if (t < 0.32) return -0.62 * ((t - 0.05) / 0.27);
  if (t < 0.55) return -0.62;
  if (t < 0.78) return -0.62 * (1 - (t - 0.55) / 0.23);
  return 0;
}
