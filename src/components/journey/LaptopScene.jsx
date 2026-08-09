import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, RenderTexture, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import CityModel from "./CityModel";
import { buildLaptopCamera, laptopShiftX } from "../../three/laptopCamera";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDeferredMount } from "../../hooks/useDeferredMount";
import { hasWebGL, resyncSizeOnContextRestore, loseContextOnUnmount } from "../../lib/webgl";
import { cn } from "../../lib/cn";

const ENTRANCE_DURATION = 1.15;

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

// Slowly orbiting camera for the mini city rendered onto the screen.
function ScreenCamera() {
  const ref = useRef(null);
  const clockRef = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    clockRef.current += delta;
    const angle = clockRef.current * 0.08;
    ref.current.position.set(6 + Math.sin(angle) * 2, 19, 15 + Math.cos(angle) * 2);
    ref.current.lookAt(2, 9, -2);
  });
  return <PerspectiveCamera ref={ref} makeDefault manual fov={42} near={0.5} far={80} position={[6, 19, 15]} />;
}

// Drives the main camera along the full-track cinematic curve, with a
// pulled-back entrance so the page feels like it's arriving rather than
// cutting in. `progressRef` is a plain mutable ref (GSAP ScrollTrigger
// writes it every scroll tick) — read here, not bound to any DOM style.
function CameraRig({ progressRef, reducedMotion }) {
  const { cameraCurve, lookCurve } = useMemo(() => buildLaptopCamera(), []);
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

    // Blend the entrance pull-back on top of the curve position.
    const pullBack = (1 - eased) * 2.1;
    state.camera.position.set(tmpPos.x, tmpPos.y + (1 - eased) * 0.4, tmpPos.z + pullBack);
    state.camera.fov = 40 + (1 - eased) * 8;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(tmpLook);
  });

  return null;
}

function LaptopModel({ reducedMotion, progressRef }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const groupRef = useRef(null);
  const clockRef = useRef(0);
  const shiftRef = useRef(0);
  const rot = useRef({ y: 0, x: 0 });
  const [screenTransform, setScreenTransform] = useState(null);

  useLayoutEffect(() => {
    let found = null;
    scene.traverse((child) => {
      if (child.isMesh && child.material?.name === "Screen") found = child;
    });
    if (!found) return;

    // The screen mesh's transform relative to the GLTF root (`scene`),
    // so a replacement mesh mounted as a sibling of `<primitive
    // object={scene}>` lines up exactly without copying parent chains.
    scene.updateWorldMatrix(true, true);
    const sceneInverse = new THREE.Matrix4().copy(scene.matrixWorld).invert();
    const local = new THREE.Matrix4().multiplyMatrices(sceneInverse, found.matrixWorld);
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scaleVec = new THREE.Vector3();
    local.decompose(position, quaternion, scaleVec);

    found.visible = false;
    setScreenTransform({ position, quaternion, scale: scaleVec, geometry: found.geometry });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    clockRef.current += delta;

    const targetShift = laptopShiftX(progressRef?.current ?? 0);
    shiftRef.current += (targetShift - shiftRef.current) * (reducedMotion ? 1 : 0.07);
    groupRef.current.position.x = shiftRef.current;

    if (reducedMotion) return;
    const idleSway = Math.sin(clockRef.current * 0.3) * 0.05;
    const targetY = idleSway + state.pointer.x * 0.11;
    const targetX = state.pointer.y * -0.04;
    rot.current.y += (targetY - rot.current.y) * 0.06;
    rot.current.x += (targetX - rot.current.x) * 0.06;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.x = rot.current.x;
  });

  return (
    <group ref={groupRef} scale={0.0095} position={[0, -0.55, 0]}>
      <primitive object={scene} />
      {screenTransform && (
        <mesh
          geometry={screenTransform.geometry}
          position={screenTransform.position}
          quaternion={screenTransform.quaternion}
          scale={screenTransform.scale}
        >
          <meshBasicMaterial toneMapped={false}>
            <RenderTexture attach="map" width={480} height={300}>
              <ScreenCamera />
              <color attach="background" args={["#04040a"]} />
              <ambientLight intensity={0.6} color="#8f9bff" />
              <directionalLight position={[8, 16, 8]} intensity={1.1} color="#e8eaff" />
              <fog attach="fog" args={["#04040a", 12, 34]} />
              <Suspense fallback={null}>
                <CityModel />
              </Suspense>
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      )}
    </group>
  );
}

function SceneContents({ reducedMotion, progressRef }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#8f9bff" />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#e8eaff" />
      <pointLight position={[-2, 1, -3]} intensity={0.5} color="#8f6bff" distance={10} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <LaptopModel reducedMotion={reducedMotion} progressRef={progressRef} />
      </Suspense>
    </>
  );
}

export default function LaptopScene({ progressRef, className, fallbackClassName }) {
  const reducedMotion = useReducedMotion();
  const [webglOk] = useState(hasWebGL);
  const ready = useDeferredMount();
  const disposeRef = useRef(null);

  // Landing's CityScene loads these same two URLs in its own separate
  // <Canvas>/GL context. useGLTF's cache is global-by-URL, but a
  // mesh's geometry/material buffers are only valid on the context
  // that uploaded them — see the matching comment in CityScene.jsx.
  useEffect(() => {
    return () => {
      useGLTF.clear("/models/city.glb");
      useGLTF.clear("/models/laptop.glb");
      disposeRef.current?.();
    };
  }, []);

  if (!webglOk) {
    return <div className={cn(fallbackClassName)} />;
  }

  if (!ready) return <div className={cn(className)} />;

  return (
    <div className={cn(className)}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ fov: 40, near: 0.1, far: 20, position: [0, 0.55, 3.25] }}
        onCreated={(state) => {
          resyncSizeOnContextRestore(state);
          disposeRef.current = loseContextOnUnmount(state);
        }}
      >
        <Suspense fallback={null}>
          <SceneContents reducedMotion={reducedMotion} progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
