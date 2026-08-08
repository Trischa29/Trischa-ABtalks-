import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, RenderTexture, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import CityModel from "./CityModel";
import { buildCityCamera, cityCameraFov, cityFogFar, LAPTOP_WORLD_OFFSET } from "../../three/cityCamera";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/webgl";
import { cn } from "../../lib/cn";

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

// Drives the camera along ONE continuous curve for the whole page: city
// flythrough, then pull back and travel to the laptop. `progressRef` is
// a plain mutable ref written every scroll tick by GSAP ScrollTrigger —
// read here each frame, never bound to a DOM style, so scroll position
// and visual state can never drift out of sync in either direction.
function CityCameraRig({ cameraCurve, lookCurve, progressRef, reducedMotion }) {
  const { camera, scene } = useThree();
  const smoothT = useRef(0);

  useFrame(() => {
    const targetT = reducedMotion ? 0.12 : progressRef ? progressRef.current : 0;
    smoothT.current += (targetT - smoothT.current) * (reducedMotion ? 1 : 0.1);
    const t = Math.min(1, Math.max(0, smoothT.current));

    cameraCurve.getPointAt(t, tmpPos);
    camera.position.copy(tmpPos);
    lookCurve.getPointAt(t, tmpLook);
    camera.lookAt(tmpLook);
    camera.fov = cityCameraFov(tmpPos);
    camera.updateProjectionMatrix();

    // Phase A's fog (far: 46) is untouched at t≈0. Phase B pushes it out
    // as the camera leaves the city, so the empty space it travels
    // through on the way to the laptop doesn't render as a solid wall
    // of fog color — see cityFogFar's comment for why.
    if (scene.fog) scene.fog.far = cityFogFar(tmpPos);
  });

  return null;
}

// Slowly orbiting camera for the mini city rendered onto the laptop's
// screen (same technique as the dashboard's LaptopScene).
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

// The laptop the camera arrives at — the SAME city model rendered onto
// its screen via RenderTexture, so the payoff of the pull-back is
// literal: the city the camera just flew through is what's on screen.
function LaptopReveal({ reducedMotion }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const innerRef = useRef(null);
  const clockRef = useRef(0);
  const [screenTransform, setScreenTransform] = useState(null);

  useLayoutEffect(() => {
    let found = null;
    scene.traverse((child) => {
      if (child.isMesh && child.material?.name === "Screen") found = child;
    });
    if (!found) return;

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

  useFrame((_, delta) => {
    if (!innerRef.current || reducedMotion) return;
    clockRef.current += delta;
    innerRef.current.rotation.y = Math.sin(clockRef.current * 0.3) * 0.04;
  });

  return (
    <group position={LAPTOP_WORLD_OFFSET}>
      <ambientLight intensity={0.5} color="#8f9bff" />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#e8eaff" />
      <pointLight position={[-2, 1, -3]} intensity={0.5} color="#8f6bff" distance={10} />
      <group ref={innerRef} scale={0.0095} position={[0, -0.55, 0]}>
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
    </group>
  );
}

function SceneContents({ progressRef, reducedMotion }) {
  const { cameraCurve, lookCurve } = useMemo(() => buildCityCamera(), []);

  return (
    <>
      <fog attach="fog" args={["#07070c", 14, 46]} />
      <ambientLight intensity={0.55} color="#8f9bff" />
      <directionalLight position={[10, 24, 10]} intensity={1.1} color="#e8eaff" />
      <pointLight position={[-6, 6, 4]} intensity={0.7} color="#8f6bff" distance={30} />

      <Suspense fallback={null}>
        <CityModel scale={1} />
      </Suspense>

      <Suspense fallback={null}>
        <LaptopReveal reducedMotion={reducedMotion} />
      </Suspense>

      <CityCameraRig
        cameraCurve={cameraCurve}
        lookCurve={lookCurve}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />

      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.85} intensity={0.6} mipmapBlur radius={0.55} />
        </EffectComposer>
      )}
    </>
  );
}

export default function CityScene({ progressRef, className, fallbackClassName }) {
  const reducedMotion = useReducedMotion();
  const [webglOk] = useState(hasWebGL);

  if (!webglOk) {
    return (
      <div className={cn(fallbackClassName, "flex items-center justify-center")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]">
          ABTalks — the 60-day build challenge
        </p>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 50, near: 0.1, far: 140 }}
      >
        <Suspense fallback={null}>
          <SceneContents progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
