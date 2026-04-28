import type { LiveMatchState } from "@/services/matchRoomsService";

interface LiveScoreBoardProps {
  liveMatch: LiveMatchState | null;
}

export function LiveScoreBoard({ liveMatch }: LiveScoreBoardProps) {
  const isLive = liveMatch?.status === "IN_PLAY" || liveMatch?.status === "PAUSED";

  return (
    <div className="bg-gradient-to-br from-black via-vcf-orange to-black text-white rounded-xl overflow-hidden shadow-2xl border-2 border-vcf-orange">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isLive && <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse" />}
            <span className="text-sm font-bold">
              {liveMatch?.status === "PAUSED" ? "DESCANSO" : isLive ? "EN VIVO" : liveMatch?.status ?? "—"}
            </span>
          </div>
          <div className="text-2xl font-black text-vcf-yellow">
            {liveMatch?.minute != null ? `${liveMatch.minute}'` : "—"}
          </div>
          <div className="text-sm font-bold">{liveMatch?.competition ?? "—"}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
              <span className="text-2xl font-black text-white">VCF</span>
            </div>
            <h3 className="text-lg font-black mb-1 truncate">{liveMatch?.home_team ?? "Valencia CF"}</h3>
            <div className="text-5xl font-black text-vcf-yellow">{liveMatch?.home_score ?? 0}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-black opacity-50">VS</div>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
              <span className="text-xl font-black text-black">
                {liveMatch?.away_team?.slice(0, 3).toUpperCase() ?? "???"}
              </span>
            </div>
            <h3 className="text-lg font-black mb-1 truncate">{liveMatch?.away_team ?? "Rival"}</h3>
            <div className="text-5xl font-black">{liveMatch?.away_score ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
