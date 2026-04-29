interface StatRow {
  label: string;
  home: number;
  away: number;
  homeColor: string;
}

const STAT_CONFIG: { key: string; label: string; homeColor: string }[] = [
  { key: "possession", label: "Posesión", homeColor: "bg-vcf-orange" },
  { key: "totalShots", label: "Tiros totales", homeColor: "bg-vcf-blue" },
  { key: "shotsOnTarget", label: "A puerta", homeColor: "bg-vcf-yellow" },
  { key: "corners", label: "Corners", homeColor: "bg-emerald-500" },
  { key: "fouls", label: "Faltas", homeColor: "bg-purple-500" },
  { key: "yellowCards", label: "Amarillas", homeColor: "bg-yellow-400" },
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
    <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
      <h3 className="text-sm font-black text-foreground mb-5 flex items-center gap-2">
        <span className="w-1 h-4 bg-vcf-blue rounded-full" />
        ESTADÍSTICAS EN VIVO
      </h3>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <span className="text-3xl opacity-30">📊</span>
          <p className="text-xs text-muted-foreground font-bold text-center">
            Las estadísticas estarán disponibles durante el partido
          </p>
        </div>
      ) : (
        <>
          {/* Team headers */}
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-xs font-black text-vcf-orange truncate max-w-[45%]">{homeTeam}</span>
            <span className="text-[10px] font-bold text-muted-foreground/50">vs</span>
            <span className="text-xs font-black text-muted-foreground truncate max-w-[45%] text-right">{awayTeam}</span>
          </div>

          <div className="space-y-4">
            {rows.map((item) => {
              const total = item.home + item.away || 1;
              const homeWidth = (item.home / total) * 100;
              const awayWidth = (item.away / total) * 100;

              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5 px-0.5">
                    <span className="text-sm font-black text-foreground tabular-nums">{item.home}</span>
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider">{item.label}</span>
                    <span className="text-sm font-black text-foreground tabular-nums">{item.away}</span>
                  </div>
                  {/* Single center-meeting bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${item.homeColor} rounded-l-full transition-all duration-700`}
                      style={{ width: `${homeWidth}%` }}
                    />
                    <div
                      className="h-full bg-gray-500/50 rounded-r-full ml-auto transition-all duration-700"
                      style={{ width: `${awayWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
