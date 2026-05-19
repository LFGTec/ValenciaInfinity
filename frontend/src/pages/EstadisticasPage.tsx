import React from "react";
import { ArrowLeft, BarChart2, Home, Plane, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePartidosVCF } from "../hooks/usePartidosVCF";
import { useTablaLiga } from "../hooks/useTablaLiga";
import { EstadisticasTemporadaCard } from "../components/features/EstadisticasTemporada";
import { TablaLiga } from "../components/features/matches/TablaLiga";

function MiniStatCard({
  label,
  valor,
  sub,
  color,
}: {
  label: string;
  valor: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl p-5 border-2 border-border flex flex-col gap-1">
      <div
        className="text-3xl font-black"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {valor}
      </div>
      <div className="text-sm font-black text-foreground">{label}</div>
      {sub && (
        <div className="text-xs text-muted-foreground font-bold">{sub}</div>
      )}
    </div>
  );
}

function FormaBadge({ resultado }: { resultado: "W" | "D" | "L" }) {
  const cfg = {
    W: { label: "V", bg: "bg-[#4CAF50]", text: "text-white" },
    D: { label: "E", bg: "bg-vcf-orange", text: "text-white" },
    L: { label: "D", bg: "bg-vcf-red", text: "text-white" },
  }[resultado];
  return (
    <span
      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

export function EstadisticasPage() {
  const navegar = useNavigate();
  const { jugados, estadisticas, cargando } = usePartidosVCF();
  const { tabla, cargando: cargandoTabla, error: errorTabla } = useTablaLiga();

  // Estadísticas casa / fuera
  const casa = jugados.filter((p) => p.casa);
  const fuera = jugados.filter((p) => !p.casa);

  function record(lista: typeof jugados) {
    let g = 0,
      e = 0,
      p = 0,
      gf = 0,
      gc = 0;
    lista.forEach((partido) => {
      if (!partido.resultado) return;
      const golesVCF = partido.casa
        ? partido.resultado.local
        : partido.resultado.visitante;
      const golesRival = partido.casa
        ? partido.resultado.visitante
        : partido.resultado.local;
      gf += golesVCF;
      gc += golesRival;
      if (golesVCF > golesRival) g++;
      else if (golesVCF === golesRival) e++;
      else p++;
    });
    return { g, e, p, gf, gc };
  }

  const recCasa = record(casa);
  const recFuera = record(fuera);

  // Últimos 5 partidos
  const ultimos5 = jugados.slice(0, 5);
  const forma: ("W" | "D" | "L")[] = ultimos5.map((p) => {
    if (!p.resultado) return "D";
    const gf = p.casa ? p.resultado.local : p.resultado.visitante;
    const gc = p.casa ? p.resultado.visitante : p.resultado.local;
    if (gf > gc) return "W";
    if (gf === gc) return "D";
    return "L";
  });

  // Porterías a cero
  const porteriasACero = jugados.filter((p) => {
    if (!p.resultado) return false;
    const gc = p.casa ? p.resultado.visitante : p.resultado.local;
    return gc === 0;
  }).length;

  const promedioGoles =
    estadisticas && estadisticas.jugados > 0
      ? (estadisticas.golesAFavor / estadisticas.jugados).toFixed(2)
      : "-";

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navegar("/matches")}
          className="flex items-center gap-2 text-black hover:text-vcf-orange font-bold mb-4 transition-colors border-2 border-black rounded-xl px-4 py-2 hover:border-vcf-orange"
        >
          <ArrowLeft size={18} />
          Volver a Partidos
        </button>
        <div className="flex items-center gap-3">
          <BarChart2 size={32} className="text-vcf-orange" />
          <div>
            <h1 className="text-5xl font-black text-foreground">
              ESTADÍSTICAS
            </h1>
            <p className="text-base text-muted-foreground">
              Valencia CF · Temporada 2025/26
            </p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="bg-card rounded-2xl p-16 border-2 border-border flex items-center justify-center">
          <span className="text-muted-foreground font-bold text-lg">
            Cargando estadísticas...
          </span>
        </div>
      ) : !estadisticas ? (
        <div className="bg-card rounded-2xl p-16 border-2 border-border flex items-center justify-center">
          <span className="text-muted-foreground font-bold text-lg">
            No hay estadísticas disponibles
          </span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Tarjeta principal */}
          <EstadisticasTemporadaCard stats={estadisticas} />

          {/* Métricas rápidas */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-4">
              MÉTRICAS <span className="text-vcf-orange">CLAVE</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MiniStatCard
                label="Goles por partido"
                valor={promedioGoles}
                sub="promedio"
                color="var(--vcf-orange)"
              />
              <MiniStatCard
                label="Porterías a cero"
                valor={porteriasACero}
                sub={`de ${estadisticas.jugados} partidos`}
                color="#4CAF50"
              />
              <MiniStatCard
                label="Puntos por partido"
                valor={
                  estadisticas.jugados > 0
                    ? (estadisticas.puntos / estadisticas.jugados).toFixed(2)
                    : "-"
                }
                sub="promedio"
                color="var(--vcf-orange)"
              />
              <MiniStatCard
                label="% Victorias"
                valor={
                  estadisticas.jugados > 0
                    ? `${Math.round((estadisticas.ganados / estadisticas.jugados) * 100)}%`
                    : "-"
                }
                sub={`${estadisticas.ganados} de ${estadisticas.jugados}`}
                color="#4CAF50"
              />
            </div>
          </div>

          {/* Casa vs Fuera */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-4">
              CASA <span className="text-vcf-orange">VS</span> FUERA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Casa */}
              <div className="bg-card rounded-2xl border-2 border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Home size={20} className="text-vcf-orange" />
                  <span className="font-black text-lg text-foreground">
                    LOCAL
                  </span>
                  <span className="ml-auto text-muted-foreground text-sm font-bold">
                    {casa.length} partidos
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-[#4CAF50]">
                      {recCasa.g}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      V
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-vcf-orange">
                      {recCasa.e}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      E
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-vcf-red">
                      {recCasa.p}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      D
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-muted-foreground">
                  {recCasa.gf} goles a favor · {recCasa.gc} en contra
                </div>
              </div>

              {/* Fuera */}
              <div className="bg-card rounded-2xl border-2 border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plane size={20} className="text-vcf-orange" />
                  <span className="font-black text-lg text-foreground">
                    VISITANTE
                  </span>
                  <span className="ml-auto text-muted-foreground text-sm font-bold">
                    {fuera.length} partidos
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-[#4CAF50]">
                      {recFuera.g}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      V
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-vcf-orange">
                      {recFuera.e}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      E
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-vcf-red">
                      {recFuera.p}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      D
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-muted-foreground">
                  {recFuera.gf} goles a favor · {recFuera.gc} en contra
                </div>
              </div>
            </div>
          </div>

          {/* Últimos 5 */}
          {forma.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-foreground mb-4">
                ÚLTIMOS <span className="text-vcf-orange">5 PARTIDOS</span>
              </h2>
              <div className="bg-card rounded-2xl border-2 border-border p-6">
                <div className="flex items-center gap-4 flex-wrap">
                  {forma.map((r, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <FormaBadge resultado={r} />
                      <span className="text-xs text-muted-foreground font-bold truncate max-w-[60px] text-center">
                        {ultimos5[i]?.rival.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-black text-foreground">
                      {forma.filter((f) => f === "W").length}V·
                      {forma.filter((f) => f === "D").length}E·
                      {forma.filter((f) => f === "L").length}D
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Últimos 5
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de La Liga */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={24} className="text-vcf-orange" />
              <h2 className="text-2xl font-black text-foreground">
                TABLA <span className="text-vcf-orange">LA LIGA</span>
              </h2>
            </div>
            {cargandoTabla ? (
              <div className="bg-card rounded-2xl p-12 border-2 border-border flex items-center justify-center">
                <span className="text-muted-foreground font-bold">
                  Cargando clasificación...
                </span>
              </div>
            ) : errorTabla ? (
              <div className="bg-card rounded-2xl p-12 border-2 border-border flex items-center justify-center">
                <span className="text-muted-foreground font-bold">
                  No se pudo cargar la clasificación
                </span>
              </div>
            ) : (
              <TablaLiga tabla={tabla} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
