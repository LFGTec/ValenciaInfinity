import { Environment, Gltf, OrbitControls } from "@react-three/drei";
import type { AvatarAsset } from "../../../services/avatarService";
import { AvatarModel } from "./AvatarModel";

type Props = {
  selectedAssets: Record<string, AvatarAsset>;
  selectedColors: Record<string, string>;
};

export function AvatarExperience({ selectedAssets, selectedColors }: Props) {
  return (
    <>
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      <Environment preset="sunset" environmentIntensity={0.3} />

      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.31}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#333" roughness={0.85} />
      </mesh>

      <ambientLight intensity={0.8} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2.2}
        castShadow
      />

      <directionalLight position={[-5, 5, 5]} intensity={0.7} />
      <directionalLight position={[3, 3, -5]} intensity={3} color="#ff671f" />

      <AvatarModel 
        selectedAssets={selectedAssets}
        selectedColors={selectedColors}
      />

      <Gltf
        position-y={-0.31}
        src="/models/TeleporterBase.glb"
        castShadow
        receiveShadow
      />
    </>
  );
}