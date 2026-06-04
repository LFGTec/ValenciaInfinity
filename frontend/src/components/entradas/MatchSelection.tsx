import { MapPin, Calendar, Clock } from "lucide-react";
import type { Match } from "@/pages/TicketsPage";
import vcfShield from "../../assets/EscudoValenciaCF.png";

export function MatchSelection({
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
