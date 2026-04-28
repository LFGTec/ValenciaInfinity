import type { LineupPlayer, MatchEvent } from "@/services/matchRoomsService";

interface TeamLineupProps {
  teamName: string;
  players: LineupPlayer[];
  events: MatchEvent[];
  variant: "home" | "away";
}

export function TeamLineup({ teamName, players, events, variant }: TeamLineupProps) {
  const isHome = variant === "home";

  const scored = new Set(
    events.filter((e) => e.type === "GOAL" && e.team === teamName).map((e) => e.player)
  );
  const carded = new Set(
    events
      .filter((e) => (e.type === "YELLOW_CARD" || e.type === "RED_CARD") && e.team === teamName)
      .map((e) => e.player)
  );
  const subbed = new Set(
    events
      .filter((e) => e.type === "SUBSTITUTION" && e.team === teamName)
      .map((e) => e.playerOut)
  );

  return (
    <div className={`bg-card border-2 ${isHome ? "border-vcf-orange" : "border-border"} rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-lg font-black ${isHome ? "text-vcf-orange" : "text-foreground"} mb-4`}>
        {teamName}
      </h3>

      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Alineación no disponible</p>
      ) : (
        <div className="space-y-2">
          {players.map((player, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 bg-muted rounded transition-colors ${
                subbed.has(player.name) ? "opacity-50" : ""
              } ${isHome ? "hover:bg-vcf-orange/10" : "hover:bg-border"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${isHome ? "bg-vcf-orange" : "bg-gray-700"} text-white rounded flex items-center justify-center font-bold text-sm`}
                >
                  {player.number}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.position}</div>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                {scored.has(player.name) && <span className="text-base">⚽</span>}
                {carded.has(player.name) && (
                  <span className="text-xs font-bold text-vcf-yellow bg-vcf-yellow/20 px-1 rounded">TA</span>
                )}
                {subbed.has(player.name) && (
                  <span className="text-xs font-bold text-muted-foreground">SUB</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
