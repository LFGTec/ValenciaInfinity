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
  const yellowCarded = new Set(
    events.filter((e) => e.type === "YELLOW_CARD" && e.team === teamName).map((e) => e.player)
  );
  const redCarded = new Set(
    events.filter((e) => e.type === "RED_CARD" && e.team === teamName).map((e) => e.player)
  );
  const subbed = new Set(
    events.filter((e) => e.type === "SUBSTITUTION" && e.team === teamName).map((e) => e.playerOut)
  );

  return (
    <div className={`bg-card border rounded-2xl p-5 shadow-lg ${isHome ? "border-vcf-orange/40" : "border-border"}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-1 h-5 rounded-full ${isHome ? "bg-vcf-orange" : "bg-muted-foreground/40"}`}
        />
        <h3 className={`text-sm font-black ${isHome ? "text-vcf-orange" : "text-foreground"}`}>
          {teamName}
        </h3>
      </div>

      {players.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <span className="text-3xl opacity-30">👕</span>
          <p className="text-xs text-muted-foreground font-bold">Alineación no disponible</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {players.map((player, i) => {
            const isOut = subbed.has(player.name);
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  isOut ? "opacity-40" : ""
                } ${isHome ? "hover:bg-vcf-orange/8" : "hover:bg-muted/60"} hover:bg-muted/50`}
              >
                <div className="flex items-center gap-3">
                  {/* Number badge */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isHome
                        ? "bg-vcf-orange/15 text-vcf-orange"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.number}
                  </div>

                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">{player.name}</p>
                    <p className="text-[10px] text-muted-foreground">{player.position}</p>
                  </div>
                </div>

                {/* Event badges */}
                <div className="flex items-center gap-1">
                  {scored.has(player.name) && (
                    <span className="text-sm" title="Gol">⚽</span>
                  )}
                  {yellowCarded.has(player.name) && (
                    <span
                      className="w-3.5 h-4.5 bg-yellow-400 rounded-sm inline-block"
                      title="Tarjeta amarilla"
                    />
                  )}
                  {redCarded.has(player.name) && (
                    <span
                      className="w-3.5 h-4.5 bg-red-500 rounded-sm inline-block"
                      title="Tarjeta roja"
                    />
                  )}
                  {isOut && (
                    <span className="text-[10px] font-black text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                      SUB
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
