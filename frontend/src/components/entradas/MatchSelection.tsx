import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import type { Match } from "@/pages/TicketsPage";
import vcfShield from "../../assets/EscudoValenciaCF.png";
import { StepIndicator } from "./StepIndicator";

export function MatchSelection({
  matches,
  stepNumber,
  onSelectMatch,
}: {
  matches: Match[];
  stepNumber: number;
  onSelectMatch: (match: Match) => void;
}) {
  const getAvailabilityBadge = (availability: Match["availability"]) => {
    switch (availability) {
      case "available":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
            <CheckCircle size={11} />
            Disponible
          </span>
        );
      case "low":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
            <AlertCircle size={11} />
            Últimas entradas
          </span>
        );
      case "sold-out":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200">
            <XCircle size={11} />
            Agotado
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header sticky ── */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Izquierda: placeholder para centrar el título */}
            <div className="w-24" />

            {/* Centro: título */}
            <div className="text-center hidden sm:block">
              <div className="text-sm font-black text-gray-900">
                Compra de entradas
              </div>
              <div className="text-xs text-gray-500">Elige tu partido</div>
            </div>

            {/* Derecha: pasos */}
            <StepIndicator current={stepNumber} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Título ── */}
        <h1 className="mb-3 text-5xl font-black text-foreground">
          PRÓXIMOS PARTIDOS
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Selecciona el encuentro y elige tu asiento en Mestalla
        </p>

        {/* ── Grid de partidos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 cursor-pointer">
          {matches.map((match) => (
            <div
              key={match.id}
              className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-vcf-orange hover:shadow-2xl transition-all duration-300"
            >
              {/* Franja superior */}
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                <span className="px-3 py-1 bg-bg-gray-100/10 text-black rounded-lg text-xs font-bold border border-bg-gray-100/20">
                  {match.competition}
                </span>
                {getAvailabilityBadge(match.availability)}
              </div>

              <div className="p-5">
                {/* Equipos */}
                <div className="flex items-center justify-between mb-5">
                  {/* Local */}
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-md border border-gray-100 p-1">
                      <img src={vcfShield} alt={match.homeTeam} className="w-full h-full object-contain" />
                    </div>
                    <div className="font-black text-gray-900 text-sm">
                      {match.homeTeam}
                    </div>
                  </div>

                  <div className="px-4 flex flex-col items-center gap-1">
                    <div className="text-xl font-black text-gray-300">VS</div>
                  </div>

                  {/* Visitante */}
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-md border border-gray-100 p-1">
                      <img
                        src={match.awayCrest}
                        alt={match.awayTeam}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `<span class="font-black text-gray-600 text-xs">${match.awayTeam.split(" ").map(w => w[0]).join("")}</span>`;
                        }}
                      />
                    </div>
                    <div className="font-black text-gray-900 text-sm">
                      {match.awayTeam}
                    </div>
                  </div>
                </div>

                {/* Info del partido */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 mb-5 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-black shrink-0" />
                    <span className="text-xs font-medium text-gray-700">
                      {new Date(match.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-black shrink-0" />
                    <span className="text-xs font-medium text-gray-700">
                      {match.time}h
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-black shrink-0" />
                    <span className="text-xs font-medium text-gray-700">
                      {match.stadium}
                    </span>
                  </div>
                </div>

                {/* Precio y botón */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">
                      Precio desde
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      €{match.startingPrice}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectMatch(match)}
                    disabled={match.availability === "sold-out"}
                    className="px-5 py-3 bg-vcf-orange text-white rounded-xl font-black  transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  >
                    Elegir asiento
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Info estadio ── */}
        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <img src={vcfShield} alt="Valencia CF" className="w-10 h-10" />
            <div className="flex-1 min-w-0">
              <div className="font-black text-gray-900">
                Estadio de Mestalla · Valencia
              </div>
              <div className="text-sm text-gray-500">
                Aforo: 49.430 espectadores · LaLiga y Copa del Rey
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-700">
                Entradas disponibles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
