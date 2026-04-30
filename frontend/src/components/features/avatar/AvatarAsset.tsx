import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
  Skeleton,
} from "three";

type Props = {
  url: string;
  skeleton: Skeleton | null;
  color?: string;
  categoryId?: string;
};

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isSkinnedMesh(obj: Object3D): obj is SkinnedMesh {
  return (obj as any).isSkinnedMesh === true;
}

function isPaintableMesh(obj: Object3D) {
  return (obj as any).isMesh === true || (obj as any).isSkinnedMesh === true;
}

function cloneMaterial(material: any) {
  if (!material) return material;

  if (Array.isArray(material)) {
    return material.map((mat) => (mat?.clone ? mat.clone() : mat));
  }

  return material?.clone ? material.clone() : material;
}

function isSkinMaterial(mat: any) {
  const name = normalize(mat?.name);

  return (
    name.includes("skin") ||
    name.includes("piel") ||
    name.includes("body") ||
    name.includes("cuerpo") ||
    name.includes("face") ||
    name.includes("cara") ||
    name.includes("hand") ||
    name.includes("hands") ||
    name.includes("mano") ||
    name.includes("manos") ||
    name.includes("arm") ||
    name.includes("arms") ||
    name.includes("brazo") ||
    name.includes("brazos")
  );
}

function shouldSkipMaterialForCategory(categoryId: string | undefined, mat: any) {
  const category = normalize(categoryId);

  const isClothing =
    category === "playera" ||
    category === "top" ||
    category === "pantalon" ||
    category === "bottom";

  return isClothing && isSkinMaterial(mat);
}

function paintMaterial(material: any, color: string, categoryId?: string) {
  const materials = Array.isArray(material) ? material : [material];

  materials.forEach((mat: MeshStandardMaterial | any) => {
    if (!mat) return;

    if (shouldSkipMaterialForCategory(categoryId, mat)) {
      return;
    }

    if (mat.color) {
      mat.color.set(color);
    }

    if ("map" in mat) {
      mat.map = null;
    }

    if ("vertexColors" in mat) {
      mat.vertexColors = false;
    }

    mat.needsUpdate = true;
  });
}

export function AvatarAsset({ url, skeleton, color, categoryId }: Props) {
  const gltf = useGLTF(url) as any;

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    cloned.traverse((obj: Object3D) => {
      const mesh = obj as any;

      if (!isPaintableMesh(obj)) return;

      if (isSkinnedMesh(obj) && skeleton) {
        mesh.skeleton = skeleton;
        mesh.bind(skeleton, mesh.bindMatrix);
      }

      if (mesh.material) {
        mesh.material = cloneMaterial(mesh.material);
      }
    });

    return cloned;
  }, [gltf.scene, skeleton]);

  useEffect(() => {
    if (!color) return;

    scene.traverse((obj: Object3D) => {
      const mesh = obj as any;

      if (!isPaintableMesh(obj)) return;
      if (!mesh.material) return;

      paintMaterial(mesh.material, color, categoryId);
    });
  }, [scene, color, categoryId]);

  return <primitive object={scene} />;
}