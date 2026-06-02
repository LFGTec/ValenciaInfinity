import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Users,
  Check,
  Lock,
  Download,
  Share2,
  Eye,
  Smartphone,
  CreditCard,
  Info,
  Star,
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  startingPrice: number;
  availability: "available" | "low" | "sold-out";
}

interface Sector {
  id: string;
  name: string;
  category: "A" | "B" | "C" | "D";
  color: string;
  price: number;
  available: number;
}

interface Seat {
  row: string;
  number: number;
  status: "available" | "taken" | "selected";
}

export function TicketPurchase() {
  const [currentStep, setCurrentStep] = useState<
    "matches" | "stadium" | "seats" | "checkout" | "success"
  >("matches");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const matches: Match[] = [
    {
      id: "1",
      homeTeam: "Valencia CF",
      awayTeam: "Real Madrid",
      competition: "La Liga",
      date: "2026-06-15",
      time: "21:00",
      stadium: "Mestalla",
      startingPrice: 45,
      availability: "available",
    },
    {
      id: "2",
      homeTeam: "Valencia CF",
      awayTeam: "FC Barcelona",
      competition: "La Liga",
      date: "2026-06-22",
      time: "18:30",
      stadium: "Mestalla",
      startingPrice: 65,
      availability: "low",
    },
    {
      id: "3",
      homeTeam: "Valencia CF",
      awayTeam: "Atlético Madrid",
      competition: "Copa del Rey",
      date: "2026-06-29",
      time: "21:30",
      stadium: "Mestalla",
      startingPrice: 35,
      availability: "available",
    },
  ];

  const sectors: Sector[] = [
    {
      id: "tribuna",
      name: "Tribuna Central",
      category: "A",
      color: "#3B82F6",
      price: 85,
      available: 45,
    },
    {
      id: "preferencia",
      name: "Preferencia",
      category: "B",
      color: "#60A5FA",
      price: 65,
      available: 120,
    },
    {
      id: "fondo-norte",
      name: "Fondo Norte",
      category: "C",
      color: "#10B981",
      price: 45,
      available: 230,
    },
    {
      id: "fondo-sur",
      name: "Fondo Sur",
      category: "C",
      color: "#10B981",
      price: 45,
      available: 180,
    },
    {
      id: "fondos-altos",
      name: "Fondos Altos",
      category: "D",
      color: "#F59E0B",
      price: 35,
      available: 340,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {currentStep === "matches" && (
        <MatchSelection
          matches={matches}
          onSelectMatch={(match) => {
            setSelectedMatch(match);
            setCurrentStep("stadium");
          }}
        />
      )}

      {currentStep === "stadium" && selectedMatch && (
        <StadiumSeatMap
          match={selectedMatch}
          sectors={sectors}
          onBack={() => setCurrentStep("matches")}
          onSelectSector={(sector) => {
            setSelectedSector(sector);
            setCurrentStep("seats");
          }}
        />
      )}

      {currentStep === "seats" && selectedMatch && selectedSector && (
        <SeatSelection
          match={selectedMatch}
          sector={selectedSector}
          onBack={() => setCurrentStep("stadium")}
          onSelectSeat={(seat) => {
            setSelectedSeat(seat);
            setCurrentStep("checkout");
          }}
        />
      )}

      {currentStep === "checkout" &&
        selectedMatch &&
        selectedSector &&
        selectedSeat && (
          <Checkout
            match={selectedMatch}
            sector={selectedSector}
            seat={selectedSeat}
            onBack={() => setCurrentStep("seats")}
            onConfirm={() => setCurrentStep("success")}
          />
        )}

      {currentStep === "success" &&
        selectedMatch &&
        selectedSector &&
        selectedSeat && (
          <TicketSuccess
            match={selectedMatch}
            sector={selectedSector}
            seat={selectedSeat}
            onDone={() => setCurrentStep("matches")}
          />
        )}
    </div>
  );
}

// SCREEN 1 - Match Selection
function MatchSelection({
  matches,
  onSelectMatch,
}: {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}) {
  const getAvailabilityBadge = (availability: Match["availability"]) => {
    switch (availability) {
      case "available":
        return (
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
            Disponible
          </span>
        );
      case "low":
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
            Últimas entradas
          </span>
        );
      case "sold-out":
        return (
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200">
            Agotado
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={vcfShield} alt="Valencia CF" className="w-16 h-16" />
          <div>
            <div className="text-2xl font-black text-gray-900">VALENCIA</div>
            <div className="text-sm font-bold text-[#EE3224]">INFINITY</div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
          Selecciona tu partido
        </h1>
        <p className="text-gray-600 text-lg">Próximos encuentros en Mestalla</p>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {matches.map((match) => (
          <div
            key={match.id}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#EE3224] transition-all duration-300 hover:shadow-2xl"
          >
            <div className="p-6">
              {/* Competition Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#EE3224]/10 text-[#EE3224] rounded-lg text-xs font-bold border border-[#EE3224]/20">
                  {match.competition}
                </span>
                {getAvailabilityBadge(match.availability)}
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-[#EE3224] rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <span className="font-black text-white">VCF</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    {match.homeTeam}
                  </div>
                </div>

                <div className="px-6">
                  <div className="text-2xl font-black text-gray-400">VS</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg border-2 border-gray-200">
                    <span className="font-black text-gray-700 text-xs">
                      {match.awayTeam
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    {match.awayTeam}
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(match.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{match.time}h</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{match.stadium}</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Desde</div>
                  <div className="text-2xl font-black text-gray-900">
                    €{match.startingPrice}
                  </div>
                </div>
                <button
                  onClick={() => onSelectMatch(match)}
                  disabled={match.availability === "sold-out"}
                  className="px-6 py-3 bg-[#EE3224] text-white rounded-xl font-bold hover:bg-[#d92b1e] transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 shadow-lg"
                >
                  Elegir sector
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SCREEN 2 - Stadium Seat Map
function StadiumSeatMap({
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

// SCREEN 3 - Seat Selection
function SeatSelection({
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

// SCREEN 4 - Checkout
function Checkout({
  match,
  sector,
  seat,
  onBack,
  onConfirm,
}: {
  match: Match;
  sector: Sector;
  seat: Seat;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "apple"
  >("card");

  const serviceFee = 2.5;
  const total = sector.price + serviceFee;

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
              <div className="text-sm font-bold text-gray-900">Checkout</div>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-black text-gray-900 mb-8">
          Finalizar compra
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Método de pago
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl font-bold transition-all border-2 ${
                    paymentMethod === "card"
                      ? "bg-[#EE3224] text-white border-[#EE3224]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard size={24} className="mx-auto mb-2" />
                  <div className="text-xs">Tarjeta</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-4 rounded-xl font-bold transition-all border-2 ${
                    paymentMethod === "paypal"
                      ? "bg-[#EE3224] text-white border-[#EE3224]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">P</div>
                  <div className="text-xs">PayPal</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("apple")}
                  className={`p-4 rounded-xl font-bold transition-all border-2 ${
                    paymentMethod === "apple"
                      ? "bg-[#EE3224] text-white border-[#EE3224]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2"></div>
                  <div className="text-xs">Apple Pay</div>
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#EE3224] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Fecha exp.
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#EE3224] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#EE3224] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="JUAN PÉREZ"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#EE3224] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 mb-4">Resumen</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(match.date).toLocaleDateString("es-ES")} •{" "}
                    {match.time}h
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sector</span>
                    <span className="text-gray-900 font-bold">
                      {sector.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Asiento</span>
                    <span className="text-gray-900 font-bold">
                      Fila {seat.row}, #{seat.number}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Categoría</span>
                    <span className="text-gray-900 font-bold">
                      {sector.category}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">€{sector.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cargos de servicio</span>
                    <span className="text-gray-900">
                      €{serviceFee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold">Total</span>
                    <span className="text-3xl font-black text-[#EE3224]">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onConfirm}
                className="w-full px-6 py-4 bg-[#EE3224] text-white rounded-xl font-bold hover:bg-[#d92b1e] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                Confirmar y pagar
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Pago seguro con encriptación SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SCREEN 5 - Success
function TicketSuccess({
  match,
  sector,
  seat,
  onDone,
}: {
  match: Match;
  sector: Sector;
  seat: Seat;
  onDone: () => void;
}) {
  const ticketCode = `VCF-${match.id.toUpperCase()}-${sector.id.toUpperCase()}-${seat.row}${seat.number}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce shadow-xl">
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            ¡Entrada confirmada!
          </h1>
          <p className="text-xl text-gray-600">
            Tu entrada ha sido enviada a tu correo
          </p>
        </div>

        {/* Digital Ticket */}
        <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EE3224] to-[#d92b1e] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <img src={vcfShield} alt="Valencia CF" className="w-12 h-12" />
              <div className="text-right">
                <div className="text-xs opacity-80">VALENCIA CF</div>
                <div className="font-black">MESTALLA</div>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-2xl font-black mb-2">
                {match.homeTeam} vs {match.awayTeam}
              </div>
              <div className="text-sm opacity-90">
                {new Date(match.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-lg font-bold mt-1">{match.time}h</div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">SECTOR</div>
                <div className="font-black text-black">{sector.name}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">FILA</div>
                <div className="font-black text-black text-2xl">{seat.row}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">ASIENTO</div>
                <div className="font-black text-black text-2xl">
                  {seat.number}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl border-4 border-black/10 mb-4">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">▦</div>
                  <div className="text-xs text-gray-600 font-bold">QR CODE</div>
                </div>
              </div>
            </div>

            {/* Ticket Code */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                CÓDIGO DE ENTRADA
              </div>
              <div className="font-mono font-bold text-black tracking-wider">
                {ticketCode}
              </div>
            </div>
          </div>
        </div>

        {/* VR Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <div className="font-black text-white mb-1">
                Ver mi asiento en VR
              </div>
              <div className="text-xs text-white/80">
                Disponible en Meta Quest
              </div>
            </div>
          </div>
          <ChevronRight size={24} className="text-white" />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-md">
            <Download size={20} />
            Descargar
          </button>
          <button className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-md">
            <Share2 size={20} />
            Compartir
          </button>
        </div>

        <button
          onClick={onDone}
          className="w-full mt-6 px-6 py-4 bg-[#EE3224] text-white rounded-xl font-bold hover:bg-[#d92b1e] transition-all shadow-lg"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
