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
  skinColor?: string;
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
    name.includes("head") ||
    name.includes("cabeza") ||
    name.includes("hand") ||
    name.includes("hands") ||
    name.includes("mano") ||
    name.includes("manos") ||
    name.includes("arm") ||
    name.includes("arms") ||
    name.includes("brazo") ||
    name.includes("brazos") ||
    name.includes("leg") ||
    name.includes("legs") ||
    name.includes("pierna") ||
    name.includes("piernas") ||
    name.includes("neck") ||
    name.includes("cuello") ||
    name.includes("ear") ||
    name.includes("ears") ||
    name.includes("oreja") ||
    name.includes("orejas")
  );
}

function isHairMaterial(mat: any) {
  const name = normalize(mat?.name);

  return (
    name.includes("hair") ||
    name.includes("cabello") ||
    name.includes("pelo") ||
    name.includes("ceja") ||
    name.includes("cejas") ||
    name.includes("eyebrow") ||
    name.includes("eyebrows") ||
    name.includes("barba") ||
    name.includes("beard") ||
    name.includes("facialhair") ||
    name.includes("mustache") ||
    name.includes("moustache") ||
    name.includes("bigote")
  );
}

function isEyeMaterial(mat: any) {
  const name = normalize(mat?.name);

  return (
    name.includes("eye") ||
    name.includes("eyes") ||
    name.includes("ojo") ||
    name.includes("ojos") ||
    name.includes("iris") ||
    name.includes("pupil") ||
    name.includes("pupila")
  );
}

function isMouthMaterial(mat: any) {
  const name = normalize(mat?.name);

  return (
    name.includes("mouth") ||
    name.includes("boca") ||
    name.includes("teeth") ||
    name.includes("tooth") ||
    name.includes("diente") ||
    name.includes("dientes") ||
    name.includes("tongue") ||
    name.includes("lengua") ||
    name.includes("labio") ||
    name.includes("labios")
  );
}

function isGlassMaterial(mat: any) {
  const name = normalize(mat?.name);

  return (
    name.includes("glass") ||
    name.includes("cristal") ||
    name.includes("lens") ||
    name.includes("lente")
  );
}

function isClothingCategory(categoryId?: string) {
  const category = normalize(categoryId);

  return (
    category === "playera" ||
    category === "top" ||
    category === "pantalon" ||
    category === "bottom"
  );
}

function isNeverPaintCategory(categoryId?: string) {
  const category = normalize(categoryId);

  return (
    category === "ojos" ||
    category === "eyes" ||
    category === "rostro" ||
    category === "face" ||
    category === "cara"
  );
}

function shouldSkipMaterialForCategory(categoryId: string | undefined, mat: any) {
  const category = normalize(categoryId);

  const isClothingLike =
    category === "playera" ||
    category === "top" ||
    category === "pantalon" ||
    category === "bottom" ||
    category === "sombrero" ||
    category === "hat" ||
    category === "zapatos" ||
    category === "shoes";

  const isGlasses = category === "lentes" || category === "glasses";

  const isSkinLikeCategory =
    category === "nariz" ||
    category === "nose" ||
    category === "cabeza" ||
    category === "head" ||
    category === "piel" ||
    category === "cuerpo" ||
    category === "body";

 
  if (isNeverPaintCategory(categoryId)) {
    return true;
  }

  
  if (isClothingLike) {
    return isHairMaterial(mat) || isEyeMaterial(mat) || isMouthMaterial(mat);
  }

  
  if (isGlasses) {
    return isGlassMaterial(mat);
  }

  
  if (isSkinLikeCategory) {
    return isHairMaterial(mat) || isEyeMaterial(mat) || isMouthMaterial(mat);
  }

  return false;
}

function paintMaterial(
  material: any,
  color: string | undefined,
  categoryId?: string,
  skinColor?: string
) {
  const materials = Array.isArray(material) ? material : [material];
  const isClothing = isClothingCategory(categoryId);

  materials.forEach((mat: MeshStandardMaterial | any) => {
    if (!mat) return;

    
    if (isNeverPaintCategory(categoryId)) {
      return;
    }

  
    if (isClothing && isSkinMaterial(mat)) {
      if (skinColor && mat.color) {
        mat.color.set(skinColor);
        mat.needsUpdate = true;
      }
      return;
    }

    
    if (!color) {
      return;
    }

    if (shouldSkipMaterialForCategory(categoryId, mat)) {
      return;
    }

    if (mat.color) {
      mat.color.set(color);
    }

    if ("vertexColors" in mat) {
      mat.vertexColors = false;
    }

    mat.needsUpdate = true;
  });
}

export function AvatarAsset({
  url,
  skeleton,
  color,
  categoryId,
  skinColor,
}: Props) {
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
    if (!color && !skinColor) return;

    scene.traverse((obj: Object3D) => {
      const mesh = obj as any;

      if (!isPaintableMesh(obj)) return;
      if (!mesh.material) return;

      paintMaterial(mesh.material, color, categoryId, skinColor);
    });
  }, [scene, color, categoryId, skinColor]);

  return <primitive object={scene} />;
}