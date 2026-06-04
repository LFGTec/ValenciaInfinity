import { Users, Info, ChevronLeft } from "lucide-react";
import { useState } from "react";
import type { Match } from "@/pages/TicketsPage";
import type { Sector } from "@/pages/TicketsPage";

// SCREEN 2 - Stadium Seat Map
export function StadiumSeatMap({
  match,
  sectors,
  onBack,
  onSelectSector,
}: {
  match: Match;
  sectors: Sector[];
  onBack: () => void;
  onSelectSector: (sector: Sector) => void;
}) {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const currentSector = sectors.find(
    (s) => s.id === (hoveredSector || selectedSectorId),
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-bold">Volver</span>
            </button>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">
                {match.homeTeam} vs {match.awayTeam}
              </div>
              <div className="text-xs text-gray-600">
                {new Date(match.date).toLocaleDateString("es-ES")} •{" "}
                {match.time}h
              </div>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stadium Map */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Mapa del Estadio
            </h2>

            {/* Stadium SVG */}
            <div className="relative aspect-[4/3] bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl">
              {/* Field */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg border-2 border-green-500/30">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-green-500/30 rounded-full"></div>
              </div>

              {/* Sectors */}
              {/* Tribuna (Top) */}
              <button
                onMouseEnter={() => setHoveredSector("tribuna")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("tribuna")}
                className={`absolute top-[5%] left-1/2 transform -translate-x-1/2 w-[70%] h-[15%] rounded-t-full transition-all ${
                  hoveredSector === "tribuna" || selectedSectorId === "tribuna"
                    ? "bg-blue-500/40 border-4 border-blue-400"
                    : "bg-blue-500/20 border-2 border-blue-500/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-sm">Tribuna</span>
              </button>

              {/* Preferencia (Top sides) */}
              <button
                onMouseEnter={() => setHoveredSector("preferencia")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("preferencia")}
                className={`absolute top-[20%] left-[10%] w-[30%] h-[15%] rounded-lg transition-all ${
                  hoveredSector === "preferencia" ||
                  selectedSectorId === "preferencia"
                    ? "bg-sky-400/40 border-4 border-sky-300"
                    : "bg-sky-400/20 border-2 border-sky-400/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-xs">
                  Preferencia
                </span>
              </button>

              <button
                onMouseEnter={() => setHoveredSector("preferencia")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("preferencia")}
                className={`absolute top-[20%] right-[10%] w-[30%] h-[15%] rounded-lg transition-all ${
                  hoveredSector === "preferencia" ||
                  selectedSectorId === "preferencia"
                    ? "bg-sky-400/40 border-4 border-sky-300"
                    : "bg-sky-400/20 border-2 border-sky-400/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-xs">
                  Preferencia
                </span>
              </button>

              {/* Fondo Norte (Left) */}
              <button
                onMouseEnter={() => setHoveredSector("fondo-norte")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("fondo-norte")}
                className={`absolute left-[5%] top-1/2 transform -translate-y-1/2 w-[15%] h-[50%] rounded-l-full transition-all ${
                  hoveredSector === "fondo-norte" ||
                  selectedSectorId === "fondo-norte"
                    ? "bg-green-500/40 border-4 border-green-400"
                    : "bg-green-500/20 border-2 border-green-500/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-xs transform -rotate-90 inline-block">
                  F. Norte
                </span>
              </button>

              {/* Fondo Sur (Right) */}
              <button
                onMouseEnter={() => setHoveredSector("fondo-sur")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("fondo-sur")}
                className={`absolute right-[5%] top-1/2 transform -translate-y-1/2 w-[15%] h-[50%] rounded-r-full transition-all ${
                  hoveredSector === "fondo-sur" ||
                  selectedSectorId === "fondo-sur"
                    ? "bg-green-500/40 border-4 border-green-400"
                    : "bg-green-500/20 border-2 border-green-500/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-xs transform rotate-90 inline-block">
                  F. Sur
                </span>
              </button>

              {/* Fondos Altos (Bottom) */}
              <button
                onMouseEnter={() => setHoveredSector("fondos-altos")}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSectorId("fondos-altos")}
                className={`absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-[70%] h-[15%] rounded-b-full transition-all ${
                  hoveredSector === "fondos-altos" ||
                  selectedSectorId === "fondos-altos"
                    ? "bg-amber-500/40 border-4 border-amber-400"
                    : "bg-amber-500/20 border-2 border-amber-500/50"
                }`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white font-bold text-sm">
                  Fondos Altos
                </span>
              </button>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {sectors.map((sector) => (
                <div
                  key={sector.id}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: sector.color }}
                  ></div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {sector.name}
                    </div>
                    <div className="text-xs text-gray-600">€{sector.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Info Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {currentSector ? (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">
                    {currentSector.name}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Categoría</span>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-200">
                        {currentSector.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Precio</span>
                      <span className="text-2xl font-black text-gray-900">
                        €{currentSector.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Disponibles</span>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-green-600" />
                        <span className="font-bold text-green-600">
                          {currentSector.available}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSector(currentSector)}
                    className="w-full px-6 py-4 bg-[#EE3224] text-white rounded-xl font-bold hover:bg-[#d92b1e] transition-all shadow-lg"
                  >
                    Ver asientos
                  </button>
                </div>
              ) : (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center shadow-xl">
                  <Info size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    Selecciona un sector en el mapa para ver más información
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
