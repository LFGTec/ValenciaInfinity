import { useState } from "react";
import { ChevronLeft, Eye, Star, Info } from "lucide-react";
import type { Match } from "@/pages/TicketsPage";
import type { Sector } from "@/pages/TicketsPage";
import type { Seat } from "@/pages/TicketsPage";

// SCREEN 3 - Seat Selection
export function SeatSelection({
  match,
  sector,
  onBack,
  onSelectSeat,
}: {
  match: Match;
  sector: Sector;
  onBack: () => void;
  onSelectSeat: (seat: Seat) => void;
}) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Generate seats grid
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 12;
  const seats: Seat[][] = rows.map((row) =>
    Array.from({ length: seatsPerRow }, (_, i) => ({
      row,
      number: i + 1,
      status: Math.random() > 0.3 ? "available" : "taken",
    })),
  );

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "taken") return;
    setSelectedSeat(seat);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                {sector.name}
              </div>
              <div className="text-xs text-gray-600">
                Categoría {sector.category} • €{sector.price}
              </div>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Selecciona tu asiento
            </h2>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg shadow-sm"></div>
                <span className="text-sm text-gray-700">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg shadow-sm"></div>
                <span className="text-sm text-gray-700">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EE3224] rounded-lg shadow-sm"></div>
                <span className="text-sm text-gray-700">Seleccionado</span>
              </div>
            </div>

            {/* Stage/Field indicator */}
            <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-2 border-green-300 rounded-t-lg py-4 mb-6 text-center shadow-sm">
              <span className="text-green-700 font-bold text-sm">
                ⚽ CAMPO DE JUEGO
              </span>
            </div>

            {/* Seats Grid */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
              <div className="space-y-3">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <div className="w-8 text-center font-bold text-gray-600 text-sm">
                      {rows[rowIndex]}
                    </div>
                    <div className="flex-1 flex gap-2">
                      {row.map((seat, seatIndex) => {
                        const isSelected =
                          selectedSeat?.row === seat.row &&
                          selectedSeat?.number === seat.number;
                        return (
                          <button
                            key={seatIndex}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === "taken"}
                            className={`flex-1 aspect-square rounded-lg font-bold text-xs transition-all shadow-sm ${
                              isSelected
                                ? "bg-[#EE3224] text-white scale-110 shadow-lg shadow-[#EE3224]/50"
                                : seat.status === "available"
                                  ? "bg-green-500 text-white hover:bg-green-400 hover:scale-105"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View Preview & Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Field View Preview */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Eye size={20} />
                    <span className="font-bold">Vista desde el asiento</span>
                  </div>
                </div>

                {selectedSeat ? (
                  <div>
                    {/* Field perspective simulation */}
                    <div className="relative h-48 bg-gradient-to-b from-gray-100 to-green-50 flex items-end justify-center p-6">
                      <div className="w-full h-24 bg-gradient-to-t from-green-400/40 to-green-300/20 rounded-lg border-2 border-green-400 relative shadow-inner">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-green-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50">
                      <div className="text-sm text-gray-600 mb-2">
                        Fila {selectedSeat.row} · Asiento {selectedSeat.number}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-amber-500" />
                        <span className="text-amber-600 font-bold text-sm">
                          Excelente
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Info size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Selecciona un asiento para ver la vista
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedSeat && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-black text-gray-900 mb-4">
                    Resumen
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sector</span>
                      <span className="text-gray-900 font-bold">
                        {sector.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fila</span>
                      <span className="text-gray-900 font-bold">
                        {selectedSeat.row}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Asiento</span>
                      <span className="text-gray-900 font-bold">
                        {selectedSeat.number}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-gray-600 font-bold">Precio</span>
                      <span className="text-2xl font-black text-gray-900">
                        €{sector.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSeat(selectedSeat)}
                    className="w-full px-6 py-4 bg-[#EE3224] text-white rounded-xl font-bold hover:bg-[#d92b1e] transition-all shadow-lg"
                  >
                    Reservar asiento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
