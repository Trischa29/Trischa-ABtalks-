import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/webgl";
import { cn } from "../../lib/cn";

function DroneModel({ reducedMotion }) {
  const { scene } = useGLTF("/models/drone.glb");
  const groupRef = useRef(null);
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    clockRef.current += delta;
    groupRef.current.position.y = Math.sin(clockRef.current * 1.1) * 0.06;
    groupRef.current.rotation.y = clockRef.current * 0.25;
    groupRef.current.rotation.z = Math.sin(clockRef.current * 0.7) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Center scale={0.0135}>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function SceneContents({ reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#8f9bff" />
      <directionalLight position={[3, 4, 3]} intensity={1} color="#e8eaff" />
      <pointLight position={[-2, -1, 2]} intensity={0.6} color="#8f6bff" distance={8} />
      <Suspense fallback={null}>
        <DroneModel reducedMotion={reducedMotion} />
      </Suspense>
      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.85} intensity={0.5} mipmapBlur radius={0.5} />
        </EffectComposer>
      )}
    </>
  );
}

export default function DroneScene({ className, fallbackClassName }) {
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
        camera={{ fov: 40, near: 0.1, far: 20, position: [0.6, -0.15, 2.4] }}
      >
        <Suspense fallback={null}>
          <SceneContents reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
