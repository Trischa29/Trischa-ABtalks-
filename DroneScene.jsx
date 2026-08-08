import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { buildDroneCamera, droneShiftX } from "../../three/droneCamera";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/webgl";
import { cn } from "../../lib/cn";

const ENTRY_OFFSET = 1.3;
const ENTRANCE_DURATION = 1.2;
const PULSE_DURATION = 1.4;

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

// Drives the camera along the full-track cinematic curve (mission
// arrival -> proof forms -> completion), with a pulled-back entrance.
function CameraRig({ progressRef, reducedMotion }) {
  const { cameraCurve, lookCurve } = useMemo(() => buildDroneCamera(), []);
  const clockRef = useRef(0);
  const smoothT = useRef(0);

  useFrame((state, delta) => {
    clockRef.current += delta;
    const entranceT = reducedMotion ? 1 : Math.min(1, clockRef.current / ENTRANCE_DURATION);
    const eased = 1 - Math.pow(1 - entranceT, 3);

    const targetT = progressRef?.current ?? 0;
    smoothT.current += (targetT - smoothT.current) * (reducedMotion ? 1 : 0.09);
    const t = Math.min(1, Math.max(0, smoothT.current));

    cameraCurve.getPointAt(t, tmpPos);
    lookCurve.getPointAt(t, tmpLook);

    const pullBack = (1 - eased) * 1.8;
    state.camera.position.set(tmpPos.x + pullBack * 0.4, tmpPos.y, tmpPos.z + pullBack);
    state.camera.fov = 40 + (1 - eased) * 6;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(tmpLook);
  });

  return null;
}

function DroneModel({ reducedMotion, progressRef, energy, pulseKey }) {
  const { scene } = useGLTF("/models/drone.glb");
  const groupRef = useRef(null);
  const lightRef = useRef(null);
  const clockRef = useRef(0);
  const entryRef = useRef(0);
  const shiftRef = useRef(0);
  const energyRef = useRef(energy);
  const pulseStart = useRef(performance.now());
  const prevPulseKey = useRef(pulseKey);

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    if (pulseKey !== prevPulseKey.current) {
      pulseStart.current = performance.now();
      prevPulseKey.current = pulseKey;
    }
  }, [pulseKey]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    clockRef.current += delta;

    // One-time entrance (flies in from the right), independent of scroll.
    entryRef.current += (1 - entryRef.current) * (reducedMotion ? 1 : 0.045);

    const targetShift = droneShiftX(progressRef?.current ?? 0);
    shiftRef.current += (targetShift - shiftRef.current) * (reducedMotion ? 1 : 0.08);

    const entryOffset = (1 - entryRef.current) * ENTRY_OFFSET;
    groupRef.current.position.x = shiftRef.current + entryOffset;

    const elapsedPulse = (performance.now() - pulseStart.current) / 1000;
    const pulse = Math.max(0, 1 - elapsedPulse / PULSE_DURATION);

    if (lightRef.current) {
      lightRef.current.intensity = 0.6 + energyRef.current * 1.1 + pulse * 2.6;
    }

    if (reducedMotion) return;
    const amp = 1 + energyRef.current * 0.4 + pulse * 0.9;
    groupRef.current.position.y = Math.sin(clockRef.current * 1.1) * 0.06 * amp;
    const pointerYaw = state.pointer.x * 0.14;
    const sweep = Math.sin(clockRef.current * 0.16) * 0.28;
    groupRef.current.rotation.y = pointerYaw + sweep;
    groupRef.current.rotation.z = Math.sin(clockRef.current * 0.7) * 0.03 * amp;
    groupRef.current.rotation.x = state.pointer.y * -0.04;
  });

  return (
    <group ref={groupRef}>
      <Center scale={0.0135}>
        <primitive object={scene} />
      </Center>
      <pointLight ref={lightRef} position={[0, 0.1, 0.5]} color="#8f6bff" distance={4} intensity={0.6} />
    </group>
  );
}

function SceneContents({ reducedMotion, progressRef, energy, pulseKey }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#8f9bff" />
      <directionalLight position={[3, 4, 3]} intensity={1} color="#e8eaff" />
      <pointLight position={[-2, -1, 2]} intensity={0.6} color="#8f6bff" distance={8} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <DroneModel reducedMotion={reducedMotion} progressRef={progressRef} energy={energy} pulseKey={pulseKey} />
      </Suspense>
      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.85}
            intensity={0.5 + energy * 0.5}
            mipmapBlur
            radius={0.5}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function DroneScene({ progressRef, className, fallbackClassName, energy = 0, pulseKey = 0 }) {
  const reducedMotion = useReducedMotion();
  const [webglOk] = useState(hasWebGL);

  if (!webglOk) {
    return <div className={cn(fallbackClassName)} />;
  }

  return (
    <div className={cn(className)}>
      <Canvas
        dpr={[1, 1.4]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ fov: 40, near: 0.1, far: 20, position: [0.42, 0.05, 2.25] }}
      >
        <Suspense fallback={null}>
          <SceneContents reducedMotion={reducedMotion} progressRef={progressRef} energy={energy} pulseKey={pulseKey} />
        </Suspense>
      </Canvas>
    </div>
  );
}
