import { Suspense, useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Color } from "three";
import type { Group, Skeleton, Object3D } from "three";
import type { AvatarAsset as AvatarAssetType } from "../../../services/avatarService";
import { AvatarAsset } from "./AvatarAsset";

type Props = {
  selectedAssets: Record<string, AvatarAssetType>;
  selectedColors: Record<string, string>;
};

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getColorByCategory(
  selectedColors: Record<string, string>,
  categoryId: string
) {
  const foundKey = Object.keys(selectedColors).find(
    (key) => normalize(key) === normalize(categoryId)
  );

  return foundKey ? selectedColors[foundKey] : undefined;
}

function getSkinColor(selectedColors: Record<string, string>) {
  return (
    getColorByCategory(selectedColors, "Cabeza") ||
    getColorByCategory(selectedColors, "Cara") ||
    getColorByCategory(selectedColors, "Piel") ||
    getColorByCategory(selectedColors, "Cuerpo")
  );
}

function getAssetPosition(asset: any) {
  return (
    asset?.posicion_item ??
    asset?.position_item ??
    asset?.posicion ??
    asset?.orden ??
    asset?.order ??
    asset?.numero ??
    999
  );
}

function canPaintAsset(categoryId: string, asset: any) {
  const category = normalize(categoryId);
  const position = getAssetPosition(asset);

  if (
    category === "ojos" ||
    category === "eyes" ||
    category === "rostro" ||
    category === "face" ||
    category === "cara"
  ) {
    return false;
  }

  if (category === "lentes" || category === "glasses") {
    return position === 1 || position === 4;
  }

  if (category === "sombrero" || category === "hat") {
    return position === 2;
  }

  if (category === "playera" || category === "top") {
    return position <= 3;
  }

  if (category === "pantalon" || category === "bottom") {
    return position <= 3;
  }

  return true;
}

function getEffectiveColor(
  selectedColors: Record<string, string>,
  categoryId: string,
  asset: any
) {
  if (!canPaintAsset(categoryId, asset)) return undefined;

  const category = normalize(categoryId);

  if (
    category === "cabello" ||
    category === "cejas" ||
    category === "barba" ||
    category === "hair" ||
    category === "eyebrow" ||
    category === "eyebrows" ||
    category === "facialhair"
  ) {
    return getColorByCategory(selectedColors, "Cabello");
  }

  if (category === "pantalon" || category === "bottom") {
    return getColorByCategory(selectedColors, "Pantalón");
  }

  if (category === "playera" || category === "top") {
    return getColorByCategory(selectedColors, "Playera");
  }

  if (category === "nariz" || category === "nose") {
    return getSkinColor(selectedColors) || getColorByCategory(selectedColors, categoryId);
  }

  if (category === "lentes" || category === "glasses") {
    return getColorByCategory(selectedColors, "Lentes");
  }

  if (category === "sombrero" || category === "hat") {
    return getColorByCategory(selectedColors, "Sombrero");
  }

  if (category === "zapatos" || category === "shoes") {
    return getColorByCategory(selectedColors, "Zapatos");
  }

  return getColorByCategory(selectedColors, categoryId);
}

function findSkeleton(nodes: any): Skeleton | null {
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];

    if (node?.isSkinnedMesh && node?.skeleton) {
      return node.skeleton;
    }
  }

  return nodes?.Plane?.skeleton ?? null;
}

function applyMaterialColor(obj: any, color: string) {
  if (!obj?.material) return;

  const materials = Array.isArray(obj.material) ? obj.material : [obj.material];

  materials.forEach((mat: any) => {
    if (!mat?.color) return;

    mat.color = new Color(color);
    mat.needsUpdate = true;
  });
}

export function AvatarModel({ selectedAssets, selectedColors }: Props) {
  const group = useRef<Group>(null);

  const { nodes } = useGLTF("/models/Armature.glb") as any;
  const { animations } = useGLTF("/models/Poses.glb") as any;

  const { actions } = useAnimations(animations, group);

  const skeleton = findSkeleton(nodes);
  const assets = Object.entries(selectedAssets ?? {}) as [string, any][];
  const skinColor = getSkinColor(selectedColors);

  useEffect(() => {
    const idle = actions?.Idle;

    idle?.reset().fadeIn(0.2).play();

    return () => {
      idle?.fadeOut(0.2).stop();
    };
  }, [actions]);

  useEffect(() => {
    if (!group.current) return;
    if (!skinColor) return;

    group.current.traverse((obj: Object3D) => {
      const mesh = obj as any;

      if (!mesh?.isSkinnedMesh || !mesh?.material) return;

      const materialName = Array.isArray(mesh.material)
        ? mesh.material[0]?.name?.toLowerCase() ?? ""
        : mesh.material?.name?.toLowerCase() ?? "";

      const normalizedMaterialName = normalize(materialName);

      const isSkinPart =
        normalizedMaterialName.includes("skin") ||
        normalizedMaterialName.includes("piel") ||
        normalizedMaterialName.includes("body") ||
        normalizedMaterialName.includes("face") ||
        normalizedMaterialName.includes("cuerpo") ||
        normalizedMaterialName.includes("cara") ||
        normalizedMaterialName.includes("head") ||
        normalizedMaterialName.includes("cabeza");

      if (!isSkinPart) return;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((mat: any) => mat.clone());
      } else {
        mesh.material = mesh.material.clone();
      }

      applyMaterialColor(mesh, skinColor);
    });
  }, [skinColor]);

  if (!skeleton || !nodes?.mixamorigHips) {
    return null;
  }

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />

          {assets.map(([categoryId, asset]) => {
            const modelUrl =
              asset.model_url ||
              asset.url ||
              asset.file_url ||
              asset.asset_url;

            const normalizedCategory = normalize(categoryId);

            const isSkinCategory =
              normalizedCategory === "cabeza" ||
              normalizedCategory === "cara" ||
              normalizedCategory === "piel" ||
              normalizedCategory === "cuerpo" ||
              normalizedCategory === "rostro";

            const assetColor = isSkinCategory
              ? undefined
              : getEffectiveColor(selectedColors, categoryId, asset);

            if (!modelUrl) return null;

            return (
              <Suspense
                key={`${categoryId}-${asset.id}-${assetColor ?? "default"}-${
                  skinColor ?? "skin-default"
                }`}
                fallback={null}
              >
                <AvatarAsset
                  url={modelUrl}
                  skeleton={skeleton}
                  color={assetColor}
                  categoryId={categoryId}
                  skinColor={skinColor}
                />
              </Suspense>
            );
          })}
        </group>
      </group>
    </group>
  );
}