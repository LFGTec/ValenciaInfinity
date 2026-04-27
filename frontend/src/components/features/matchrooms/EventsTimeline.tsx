import { Clock } from "lucide-react";

const events = [
  { minute: "65'", team: "Valencia CF", event: "GOL! Hugo Duro", type: "goal", isHome: true },
  { minute: "58'", team: "Real Madrid", event: "Cambio: Modric sale, Camavinga entra", type: "sub", isHome: false },
  { minute: "52'", team: "Valencia CF", event: "Tarjeta amarilla: Pepelu", type: "card", isHome: true },
  { minute: "41'", team: "Real Madrid", event: "GOL! Vinicius Jr", type: "goal", isHome: false },
  { minute: "23'", team: "Valencia CF", event: "GOL! Fran Perez", type: "goal", isHome: true },
  { minute: "12'", team: "Valencia CF", event: "Tarjeta amarilla: Yaremchuk", type: "card", isHome: true },
];

export function EventsTimeline() {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-lg">
      <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
        <Clock size={18} className="text-vcf-orange" />
        EVENTOS DEL <span className="text-vcf-orange">PARTIDO</span>
      </h3>
      <div className="space-y-2">
        {events.map((event, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              event.type === "goal"
                ? "bg-vcf-orange/10 border-l-4 border-vcf-orange"
                : "bg-muted"
            }`}
          >
            <div className="w-12 h-12 bg-vcf-orange text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">
              {event.minute}
            </div>
            <div className="flex-1">
              <div className={`font-bold text-sm mb-1 ${event.isHome ? "text-vcf-orange" : "text-foreground"}`}>
                {event.team}
              </div>
              <div className="text-sm text-foreground">{event.event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
