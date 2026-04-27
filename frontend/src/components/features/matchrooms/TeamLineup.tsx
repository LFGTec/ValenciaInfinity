import type { Player } from "./types";

interface TeamLineupProps {
  teamName: string;
  players: Player[];
  variant: "home" | "away";
}

export function TeamLineup({ teamName, players, variant }: TeamLineupProps) {
  const isHome = variant === "home";

  return (
    <div className={`bg-card border-2 ${isHome ? "border-vcf-orange" : "border-border"} rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-lg font-black ${isHome ? "text-vcf-orange" : "text-foreground"} mb-4`}>
        {teamName}
      </h3>
      <div className="space-y-2">
        {players.map((player, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2 bg-muted rounded transition-colors ${
              player.subbed ? "opacity-50" : ""
            } ${isHome ? "hover:bg-vcf-orange/10" : "hover:bg-border"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 ${isHome ? "bg-vcf-orange" : "bg-gray-700"} text-white rounded flex items-center justify-center font-bold text-sm`}
              >
                {player.num}
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">{player.name}</div>
                <div className="text-xs text-muted-foreground">{player.pos}</div>
              </div>
            </div>
            <div className="flex gap-1">
              {player.scored && (
                isHome
                  ? <span className="text-xs font-bold text-vcf-orange">GOL</span>
                  : <span className="text-lg">⚽</span>
              )}
              {player.hasCard && (
                <span className="text-xs font-bold text-vcf-yellow bg-vcf-yellow/20 px-1 rounded">TA</span>
              )}
              {player.subbed && (
                <span className="text-xs font-bold text-muted-foreground">SUB</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
