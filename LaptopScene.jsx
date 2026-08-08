import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, RenderTexture, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import CityModel from "./CityModel";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/webgl";
import { cn } from "../../lib/cn";

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

function LaptopModel({ reducedMotion }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const groupRef = useRef(null);
  const clockRef = useRef(0);
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

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    clockRef.current += delta;
    groupRef.current.rotation.y = Math.sin(clockRef.current * 0.3) * 0.06;
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

function SceneContents({ reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#8f9bff" />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#e8eaff" />
      <pointLight position={[-2, 1, -3]} intensity={0.5} color="#8f6bff" distance={10} />
      <Suspense fallback={null}>
        <LaptopModel reducedMotion={reducedMotion} />
      </Suspense>
    </>
  );
}

export default function LaptopScene({ className, fallbackClassName }) {
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
        camera={{ fov: 38, near: 0.1, far: 20, position: [0, 0.35, 2.6] }}
      >
        <Suspense fallback={null}>
          <SceneContents reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
