import { Suspense, useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { Group, Skeleton } from "three";
import type { AvatarAsset as AvatarAssetType } from "../../../services/avatarService";
import { AvatarAsset } from "./AvatarAsset";

type Props = {
  selectedAssets: Record<string, AvatarAssetType>;
};

function findSkeleton(nodes: any): Skeleton | null {
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    if (node?.isSkinnedMesh && node?.skeleton) {
      return node.skeleton;
    }
  }

  return nodes?.Plane?.skeleton ?? null;
}

export function AvatarModel({ selectedAssets }: Props) {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF("/models/Armature.glb") as any;
  const { animations } = useGLTF("/models/Poses.glb") as any;

  const { actions } = useAnimations(animations, group);
  const skeleton = findSkeleton(nodes);
  const assets = Object.values(selectedAssets ?? {});

  useEffect(() => {
    const idle = actions?.Idle;
    idle?.reset().fadeIn(0.2).play();

    return () => {
      idle?.fadeOut(0.2).stop();
    };
  }, [actions]);

  if (!skeleton || !nodes?.mixamorigHips) {
    return null;
  }

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />

          {assets.map((asset) => (
            <Suspense key={`${asset.group}-${asset.id}`} fallback={null}>
              <AvatarAsset url={asset.url} skeleton={skeleton} />
            </Suspense>
          ))}
        </group>
      </group>
    </group>
  );
}