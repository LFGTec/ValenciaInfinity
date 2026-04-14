import vcfShield from "../../assets/EscudoValenciaCF.png";
import type { EstadisticasTemporada } from "../../hooks/usePartidosVCF";
function StatCard({
  label,
  valor,
  color,
}: {
  label: string;
  valor: number | string;
  color?: string;
}) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center gap-1">
      <div
        className="text-3xl font-black"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {valor}
      </div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
        {label}
      </div>
    </div>
  );
}

function BarraResultados({
  ganados,
  empatados,
  perdidos,
  jugados,
}: {
  ganados: number;
  empatados: number;
  perdidos: number;
  jugados: number;
}) {
  const pGanados = (ganados / jugados) * 100;
  const pEmpatados = (empatados / jugados) * 100;
  const pPerdidos = (perdidos / jugados) * 100;

  return (
    <div className="w-full">
      <div className="flex rounded-full overflow-hidden h-3 mb-2">
        <div
          className="bg-[#4CAF50] transition-all"
          style={{ width: `${pGanados}%` }}
        />
        <div
          className="bg-vcf-orange transition-all"
          style={{ width: `${pEmpatados}%` }}
        />
        <div
          className="bg-vcf-red transition-all"
          style={{ width: `${pPerdidos}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-bold text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4CAF50] inline-block" />
          Victorias {ganados}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-vcf-orange inline-block" />
          Empates {empatados}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-vcf-red inline-block" />
          Derrotas {perdidos}
        </span>
      </div>
    </div>
  );
}

export function EstadisticasTemporadaCard({
  stats,
}: {
  stats: EstadisticasTemporada;
}) {
  const difGoles = stats.golesAFavor - stats.golesEnContra;

  return (
    <div className="bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-black via-vcf-orange/20 to-black border-b-2 border-vcf-orange">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg border-2 border-vcf-orange flex-shrink-0">
          <img
            src={vcfShield}
            alt="Valencia CF"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">
            Temporada 2025/26
          </h2>
          <p className="text-muted-foreground text-sm font-bold">
            La Liga · Jornada {stats.jornada}
          </p>
        </div>
        <div className="ml-auto text-center">
          <div className="text-4xl font-black text-vcf-orange">
            {stats.puntos}
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Puntos
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Jugados" valor={stats.jugados} />
          <StatCard label="Victorias" valor={stats.ganados} color="#4CAF50" />
          <StatCard label="Empates" valor={stats.empatados} color="#ff671f" />
          <StatCard label="Derrotas" valor={stats.perdidos} color="#ee3524" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Goles a favor" valor={stats.golesAFavor} />
          <StatCard
            label="Goles en contra"
            valor={stats.golesEnContra}
            color="#ee3524"
          />
          <StatCard
            label="Diferencia"
            valor={difGoles > 0 ? `+${difGoles}` : difGoles}
            color={difGoles >= 0 ? "#4CAF50" : "#ee3524"}
          />
        </div>

        {/* Barra de resultados */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Distribución de resultados
          </div>
          <BarraResultados
            ganados={stats.ganados}
            empatados={stats.empatados}
            perdidos={stats.perdidos}
            jugados={stats.jugados}
          />
        </div>
      </div>
    </div>
  );
}
