import * as THREE from "three";

// Camera path spanning the ENTIRE Day 12 scroll track (mission arrival
// -> understand the task -> build in public -> github proof -> linkedin
// proof -> proof status -> complete), tuned to the drone's rest framing
// (camera resting around [0.15, 0, 2.4], fov 40).
const CAMERA_WAYPOINTS = [
  [0.42, 0.05, 2.25],
  [0.18, 0.1, 2.5],
  [-0.12, 0.02, 2.35],
  [0.22, -0.04, 2.55],
  [0.18, -0.04, 2.55],
  [0, 0.06, 2.4],
  [0, 0.14, 2.05],
];

const LOOK_WAYPOINTS = [
  [0, 0, 0],
  [0, 0.02, 0],
  [0, -0.02, 0],
  [0.04, 0, 0],
  [0.02, 0, 0],
  [0, 0.02, 0],
  [0, 0.04, 0],
];

export function buildDroneCamera() {
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

// The drone's own horizontal composition: stays right-of-center the
// whole route so it never overlaps the left-aligned mission text or
// proof forms, easing in slightly during the functional form beats and
// back out for the closing completion beat.
export function droneShiftX(t) {
  if (t < 0.28) return 0.18;
  if (t < 0.46) return 0.18 - 0.08 * ((t - 0.28) / 0.18);
  if (t < 0.82) return 0.1;
  return 0.1 + 0.08 * ((t - 0.82) / 0.18);
}
