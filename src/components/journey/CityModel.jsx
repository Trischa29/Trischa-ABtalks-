import { useGLTF } from "@react-three/drei";

// The actual authored city (Sketchfab, CC-BY, optimized/compressed —
// see PROMPTS.md for the pipeline and attribution). This is the one
// real architectural asset in the scene; everything else (route,
// camera, overlays) is built around it.
export default function CityModel(props) {
  const { scene } = useGLTF("/models/city.glb");
  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/models/city.glb");
