import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import CityModel from "./CityModel";
import { buildCityCamera } from "../../three/cityCamera";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/webgl";
import { cn } from "../../lib/cn";

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

function CityCameraRig({ cameraCurve, lookCurve, scrollProgress, reducedMotion }) {
  const { camera } = useThree();
  const smoothT = useRef(0);

  useFrame(() => {
    const targetT = reducedMotion ? 0.12 : scrollProgress ? scrollProgress.get() : 0;
    smoothT.current += (targetT - smoothT.current) * (reducedMotion ? 1 : 0.1);
    const t = Math.min(1, Math.max(0, smoothT.current));

    cameraCurve.getPointAt(t, tmpPos);
    camera.position.copy(tmpPos);
    lookCurve.getPointAt(t, tmpLook);
    camera.lookAt(tmpLook);
  });

  return null;
}

function SceneContents({ scrollProgress, reducedMotion }) {
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

      <CityCameraRig
        cameraCurve={cameraCurve}
        lookCurve={lookCurve}
        scrollProgress={scrollProgress}
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

export default function CityScene({ scrollProgress, className, fallbackClassName }) {
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
        camera={{ fov: 50, near: 0.1, far: 120 }}
      >
        <Suspense fallback={null}>
          <SceneContents scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
