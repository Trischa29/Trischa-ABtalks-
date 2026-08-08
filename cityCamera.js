import * as THREE from "three";

// Hand-placed waypoints for the cinematic descent into city.glb, tuned
// to its bounding box (~x:[-13,17] y:[-0.3,20] z:[-8,7.5]). Aerial
// establishing shot → street-level, weaving between towers.
const CAMERA_WAYPOINTS = [
  [6, 27, 20],
  [9, 19, 12],
  [4, 11, 5],
  [-2, 6.5, 3],
  [-4.5, 3.2, 0.5],
];

const LOOK_WAYPOINTS = [
  [2, 9, -2],
  [2, 9.5, -2],
  [3, 10, -3],
  [4, 11, -4],
  [5, 12.5, -5],
];

export function buildCityCamera() {
  const cameraCurve = new THREE.CatmullRomCurve3(
    CAMERA_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.5
  );
  const lookCurve = new THREE.CatmullRomCurve3(
    LOOK_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.5
  );
  return { cameraCurve, lookCurve };
}
