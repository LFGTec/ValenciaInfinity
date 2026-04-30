import { Canvas } from "@react-three/fiber";
import type { AvatarAsset } from "../../../services/avatarService";
import { AvatarExperience } from "./AvatarExperience";

type Props = {
  selectedAssets?: Record<string, AvatarAsset>;
  selectedColors?: Record<string, string>;
};

export function AvatarCanvas({ selectedAssets = {}, selectedColors = {} }: Props) {
  return (
    <Canvas
      camera={{
        position: [-1, 1, 5],
        fov: 45,
      }}
      gl={{
        preserveDrawingBuffer: true,
      }}
      shadows
    >
      <color attach="background" args={["#130f30"]} />
      <fog attach="fog" args={["#130f30", 10, 40]} />

      <group position-y={-1}>
        <AvatarExperience selectedAssets={selectedAssets}
        selectedColors={selectedColors}/>

      </group>
    </Canvas>
  );
}