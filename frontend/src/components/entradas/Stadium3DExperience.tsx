import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { ChevronLeft, Eye, Users } from "lucide-react";
import type { Match, Sector, Seat } from "@/pages/TicketsPage";

// ─── Constants ───────────────────────────────────────────────────────────────

const PI = Math.PI;
const INNER_R = 24;
const OUTER_R = 48;
const STAND_H = 20;
const OVAL_Z = 1.45;

// Sector arc angles (radians from +X axis, counterclockwise from above)
const SECTOR_ARCS: Record<string, { thetaStart: number; thetaLength: number; upperTier?: boolean }> = {
  preferencia:    { thetaStart: -1.05,         thetaLength: 2.1 },
  "fondo-norte":  { thetaStart: PI * 0.5 - 0.4, thetaLength: 0.8 },
  tribuna:        { thetaStart: PI - 1.05,      thetaLength: 2.1 },
  "fondo-sur":    { thetaStart: PI * 1.5 - 0.4, thetaLength: 0.8 },
  "fondos-altos": { thetaStart: PI * 1.5 - 0.52, thetaLength: 1.04, upperTier: true },
};

const SECTOR_COLORS: Record<string, string> = {
  tribuna:        "#3B82F6",
  preferencia:    "#60A5FA",
  "fondo-norte":  "#10B981",
  "fondo-sur":    "#10B981",
  "fondos-altos": "#F59E0B",
};

// ─── Seat Layout Config ───────────────────────────────────────────────────────

interface SectorLayout {
  rows: string[];
  seatsPerRow: number;
  origin: [number, number, number];
  rowStep: [number, number, number];
  seatStep: [number, number, number];
  detailCam: [number, number, number];
  detailTarget: [number, number, number];
}

const SEAT_LAYOUTS: Record<string, SectorLayout> = {
  tribuna: {
    rows: ["A", "B", "C", "D", "E", "F"],
    seatsPerRow: 12,
    origin: [-24.5, 1.5, -11],
    rowStep: [-2.2, 2.2, 0],
    seatStep: [0, 0, 2],
    detailCam: [-68, 28, 0],
    detailTarget: [-30, 7, 0],
  },
  preferencia: {
    rows: ["A", "B", "C", "D", "E", "F"],
    seatsPerRow: 12,
    origin: [24.5, 1.5, -11],
    rowStep: [2.2, 2.2, 0],
    seatStep: [0, 0, 2],
    detailCam: [68, 28, 0],
    detailTarget: [30, 7, 0],
  },
  "fondo-norte": {
    rows: ["A", "B", "C", "D"],
    seatsPerRow: 8,
    origin: [-7, 1.5, -33],
    rowStep: [0, 2.2, -2.2],
    seatStep: [2, 0, 0],
    detailCam: [0, 26, -74],
    detailTarget: [0, 7, -40],
  },
  "fondo-sur": {
    rows: ["A", "B", "C", "D"],
    seatsPerRow: 8,
    origin: [-7, 1.5, 33],
    rowStep: [0, 2.2, 2.2],
    seatStep: [2, 0, 0],
    detailCam: [0, 26, 74],
    detailTarget: [0, 7, 40],
  },
  "fondos-altos": {
    rows: ["A", "B", "C", "D", "E"],
    seatsPerRow: 10,
    origin: [-9, 14, 38],
    rowStep: [0, 2.5, 2.5],
    seatStep: [2, 0, 0],
    detailCam: [0, 45, 92],
    detailTarget: [0, 22, 50],
  },
};

// ─── Types ───────────────────────────────────────────────────────────────────

type StadiumMode = "overview" | "seats" | "seat-view";

interface SeatInfo {
  row: string;
  number: number;
  status: "available" | "taken";
  position: [number, number, number];
}

// ─── Seeded random (stable seats on re-render) ────────────────────────────────

function makeSeededRand(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Camera rig (lerp camera + controls target) ───────────────────────────────

function CameraRig({
  camRef,
  lookRef,
  controlsRef,
}: {
  camRef: React.MutableRefObject<THREE.Vector3>;
  lookRef: React.MutableRefObject<THREE.Vector3>;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.lerp(camRef.current, 0.07);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookRef.current, 0.07);
      controlsRef.current.update();
    }
  });
  return null;
}

// ─── Football Field ───────────────────────────────────────────────────────────

function Field() {
  const lw = 0.28; // line width
  return (
    <group>
      {/* Base grass */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[34, 52]} />
        <meshLambertMaterial color="#2d8a3e" />
      </mesh>
      {/* Stripe pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} rotation={[-PI / 2, 0, 0]} position={[0, 0.06, -24 + i * 6.5 + 3.25]}>
          <planeGeometry args={[34, 5.5]} />
          <meshLambertMaterial color="#339944" transparent opacity={0.45} />
        </mesh>
      ))}
      {/* Touchlines */}
      {([-17, 17] as number[]).map((x) => (
        <mesh key={x} rotation={[-PI / 2, 0, 0]} position={[x, 0.08, 0]}>
          <planeGeometry args={[lw, 52]} />
          <meshLambertMaterial color="white" />
        </mesh>
      ))}
      {([-26, 26] as number[]).map((z) => (
        <mesh key={z} rotation={[-PI / 2, 0, 0]} position={[0, 0.08, z]}>
          <planeGeometry args={[34, lw]} />
          <meshLambertMaterial color="white" />
        </mesh>
      ))}
      {/* Halfway line */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[34, lw]} />
        <meshLambertMaterial color="white" />
      </mesh>
      {/* Center circle */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <ringGeometry args={[9, 9 + lw, 48]} />
        <meshLambertMaterial color="white" />
      </mesh>
      {/* Center spot */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshLambertMaterial color="white" />
      </mesh>
      {/* Penalty areas */}
      {([-22, 22] as number[]).map((z) => {
        const dir = z < 0 ? 1 : -1;
        return (
          <group key={z}>
            {/* Big box */}
            {([-10, 10] as number[]).map((x) => (
              <mesh key={x} rotation={[-PI / 2, 0, 0]} position={[x, 0.08, z + dir * 8]}>
                <planeGeometry args={[lw, 16]} />
                <meshLambertMaterial color="white" />
              </mesh>
            ))}
            <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.08, z + dir * 16]}>
              <planeGeometry args={[20, lw]} />
              <meshLambertMaterial color="white" />
            </mesh>
            {/* Small box */}
            {([-5.5, 5.5] as number[]).map((x) => (
              <mesh key={x} rotation={[-PI / 2, 0, 0]} position={[x, 0.08, z + dir * 3]}>
                <planeGeometry args={[lw, 6]} />
                <meshLambertMaterial color="white" />
              </mesh>
            ))}
            <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.08, z + dir * 6]}>
              <planeGeometry args={[11, lw]} />
              <meshLambertMaterial color="white" />
            </mesh>
            {/* Penalty spot */}
            <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.09, z + dir * 11]}>
              <circleGeometry args={[0.35, 12]} />
              <meshLambertMaterial color="white" />
            </mesh>
            {/* Goal */}
            <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.08, z]}>
              <planeGeometry args={[7.3, lw]} />
              <meshLambertMaterial color="white" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Stadium Stand Arc ────────────────────────────────────────────────────────

function StandSector({
  sectorId,
  color,
  thetaStart,
  thetaLength,
  isUpperTier,
  hovered,
  selected,
  onClick,
  onHover,
}: {
  sectorId: string;
  color: string;
  thetaStart: number;
  thetaLength: number;
  isUpperTier?: boolean;
  hovered: boolean;
  selected: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}) {
  const yBase = isUpperTier ? STAND_H * 0.7 : 0;
  const h = isUpperTier ? STAND_H * 0.35 : STAND_H;
  const activeColor = hovered ? "#ffffff" : color;
  const opacity = hovered ? 0.95 : selected ? 1 : 0.8;

  return (
    <mesh
      position={[0, yBase, 0]}
      onClick={onClick}
      onPointerEnter={() => onHover(sectorId)}
      onPointerLeave={() => onHover(null)}
      castShadow
    >
      <cylinderGeometry
        args={[OUTER_R, INNER_R, h, 64, 1, true, thetaStart, thetaLength]}
      />
      <meshLambertMaterial
        color={activeColor}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Floodlight ───────────────────────────────────────────────────────────────

function Floodlight({ position }: { position: [number, number, number] }) {
  const [px, py, pz] = position;
  return (
    <group>
      <mesh position={[px, py / 2, pz]}>
        <cylinderGeometry args={[0.4, 0.6, py, 6]} />
        <meshLambertMaterial color="#888888" />
      </mesh>
      <pointLight position={position} intensity={0.6} distance={130} color="#fffbe8" />
      <mesh position={position}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshBasicMaterial color="#ffffcc" />
      </mesh>
    </group>
  );
}

// ─── Individual Seat Mesh ─────────────────────────────────────────────────────

function SeatMesh({
  position,
  status,
  isSelected,
  onClick,
}: {
  position: [number, number, number];
  status: "available" | "taken";
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = isSelected
    ? "#EE3224"
    : status === "taken"
    ? "#4b5563"
    : hovered
    ? "#4ade80"
    : "#16a34a";

  return (
    <mesh
      position={position}
      scale={isSelected ? 1.35 : 1}
      onClick={status === "taken" ? undefined : onClick}
      onPointerEnter={() => status !== "taken" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[1.1, 0.55, 1.1]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

// ─── Full 3D Scene ────────────────────────────────────────────────────────────

function StadiumScene({
  mode,
  sectors,
  selectedSectorId,
  hoveredSectorId,
  seats,
  selectedSeat,
  onSelectSector,
  onHoverSector,
  onSelectSeat,
  camRef,
  lookRef,
  controlsRef,
}: {
  mode: StadiumMode;
  sectors: Sector[];
  selectedSectorId: string | null;
  hoveredSectorId: string | null;
  seats: SeatInfo[][];
  selectedSeat: SeatInfo | null;
  onSelectSector: (id: string) => void;
  onHoverSector: (id: string | null) => void;
  onSelectSeat: (s: SeatInfo) => void;
  camRef: React.MutableRefObject<THREE.Vector3>;
  lookRef: React.MutableRefObject<THREE.Vector3>;
  controlsRef: React.RefObject<any>;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[20, 80, 30]} intensity={0.7} castShadow />
      <Floodlight position={[-46, 30, -64]} />
      <Floodlight position={[46, 30, -64]} />
      <Floodlight position={[-46, 30, 64]} />
      <Floodlight position={[46, 30, 64]} />

      {/* Ground plane */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshLambertMaterial color="#0d0d1a" />
      </mesh>

      {/* Field */}
      <Field />

      {/* Stadium stands — scaled to oval */}
      <group scale={[1, 1, OVAL_Z]}>
        {sectors.map((sector) => {
          const arc = SECTOR_ARCS[sector.id];
          if (!arc) return null;
          return (
            <StandSector
              key={sector.id}
              sectorId={sector.id}
              color={SECTOR_COLORS[sector.id] ?? "#888"}
              thetaStart={arc.thetaStart}
              thetaLength={arc.thetaLength}
              isUpperTier={arc.upperTier}
              hovered={hoveredSectorId === sector.id}
              selected={selectedSectorId === sector.id}
              onClick={() => onSelectSector(sector.id)}
              onHover={onHoverSector}
            />
          );
        })}
      </group>

      {/* Individual seats (only in 'seats' mode) */}
      {mode === "seats" &&
        seats.map((row) =>
          row.map((seat) => (
            <SeatMesh
              key={`${seat.row}${seat.number}`}
              position={seat.position}
              status={seat.status}
              isSelected={
                selectedSeat?.row === seat.row &&
                selectedSeat?.number === seat.number
              }
              onClick={() => onSelectSeat(seat)}
            />
          ))
        )}

      {/* Camera rig */}
      <CameraRig camRef={camRef} lookRef={lookRef} controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        enabled={mode !== "seat-view"}
        minDistance={15}
        maxDistance={160}
        maxPolarAngle={PI / 2.1}
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  match: Match;
  sectors: Sector[];
  onBack: () => void;
  onSelectSeat: (sector: Sector, seat: Seat) => void;
}

export function Stadium3DExperience({ match, sectors, onBack, onSelectSeat }: Props) {
  const [mode, setMode] = useState<StadiumMode>("overview");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);

  const controlsRef = useRef<any>(null);
  const camRef = useRef(new THREE.Vector3(0, 90, 58));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  // Stable seat grid per sector (seeded random avoids re-randomizing)
  const seats = useMemo<SeatInfo[][]>(() => {
    if (!selectedSectorId) return [];
    const layout = SEAT_LAYOUTS[selectedSectorId];
    if (!layout) return [];
    const rand = makeSeededRand(
      selectedSectorId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    );
    return layout.rows.map((row, ri) =>
      Array.from({ length: layout.seatsPerRow }, (_, si) => ({
        row,
        number: si + 1,
        status: rand() > 0.3 ? "available" : ("taken" as const),
        position: [
          layout.origin[0] + ri * layout.rowStep[0] + si * layout.seatStep[0],
          layout.origin[1] + ri * layout.rowStep[1] + si * layout.seatStep[1],
          layout.origin[2] + ri * layout.rowStep[2] + si * layout.seatStep[2],
        ],
      }))
    );
  }, [selectedSectorId]);

  const handleSelectSector = useCallback((sectorId: string) => {
    const layout = SEAT_LAYOUTS[sectorId];
    if (!layout) return;
    setSelectedSectorId(sectorId);
    setSelectedSeat(null);
    setMode("seats");
    camRef.current = new THREE.Vector3(...layout.detailCam);
    lookRef.current = new THREE.Vector3(...layout.detailTarget);
  }, []);

  const handleSelectSeat = useCallback((seat: SeatInfo) => {
    setSelectedSeat(seat);
  }, []);

  const handleViewFromSeat = useCallback(() => {
    if (!selectedSeat) return;
    const [sx, sy, sz] = selectedSeat.position;
    camRef.current = new THREE.Vector3(sx, sy + 1.6, sz);
    lookRef.current = new THREE.Vector3(0, 2, 0);
    setMode("seat-view");
  }, [selectedSeat]);

  const handleBackToOverview = useCallback(() => {
    setMode("overview");
    setSelectedSectorId(null);
    setSelectedSeat(null);
    camRef.current = new THREE.Vector3(0, 90, 58);
    lookRef.current = new THREE.Vector3(0, 0, 0);
  }, []);

  const handleBackToSeats = useCallback(() => {
    if (!selectedSectorId) return;
    const layout = SEAT_LAYOUTS[selectedSectorId];
    if (layout) {
      camRef.current = new THREE.Vector3(...layout.detailCam);
      lookRef.current = new THREE.Vector3(...layout.detailTarget);
    }
    setMode("seats");
  }, [selectedSectorId]);

  const handleConfirm = useCallback(() => {
    if (!selectedSeat || !selectedSectorId) return;
    const sector = sectors.find((s) => s.id === selectedSectorId);
    if (!sector) return;
    onSelectSeat(sector, {
      row: selectedSeat.row,
      number: selectedSeat.number,
      status: "selected",
    });
  }, [selectedSeat, selectedSectorId, sectors, onSelectSeat]);

  const selectedSector = sectors.find((s) => s.id === selectedSectorId) ?? null;
  const hoveredSector = sectors.find((s) => s.id === hoveredSectorId) ?? null;

  const backLabel =
    mode === "overview"
      ? "Partidos"
      : mode === "seats"
      ? "Vista general"
      : "Elegir asiento";

  const backAction =
    mode === "overview"
      ? onBack
      : mode === "seats"
      ? handleBackToOverview
      : handleBackToSeats;

  const hint =
    mode === "overview"
      ? "Arrastra para rotar · Click en un sector"
      : mode === "seats"
      ? "Click en un asiento verde para seleccionarlo"
      : "Vista desde tu asiento";

  return (
    <div className="relative w-full h-screen bg-[#080814] overflow-hidden">
      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/85 to-transparent px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={backAction}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-bold"
          >
            <ChevronLeft size={20} />
            {backLabel}
          </button>
          <div className="text-center">
            <div className="text-white font-black text-sm">
              {match.homeTeam} vs {match.awayTeam}
            </div>
            <div className="text-gray-400 text-xs">
              {new Date(match.date).toLocaleDateString("es-ES")} · {match.time}h ·{" "}
              {match.stadium}
            </div>
          </div>
          <div className="text-xs text-gray-500 hidden md:block">{hint}</div>
        </div>
      </div>

      {/* ── 3D Canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, 90, 58], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at center, #0d1030 0%, #04040f 100%)" }}
      >
        <StadiumScene
          mode={mode}
          sectors={sectors}
          selectedSectorId={selectedSectorId}
          hoveredSectorId={hoveredSectorId}
          seats={seats}
          selectedSeat={selectedSeat}
          onSelectSector={handleSelectSector}
          onHoverSector={setHoveredSectorId}
          onSelectSeat={handleSelectSeat}
          camRef={camRef}
          lookRef={lookRef}
          controlsRef={controlsRef}
        />
      </Canvas>

      {/* ── OVERVIEW: Hover tooltip ── */}
      {mode === "overview" && hoveredSector && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-black/92 text-white rounded-2xl px-6 py-4 min-w-56 shadow-2xl border border-white/10 text-center">
            <div className="text-lg font-black mb-1">{hoveredSector.name}</div>
            <div className="text-[#EE3224] font-black text-2xl mb-1">€{hoveredSector.price}</div>
            <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
              <Users size={12} />
              {hoveredSector.available} disponibles
            </div>
            <div className="text-gray-500 text-xs mt-2">Click para ver asientos</div>
          </div>
        </div>
      )}

      {/* ── OVERVIEW: Sector legend ── */}
      {mode === "overview" && !hoveredSector && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-wrap gap-2 justify-center px-4">
          {sectors.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 bg-black/75 text-white rounded-xl px-3 py-2 text-xs border border-white/10 cursor-pointer hover:border-white/30 transition-colors"
              onClick={() => handleSelectSector(s.id)}
            >
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SECTOR_COLORS[s.id] }} />
              <span className="font-bold">{s.name}</span>
              <span className="text-gray-400">€{s.price}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── SEATS MODE: Right panel ── */}
      {mode === "seats" && selectedSector && (
        <div className="absolute top-20 right-4 z-20 w-64">
          <div className="bg-black/92 text-white rounded-2xl p-5 shadow-2xl border border-white/10">
            {/* Sector info */}
            <div
              className="w-full h-1 rounded-full mb-4"
              style={{ backgroundColor: SECTOR_COLORS[selectedSector.id] }}
            />
            <div className="text-xl font-black mb-3">{selectedSector.name}</div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Categoría</span>
                <span className="font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                  {selectedSector.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Precio</span>
                <span className="font-black text-[#EE3224] text-xl">€{selectedSector.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Disponibles</span>
                <span className="text-green-400 font-bold text-xs flex items-center gap-1">
                  <Users size={11} /> {selectedSector.available}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs mb-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600" />
                <span className="text-gray-300">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-600" />
                <span className="text-gray-300">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#EE3224]" />
                <span className="text-gray-300">Seleccionado</span>
              </div>
            </div>

            {/* Selected seat */}
            {selectedSeat ? (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="text-xs text-gray-400">Asiento seleccionado</div>
                <div className="text-2xl font-black">
                  Fila {selectedSeat.row} · #{selectedSeat.number}
                </div>
                <button
                  onClick={handleViewFromSeat}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Eye size={15} />
                  Ver desde aquí
                </button>
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 bg-[#EE3224] hover:bg-[#d92b1e] rounded-xl font-bold transition-all"
                >
                  Reservar →
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-xs text-center border-t border-white/10 pt-4">
                Haz click en un asiento verde
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── SEAT VIEW: Bottom confirm bar ── */}
      {mode === "seat-view" && selectedSeat && selectedSector && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="max-w-xl mx-auto bg-black/95 text-white rounded-2xl p-5 shadow-2xl border border-white/10">
            <div className="text-center mb-4">
              <div className="text-base font-black">Vista desde tu asiento</div>
              <div className="text-gray-400 text-xs mt-1">
                {selectedSector.name} · Fila {selectedSeat.row} · Asiento #{selectedSeat.number} ·{" "}
                <span className="text-[#EE3224] font-bold">€{selectedSector.price}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToSeats}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all"
              >
                Cambiar asiento
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] py-3 bg-[#EE3224] hover:bg-[#d92b1e] rounded-xl font-bold transition-all"
              >
                ¡Me gusta! Reservar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEAT VIEW: Info badge ── */}
      {mode === "seat-view" && (
        <div className="absolute top-20 left-4 z-20">
          <div className="bg-black/80 text-white rounded-xl px-3 py-2 text-xs border border-white/10">
            <Eye size={12} className="inline mr-1 text-[#EE3224]" />
            Vista inmersiva desde el asiento
          </div>
        </div>
      )}
    </div>
  );
}
