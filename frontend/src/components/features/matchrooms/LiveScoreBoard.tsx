import type { LiveMatchState } from "@/services/matchRoomsService";

interface LiveScoreBoardProps {
  liveMatch: LiveMatchState | null;
}

export function LiveScoreBoard({ liveMatch }: LiveScoreBoardProps) {
  const isLive = liveMatch?.status === "IN_PLAY" || liveMatch?.status === "PAUSED";
  const isPaused = liveMatch?.status === "PAUSED";

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white rounded-2xl overflow-hidden border border-white/10 shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-vcf-orange via-vcf-yellow to-vcf-orange" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="relative px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border ${
            isPaused
              ? "bg-vcf-yellow/10 text-vcf-yellow border-vcf-yellow/30"
              : isLive
              ? "bg-red-500/10 text-red-400 border-red-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}>
            {isLive && (
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-vcf-yellow" : "bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.9)]"}`} />
            )}
            {isPaused ? "DESCANSO" : isLive ? "EN VIVO" : liveMatch?.status ?? "SIN PARTIDO"}
          </span>

          {/* Minute */}
          {liveMatch?.minute != null && (
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-black text-vcf-yellow tabular-nums leading-none">{liveMatch.minute}</span>
              <span className="text-vcf-yellow/50 font-bold text-lg">'</span>
            </div>
          )}

          <span className="text-[10px] font-bold text-white/30 tracking-wide">{liveMatch?.competition ?? "—"}</span>
        </div>

        {/* Score row */}
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg shadow-vcf-orange/30">
              <span className="text-xs font-black text-white tracking-wide">
                {liveMatch?.home_team?.slice(0, 3).toUpperCase() ?? "VCF"}
              </span>
            </div>
            <p className="text-[11px] font-bold text-white/60 mb-1 truncate px-1">{liveMatch?.home_team ?? "Valencia CF"}</p>
            <div className="text-5xl font-black text-vcf-yellow tabular-nums leading-none">{liveMatch?.home_score ?? 0}</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <span className="text-[9px] font-black text-white/15 tracking-[0.3em]">VS</span>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
              <span className="text-xs font-black text-white/80 tracking-wide">
                {liveMatch?.away_team?.slice(0, 3).toUpperCase() ?? "???"}
              </span>
            </div>
            <p className="text-[11px] font-bold text-white/60 mb-1 truncate px-1">{liveMatch?.away_team ?? "Rival"}</p>
            <div className="text-5xl font-black text-white/90 tabular-nums leading-none">{liveMatch?.away_score ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
