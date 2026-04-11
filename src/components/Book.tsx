import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
  type Texture,
} from "three";
import type { Card } from "../services/cardsService";
import {
  createCardTexture,
  createCoverTexture,
  createBackTexture,
} from "../utils/createCardTexture";
import { pageAtom, buildPages, type AlbumPage } from "./UI";

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const posAttr = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes: number[] = [];
const skinWeights: number[] = [];

for (let i = 0; i < posAttr.count; i++) {
  vertex.fromBufferAttribute(posAttr, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: "#111" }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

// ---------------------------------------------------------------------------

interface PageProps {
  number: number;
  frontTexture: Texture;
  backTexture: Texture;
  page: number;
  opened: boolean;
  bookClosed: boolean;
}

const Page = ({
  number,
  frontTexture,
  backTexture,
  page,
  opened,
  bookClosed,
}: PageProps) => {
  const groupRef = useRef<import("three").Group>(null);
  const turnedAt = useRef<number>(0);
  const lastOpened = useRef<boolean>(opened);
  const [highlighted, setHighlighted] = useState(false);
  const [, setPage] = useAtom(pageAtom);
  useCursor(highlighted);

  const mesh = useMemo(() => {
    const bones: Bone[] = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: frontTexture,
        roughness: 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: backTexture,
        roughness: 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ];

    const skinnedMesh = new SkinnedMesh(pageGeometry, materials);
    skinnedMesh.castShadow = true;
    skinnedMesh.receiveShadow = true;
    skinnedMesh.frustumCulled = false;
    skinnedMesh.add(skeleton.bones[0]);
    skinnedMesh.bind(skeleton);
    return skinnedMesh;
  }, [frontTexture, backTexture]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const mats = mesh.material as MeshStandardMaterial[];
    const targetEmissive = highlighted ? 0.22 : 0;
    mats[4].emissiveIntensity = MathUtils.lerp(mats[4].emissiveIntensity, targetEmissive, 0.1);
    mats[5].emissiveIntensity = MathUtils.lerp(mats[5].emissiveIntensity, targetEmissive, 0.1);

    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, Date.now() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) targetRotation += MathUtils.degToRad(number * 0.8);

    const bones = mesh.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? groupRef.current : bones[i];
      if (!target) continue;

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = MathUtils.degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        rotationAngle = i === 0 ? targetRotation : 0;
        foldRotationAngle = 0;
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={mesh}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

// ---------------------------------------------------------------------------

function resolveTextures(pages: AlbumPage[]) {
  return pages.map((pageData) => {
    const frontTexture =
      pageData.front === "__cover__"
        ? createCoverTexture()
        : pageData.front === "__back__"
        ? createBackTexture()
        : createCardTexture(pageData.front as Card[]);

    const backTexture =
      pageData.back === "__back__"
        ? createBackTexture()
        : pageData.back === "__cover__"
        ? createCoverTexture()
        : createCardTexture(pageData.back as Card[]);

    return { frontTexture, backTexture };
  });
}

interface BookProps {
  cards: Card[];
}

export const Book = ({ cards }: BookProps) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const goToPage = () => {
      setDelayedPage((prev) => {
        if (page === prev) return prev;
        timeout = setTimeout(goToPage, Math.abs(page - prev) > 2 ? 50 : 150);
        return page > prev ? prev + 1 : prev - 1;
      });
    };
    goToPage();
    return () => clearTimeout(timeout);
  }, [page]);

  const pages = useMemo(() => buildPages(cards), [cards]);
  const textures = useMemo(() => resolveTextures(pages), [pages]);

  return (
    <group rotation-y={-Math.PI / 2}>
      {pages.map((_, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          frontTexture={textures[index].frontTexture}
          backTexture={textures[index].backTexture}
        />
      ))}
    </group>
  );
};
