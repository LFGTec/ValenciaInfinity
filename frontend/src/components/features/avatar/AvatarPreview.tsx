import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { AvatarModel } from "./AvatarModel";
import type { AvatarAsset } from "../../../services/avatarService";

type Props = {
  selectedAssets: Record<string, AvatarAsset>;
  selectedColors: Record<string, string>;
  className?: string;
  animation?: string;
  onAnimationEnd?: () => void;
};

export function AvatarPreview({ selectedAssets, selectedColors, className, animation, onAnimationEnd }: Props) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.8, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        shadows={false}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#ff671f" />
        <Environment preset="sunset" environmentIntensity={0.3} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />

        <group position={[0, -1, 0]}>
          <Suspense fallback={null}>
            <AvatarModel
              selectedAssets={selectedAssets}
              selectedColors={selectedColors}
              animation={animation}
              onAnimationEnd={onAnimationEnd}
            />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}
