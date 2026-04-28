import { Clock } from "lucide-react";
import type { MatchEvent } from "@/services/matchRoomsService";

const EVENT_ICON: Record<string, string> = {
  GOAL: "⚽",
  YELLOW_CARD: "🟨",
  RED_CARD: "🟥",
  SUBSTITUTION: "🔄",
};

function eventLabel(event: MatchEvent): string {
  if (event.type === "GOAL") {
    const assist = event.assist ? ` (assist: ${event.assist})` : "";
    return `GOL! ${event.player ?? ""}${assist}`;
  }
  if (event.type === "SUBSTITUTION") {
    return `Cambio: ${event.playerOut ?? ""} → ${event.playerIn ?? ""}`;
  }
  if (event.type === "YELLOW_CARD") return `Tarjeta amarilla: ${event.player ?? ""}`;
  if (event.type === "RED_CARD") return `Tarjeta roja: ${event.player ?? ""}`;
  return "";
}

interface EventsTimelineProps {
  events: MatchEvent[];
  homeTeam: string;
}

export function EventsTimeline({ events, homeTeam }: EventsTimelineProps) {
  const sorted = [...events].reverse();

  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-lg">
      <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
        <Clock size={18} className="text-vcf-orange" />
        EVENTOS DEL <span className="text-vcf-orange">PARTIDO</span>
      </h3>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Sin eventos aún</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((event, i) => {
            const isHome = event.team === homeTeam;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  event.type === "GOAL"
                    ? "bg-vcf-orange/10 border-l-4 border-vcf-orange"
                    : "bg-muted"
                }`}
              >
                <div className="w-12 h-12 bg-vcf-orange text-white rounded-lg flex items-center justify-center font-black flex-shrink-0 text-sm">
                  {event.minute}'
                </div>
                <div className="text-xl">{EVENT_ICON[event.type] ?? "•"}</div>
                <div className="flex-1">
                  <div className={`font-bold text-sm mb-0.5 ${isHome ? "text-vcf-orange" : "text-foreground"}`}>
                    {event.team}
                  </div>
                  <div className="text-sm text-foreground">{eventLabel(event)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
