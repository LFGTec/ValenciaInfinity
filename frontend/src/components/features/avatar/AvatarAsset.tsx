import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { Skeleton } from "three";

type Props = {
  url: string;
  skeleton: Skeleton;
};

export function AvatarAsset({ url, skeleton }: Props) {
  const { scene } = useGLTF(url);

  const attachedItems = useMemo(() => {
    const items: any[] = [];

    scene.traverse((child: any) => {
      if (
        child.isMesh &&
        child.geometry?.attributes?.skinIndex &&
        child.geometry?.attributes?.skinWeight
      ) {
        items.push({
          geometry: child.geometry,
          material: child.material,
          morphTargetDictionary: child.morphTargetDictionary,
          morphTargetInfluences: child.morphTargetInfluences,
        });
      }
    });

    return items;
  }, [scene]);

  return (
    <>
      {attachedItems.map((item, index) => (
        <skinnedMesh
          key={index}
          geometry={item.geometry}
          material={item.material}
          skeleton={skeleton}
          morphTargetDictionary={item.morphTargetDictionary}
          morphTargetInfluences={item.morphTargetInfluences}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
}