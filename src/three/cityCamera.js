import * as THREE from "three";

// Phase A (unchanged) — aerial establishing shot descending into
// street level, weaving between towers. Tuned to city.glb's bounding
// box (~x:[-13,17] y:[-0.3,20] z:[-8,7.5]).
const CITY_CAMERA_WAYPOINTS = [
  [6, 27, 20],
  [9, 19, 12],
  [4, 11, 5],
  [-2, 6.5, 3],
  [-4.5, 3.2, 0.5],
];

const CITY_LOOK_WAYPOINTS = [
  [2, 9, -2],
  [2, 9.5, -2],
  [3, 10, -3],
  [4, 11, -4],
  [5, 12.5, -5],
];

// The laptop sits far along +z, well outside the city's bounding box —
// completely out of frame during phase A. Phase B is one continuous
// camera move that pulls back from street level and travels to it,
// landing on the exact framing LaptopScene rests at (translated by this
// offset) — no cut, no crossfade, the city just recedes into the fog
// behind the camera as it arrives.
export const LAPTOP_WORLD_OFFSET = [0, -1, 62];

const REVEAL_CAMERA_WAYPOINTS = [
  [-2, 9, 16],
  [0, 5, 36],
  [0, 0.5, 55],
  [0, -0.6, LAPTOP_WORLD_OFFSET[2] + 2.85],
];

const REVEAL_LOOK_WAYPOINTS = [
  [1, 8, 10],
  [0, 3, 40],
  [0, -0.5, 58],
  [LAPTOP_WORLD_OFFSET[0], LAPTOP_WORLD_OFFSET[1] - 0.05, LAPTOP_WORLD_OFFSET[2]],
];

export function buildCityCamera() {
  const cameraCurve = new THREE.CatmullRomCurve3(
    [...CITY_CAMERA_WAYPOINTS, ...REVEAL_CAMERA_WAYPOINTS].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.5
  );
  const lookCurve = new THREE.CatmullRomCurve3(
    [...CITY_LOOK_WAYPOINTS, ...REVEAL_LOOK_WAYPOINTS].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.5
  );
  return { cameraCurve, lookCurve };
}

// FOV narrows from the city's wide establishing-shot framing (50) to the
// laptop's tighter rest framing (40) as the camera arrives. Driven by
// distance-from-origin rather than a hardcoded t-threshold, since the
// curve's arc-length parametrization doesn't split evenly across the two
// phases (phase B covers much more ground than phase A).
const CITY_MAX_REACH = 34; // roughly where the street-level waypoints sit
const LAPTOP_REACH = new THREE.Vector3(...LAPTOP_WORLD_OFFSET).length();

function revealAmount(cameraPos) {
  const dist = cameraPos.length();
  return Math.min(1, Math.max(0, (dist - CITY_MAX_REACH) / (LAPTOP_REACH - CITY_MAX_REACH)));
}

export function cityCameraFov(cameraPos) {
  return 50 + (40 - 50) * revealAmount(cameraPos);
}

// The original fog (far: 46) is tuned for the tight city flythrough and
// must stay exactly as-is there. But phase B travels the camera through
// open space between the city and the laptop with nothing placed in
// it — at the original fog distance that space renders as solid fog
// color (near-black) for a stretch, reading as a broken/blank frame
// rather than a deliberate transition. Pushing fog.far out as the
// camera leaves the city keeps that middle stretch visible (a dim,
// receding cityscape) without touching phase A's atmosphere at all.
export function cityFogFar(cameraPos) {
  return 46 + revealAmount(cameraPos) * 60;
}
