interface StatRow {
  label: string;
  home: number;
  away: number;
  homeColor: string;
}

const STAT_CONFIG: { key: string; label: string; homeColor: string }[] = [
  { key: "possession", label: "Posesión (%)", homeColor: "bg-vcf-orange" },
  { key: "totalShots", label: "Tiros totales", homeColor: "bg-vcf-blue" },
  { key: "shotsOnTarget", label: "Tiros a puerta", homeColor: "bg-vcf-yellow" },
  { key: "corners", label: "Corners", homeColor: "bg-vcf-red" },
  { key: "fouls", label: "Faltas", homeColor: "bg-purple-600" },
  { key: "yellowCards", label: "Tarjetas amarillas", homeColor: "bg-yellow-500" },
];

interface MatchStatsPanelProps {
  stats: Record<string, unknown>;
  homeTeam: string;
  awayTeam: string;
}

export function MatchStatsPanel({ stats, homeTeam, awayTeam }: MatchStatsPanelProps) {
  const rows: StatRow[] = STAT_CONFIG.flatMap(({ key, label, homeColor }) => {
    const entry = stats[key] as { home?: number; away?: number } | undefined;
    if (!entry || entry.home == null || entry.away == null) return [];
    return [{ label, home: entry.home, away: entry.away, homeColor }];
  });

  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-black text-foreground mb-4">
        ESTADÍSTICAS <span className="text-vcf-blue">EN VIVO</span>
      </h3>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Las estadísticas estarán disponibles durante el partido
        </p>
      ) : (
        <>
          <div className="flex justify-between text-xs font-black text-muted-foreground mb-4">
            <span>{homeTeam}</span>
            <span>{awayTeam}</span>
          </div>
          <div className="space-y-5">
            {rows.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-foreground">{item.home}</span>
                  <span className="font-bold text-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.away}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.homeColor}`}
                      style={{ width: `${(item.home / (item.home + item.away)) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{ width: `${(item.away / (item.home + item.away)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
