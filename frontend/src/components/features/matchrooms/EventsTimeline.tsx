import type { MatchEvent } from "@/services/matchRoomsService";

const EVENT_ICON: Record<string, string> = {
  GOAL: "⚽",
  YELLOW_CARD: "🟨",
  RED_CARD: "🟥",
  SUBSTITUTION: "🔄",
};

function eventLabel(event: MatchEvent): string {
  if (event.type === "GOAL") {
    const assist = event.assist ? ` · Asistencia: ${event.assist}` : "";
    return `${event.player ?? ""}${assist}`;
  }
  if (event.type === "SUBSTITUTION") {
    return `${event.playerOut ?? ""} → ${event.playerIn ?? ""}`;
  }
  if (event.type === "YELLOW_CARD") return event.player ?? "";
  if (event.type === "RED_CARD") return event.player ?? "";
  return "";
}

function eventTypeLabel(type: string): string {
  if (type === "GOAL") return "GOL";
  if (type === "YELLOW_CARD") return "AMARILLA";
  if (type === "RED_CARD") return "ROJA";
  if (type === "SUBSTITUTION") return "CAMBIO";
  return type;
}

interface EventsTimelineProps {
  events: MatchEvent[];
  homeTeam: string;
}

export function EventsTimeline({ events, homeTeam }: EventsTimelineProps) {
  const sorted = [...events].reverse();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
      <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-vcf-orange rounded-full" />
        EVENTOS DEL PARTIDO
      </h3>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <span className="text-3xl opacity-30">🏟️</span>
          <p className="text-xs text-muted-foreground font-bold">Sin eventos aún</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[2.75rem] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-2.5">
            {sorted.map((event, i) => {
              const isHome = event.team === homeTeam;
              const isGoal = event.type === "GOAL";

              return (
                <div key={i} className="flex items-center gap-3">
                  {/* Minute */}
                  <div
                    className={`w-11 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-xs z-10 ${
                      isGoal
                        ? "bg-vcf-orange text-white shadow-md shadow-vcf-orange/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {event.minute}'
                  </div>

                  {/* Dot */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 z-10 ring-2 ring-card ${
                      isGoal
                        ? "bg-vcf-orange shadow-[0_0_8px_rgba(255,103,31,0.6)]"
                        : "bg-border"
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl ${
                      isGoal
                        ? "bg-vcf-orange/10 border border-vcf-orange/25"
                        : "bg-muted/50"
                    }`}
                  >
                    <span className="text-lg leading-none flex-shrink-0">
                      {EVENT_ICON[event.type] ?? "•"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-black tracking-wide ${
                            isHome ? "text-vcf-orange" : "text-muted-foreground"
                          }`}
                        >
                          {eventTypeLabel(event.type)}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {event.team}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-foreground truncate">
                        {eventLabel(event)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
