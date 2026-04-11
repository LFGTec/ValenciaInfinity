import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./AvatarPreview3D.css";

type AvatarPreview3DProps = {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  shirtType: string;
};

function Avatar({
  skinColor,
  hairStyle,
  hairColor,
  shirtType,
}: AvatarPreview3DProps) {
  const shirtColors: Record<string, string> = {
    Local: "#ffffff",
    Visitante: "#111111",
    Tercera: "#d39a00",
  };

  const shirtTextColors: Record<string, string> = {
    Local: "#111111",
    Visitante: "#ffffff",
    Tercera: "#ffffff",
  };

  const hairHeights: Record<string, number> = {
    Corto: 0.16,
    Largo: 0.38,
    Rapado: 0.08,
    Rizado: 0.22,
    Liso: 0.18,
    Ondulado: 0.24,
    Afro: 0.32,
    Calvo: 0.01,
  };

  const hairY: Record<string, number> = {
    Corto: 1.9,
    Largo: 1.78,
    Rapado: 1.95,
    Rizado: 1.88,
    Liso: 1.9,
    Ondulado: 1.87,
    Afro: 1.86,
    Calvo: 2.0,
  };

  const currentHairHeight = hairHeights[hairStyle] ?? 0.16;
  const currentHairY = hairY[hairStyle] ?? 1.9;

  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {hairStyle !== "Calvo" && (
        <mesh position={[0, currentHairY, 0]}>
          <boxGeometry args={[0.5, currentHairHeight, 0.5]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}

      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.72, 0.95, 0.35]} />
        <meshStandardMaterial color={shirtColors[shirtType]} />
      </mesh>

      <mesh position={[0, 1.28, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[-0.54, 0.95, 0]}>
        <boxGeometry args={[0.22, 0.78, 0.22]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[0.54, 0.95, 0]}>
        <boxGeometry args={[0.22, 0.78, 0.22]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[-0.18, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.72, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0.18, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.72, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[-0.18, -0.22, 0.06]}>
        <boxGeometry args={[0.24, 0.12, 0.32]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>

      <mesh position={[0.18, -0.22, 0.06]}>
        <boxGeometry args={[0.24, 0.12, 0.32]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>

      <mesh position={[0, 0.95, 0.181]}>
        <boxGeometry args={[0.18, 0.35, 0.02]} />
        <meshStandardMaterial color={shirtTextColors[shirtType]} />
      </mesh>
    </group>
  );
}

function AvatarPreview3D(props: AvatarPreview3DProps) {
  return (
    <div className="avatar-preview-wrapper">
      <div className="avatar-preview-container">
        <Canvas
          camera={{
            position: [0, 1.4, 3.2],
            fov: 80,
          }}
        >
          <color attach="background" args={["#1e1c1c"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 4, 3]} intensity={2.2} />
          <directionalLight position={[-2, 2, 2]} intensity={1.2} />
          <OrbitControls enablePan={false} enableZoom={true} />
          <Avatar {...props} />
        </Canvas>
      </div>
    </div>
  );
}

export default AvatarPreview3D;
