const stats = [
  { stat: "Posesion", home: 58, away: 42, homeColor: "bg-vcf-orange", awayColor: "bg-gray-400" },
  { stat: "Tiros totales", home: 12, away: 8, homeColor: "bg-vcf-blue", awayColor: "bg-gray-400" },
  { stat: "Tiros a puerta", home: 8, away: 5, homeColor: "bg-vcf-yellow", awayColor: "bg-gray-400" },
  { stat: "Corners", home: 6, away: 3, homeColor: "bg-vcf-red", awayColor: "bg-gray-400" },
  { stat: "Faltas", home: 9, away: 11, homeColor: "bg-purple-600", awayColor: "bg-gray-400" },
  { stat: "Tarjetas amarillas", home: 2, away: 1, homeColor: "bg-yellow-500", awayColor: "bg-gray-400" },
];

export function MatchStatsPanel() {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-black text-foreground mb-6">
        ESTADISTICAS <span className="text-vcf-blue">EN VIVO</span>
      </h3>
      <div className="space-y-5">
        {stats.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-foreground">{item.home}</span>
              <span className="font-bold text-foreground">{item.stat}</span>
              <span className="font-bold text-foreground">{item.away}</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.homeColor} shadow-inner`}
                  style={{ width: `${(item.home / (item.home + item.away)) * 100}%` }}
                />
              </div>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.awayColor} shadow-inner`}
                  style={{
                    width: `${(item.away / (item.home + item.away)) * 100}%`,
                    marginLeft: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
