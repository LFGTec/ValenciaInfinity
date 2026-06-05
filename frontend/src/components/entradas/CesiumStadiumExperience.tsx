import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Eye, MapPin, Users, Trophy, Ticket } from "lucide-react";
import type { Match, Sector, Seat } from "@/pages/TicketsPage";
import { StepIndicator } from "./StepIndicator";
import { useTicketStore } from "./store/useTicketStore";
import { ZONE_COLORS, ZONE_PRICES, ZONE_CAMERAS } from "./data/seat";
import type { Zone, Seat as CesiumSeat } from "./data/seat";
import {
  setCesiumViewer,
  flyToZone,
  flyToDefault,
  setSeatViewMode,
  registerSeatViewCallback,
  initHomeControls,
} from "./cesiumController";
import ZonePanel from "./ZonePanel";

const CESIUM_TOKEN = import.meta.env.VITE_CESIUM_TOKEN as string;

const ZONES: Zone[] = ["VIP", "Preferente", "General", "Gol"];

const ZONE_TO_SECTOR: Record<Zone, Sector> = {
  VIP: {
    id: "vip",
    name: "VIP",
    category: "A",
    color: "#B87333",
    price: 85,
    available: 45,
  },
  Preferente: {
    id: "preferente",
    name: "Preferente",
    category: "B",
    color: "#378ADD",
    price: 55,
    available: 120,
  },
  General: {
    id: "general",
    name: "General",
    category: "C",
    color: "#639922",
    price: 35,
    available: 230,
  },
  Gol: {
    id: "gol",
    name: "Gol",
    category: "D",
    color: "#D85A30",
    price: 20,
    available: 340,
  },
};

interface CesiumDivEl extends HTMLDivElement {
  _loaded?: boolean;
}

interface Props {
  match: Match;
  stepNumber: number;
  onBack: () => void;
  onSelectSeat: (sector: Sector, seat: Seat) => void;
}

export function CesiumStadiumExperience({
  match,
  stepNumber,
  onBack,
  onSelectSeat,
}: Props) {
  const { selectedZone, setSelectedZone } = useTicketStore();
  const cesiumRef = useRef<CesiumDivEl>(null);
  const [seatView, setSeatView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cesiumRef.current || cesiumRef.current._loaded) return;
    cesiumRef.current._loaded = true;

    async function initViewer(Cesium: any) {
      if (!cesiumRef.current) return;
      Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

      const viewer = new Cesium.Viewer(cesiumRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        shadows: false,
        targetFramesPerSecond: 30,
      });

      setCesiumViewer(viewer);
      registerSeatViewCallback((active) => setSeatView(active));
      initHomeControls();

      viewer.shadows = false;
      viewer.scene.shadowMap.enabled = false;
      viewer.scene.shadowMap.softShadows = false;
      viewer.scene.fog.enabled = false;
      viewer.scene.skyAtmosphere.show = false;
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date("2026-06-15T10:00:00Z"),
      );
      viewer.clock.shouldAnimate = false;
      viewer.scene.logarithmicDepthBuffer = true;

      const ctrl = viewer.scene.screenSpaceCameraController;
      ctrl.enableCollisionDetection = true;
      ctrl.minimumZoomDistance = 8;
      ctrl.maximumZoomDistance = 2000;

      try {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset();
        tileset.maximumScreenSpaceError = 4;
        tileset.shadows = Cesium.ShadowMode.DISABLED;
        tileset.dynamicScreenSpaceError = true;
        viewer.scene.primitives.add(tileset);
      } catch (e) {
        console.log("Error cargando tiles:", e);
      }

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-0.36102, 39.47487, 900),
        orientation: {
          heading: Cesium.Math.toRadians(99),
          pitch: Cesium.Math.toRadians(-56),
          roll: 0,
        },
      });
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-0.36102, 39.47487, 431),
        orientation: {
          heading: Cesium.Math.toRadians(99),
          pitch: Cesium.Math.toRadians(-56),
          roll: 0,
        },
        duration: 2.5,
        easingFunction: Cesium.EasingFunction.QUARTIC_OUT,
        complete: () => setLoading(false),
      });
    }

    const win = window as any;
    if (win.Cesium) {
      initViewer(win.Cesium);
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Widgets/widgets.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Cesium.js";
      script.async = true;
      script.onload = () => initViewer(win.Cesium);
      document.head.appendChild(script);
    }
  }, []);

  function handleZoneSelect(zone: Zone) {
    if (selectedZone === zone) {
      setSelectedZone(null);
      flyToDefault();
    } else {
      setSelectedZone(zone);
      flyToZone(ZONE_CAMERAS[zone]);
    }
  }

  function handleConfirmSeat(cesiumSeat: CesiumSeat) {
    const sector = ZONE_TO_SECTOR[cesiumSeat.zone];
    const seat: Seat = {
      row: cesiumSeat.row,
      number: cesiumSeat.col,
      status: "selected",
    };
    onSelectSeat(sector, seat);
  }

  function handleBack() {
    useTicketStore.getState().goHome();
    flyToDefault();
    onBack();
  }

  const dateFormatted = new Date(match.date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-vcf-orange/5 transition-colors font-bold flex-shrink-0 cursor-pointer hover:-translate-y-1"
            >
              <ChevronLeft size={20} className="hover:text-black" />
              Volver
            </button>
            <div className="text-center">
              <div className="text-sm font-black text-gray-900">
                {match.homeTeam} vs {match.awayTeam}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(match.date).toLocaleDateString("es-ES")} ·{" "}
                {match.time}h · {match.stadium}
              </div>
            </div>
            <StepIndicator current={stepNumber} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Título ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-black/20 text-black rounded-lg text-xs font-bold border border-gray-400">
              {match.competition}
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-2">
            Selecciona tu zona
          </h1>
          <p className="text-gray-500 text-base">
            Explora Mestalla en 3D · Elige zona → asiento → pago
          </p>
        </div>

        {/* ── Selector de zonas ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedZone(null);
                flyToDefault();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer hover:-translate-y-1 ${
                !selectedZone
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900  "
              }`}
            >
              ⌂ Vista general
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Zona
            </span>

            {ZONES.map((zone) => (
              <button
                key={zone}
                onClick={() => handleZoneSelect(zone)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer hover:-translate-y-1 ${
                  selectedZone === zone
                    ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 "
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: ZONE_COLORS[zone] }}
                />
                {zone}
                <span className="text-xs font-normal text-gray-400">
                  {ZONE_PRICES[zone]}€
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Vista Cesium + Panel zona ── */}
        <div
          className={`grid gap-6 ${selectedZone ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {/* Mapa 3D */}
          <div className={selectedZone ? "lg:col-span-2" : ""}>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl relative group">
              {/* Viewer Cesium */}
              <div
                ref={cesiumRef}
                className="w-full h-[520px] block"
                style={{ background: "#000b18" }}
              />

              {/* ── Overlay de carga ── */}
              <div
                className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-950 transition-opacity duration-700 ${
                  loading ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Puntos animados */}
                <div className="flex gap-2 mb-5">
                  <div className="w-3 h-3 bg-[#EE3224] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-3 h-3 bg-[#EE3224] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-3 h-3 bg-[#EE3224] rounded-full animate-bounce" />
                </div>

                <p className="text-white font-black text-xl mb-1">
                  Cargando Mestalla en 3D
                </p>
                <p className="text-white/50 text-sm mb-8">
                  Preparando la vista del estadio…
                </p>

                {/* Info partido */}
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    {match.competition}
                  </div>
                  <div className="text-white font-black text-base">
                    {match.homeTeam}{" "}
                    <span className="text-white/40 font-light mx-1">vs</span>{" "}
                    {match.awayTeam}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    {dateFormatted} · {match.time}h · {match.stadium}
                  </div>
                </div>
              </div>

              {/* Banner modo asiento */}
              {seatView && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-2.5 z-20 shadow-lg whitespace-nowrap">
                  <Eye size={15} className="text-[#EE3224]" />
                  <span className="text-sm font-bold text-gray-900">
                    Vista desde tu asiento
                  </span>
                  <button
                    onClick={() => {
                      setSeatView(false);
                      setSeatViewMode(false);
                      flyToDefault();
                    }}
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-600 text-xs font-bold px-3 py-1 transition-colors"
                  >
                    Salir ×
                  </button>
                </div>
              )}

              {/* Overlay inferior del mapa */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)",
                  height: selectedZone ? "110px" : "200px",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pointer-events-none">
                {selectedZone ? (
                  <p className="text-white/80 text-sm font-medium">
                    📅 {dateFormatted} · {match.time}h
                  </p>
                ) : (
                  <>
                    <h2 className="text-white font-black text-2xl mb-1">
                      {match.homeTeam}{" "}
                      <span className="font-light text-white/60 text-xl mx-2">
                        vs
                      </span>{" "}
                      {match.awayTeam}
                    </h2>
                    <p className="text-white/70 text-sm mb-4">
                      📅 {dateFormatted} · {match.time}h &nbsp;·&nbsp; 📍{" "}
                      {match.stadium}
                    </p>
                    <p className="text-[#EE3224] text-sm font-bold bg-white/10 backdrop-blur-sm inline-block px-3 py-1.5 rounded-lg border border-white/20 pointer-events-auto">
                      ↑ Selecciona una zona para ver asientos disponibles
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Panel de zona */}
          {selectedZone && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ZonePanel onConfirmSeat={handleConfirmSeat} />
              </div>
            </div>
          )}
        </div>

        {/* ── Info cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-black" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Estadio</div>
              <div className="text-sm font-black text-gray-900">
                {match.stadium}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
              <Users size={18} className="text-black" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Aforo</div>
              <div className="text-sm font-black text-gray-900">49.430</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-black" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Competición</div>
              <div className="text-sm font-black text-gray-900">
                {match.competition}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
              <Ticket size={18} className="text-black" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Desde</div>
              <div className="text-lg font-black text-gray-900">20€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
