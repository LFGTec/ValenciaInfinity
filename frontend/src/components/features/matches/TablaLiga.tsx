import type { FilaTabla } from "../../../hooks/useTablaLiga";

const VCF_ID = 95;

// Zonas La Liga 2025/26: 1-4 CL, 5-6 Europa, 7 Conference, 18-20 descenso
function colorZona(pos: number): string {
  if (pos <= 4) return "border-l-4 border-l-[#1a73e8]";
  if (pos <= 6) return "border-l-4 border-l-[#f97316]";
  if (pos === 7) return "border-l-4 border-l-[#a855f7]";
  if (pos >= 18) return "border-l-4 border-l-vcf-red";
  return "border-l-4 border-l-transparent";
}

function EtiquetaZona({ pos }: { pos: number }) {
  if (pos === 1)
    return (
      <span className="hidden sm:inline ml-2 text-[10px] font-black bg-[#1a73e8]/20 text-[#1a73e8] px-1.5 py-0.5 rounded uppercase tracking-widest">
        CL
      </span>
    );
  if (pos === 5)
    return (
      <span className="hidden sm:inline ml-2 text-[10px] font-black bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded uppercase tracking-widest">
        UEL
      </span>
    );
  if (pos === 7)
    return (
      <span className="hidden sm:inline ml-2 text-[10px] font-black bg-purple-500/20 text-purple-500 px-1.5 py-0.5 rounded uppercase tracking-widest">
        UECL
      </span>
    );
  if (pos === 18)
    return (
      <span className="hidden sm:inline ml-2 text-[10px] font-black bg-vcf-red/20 text-vcf-red px-1.5 py-0.5 rounded uppercase tracking-widest">
        DESC
      </span>
    );
  return null;
}

export function TablaLiga({ tabla }: { tabla: FilaTabla[] }) {
  return (
    <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-lg">
      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#1a73e8]" />
          Champions League
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-500" />
          Europa League
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-500" />
          Conference League
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-vcf-red" />
          Descenso
        </span>
      </div>

      {/* Cabecera */}
      <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_3rem_3rem_3rem_3rem] sm:grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3.5rem_3.5rem_3.5rem_3.5rem] gap-x-1 px-4 py-2 bg-muted/50 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
        <span className="text-center">#</span>
        <span>Equipo</span>
        <span className="text-center">PJ</span>
        <span className="text-center">G</span>
        <span className="text-center">E</span>
        <span className="text-center">P</span>
        <span className="text-center hidden sm:block">GF</span>
        <span className="text-center hidden sm:block">GC</span>
        <span className="text-center">DIF</span>
        <span className="text-center">PTS</span>
      </div>

      {/* Filas */}
      <div className="divide-y divide-border">
        {tabla.map((fila) => {
          const esVCF = fila.equipoId === VCF_ID;
          return (
            <div
              key={fila.equipoId}
              className={`grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_3rem_3rem_3rem_3rem] sm:grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3.5rem_3.5rem_3.5rem_3.5rem] gap-x-1 px-4 py-2.5 items-center text-sm transition-colors
                ${esVCF ? "bg-vcf-orange/10 font-black" : "hover:bg-muted/40 font-medium"}
                ${colorZona(fila.posicion)}`}
            >
              {/* Posición */}
              <span
                className={`text-center text-xs font-black ${esVCF ? "text-vcf-orange" : "text-muted-foreground"}`}
              >
                {fila.posicion}
              </span>

              {/* Equipo */}
              <div className="flex items-center gap-2 min-w-0">
                {fila.escudo ? (
                  <img
                    src={fila.escudo}
                    alt={fila.nombreCorto}
                    className="w-6 h-6 object-contain flex-shrink-0"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-black flex-shrink-0">
                    {fila.nombreCorto.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span
                  className={`truncate text-sm ${esVCF ? "text-vcf-orange" : "text-foreground"}`}
                >
                  {fila.nombreCorto}
                </span>
                <EtiquetaZona pos={fila.posicion} />
              </div>

              {/* Stats */}
              <span className="text-center text-xs text-muted-foreground">{fila.jugados}</span>
              <span className="text-center text-xs text-[#4CAF50] font-bold">{fila.ganados}</span>
              <span className="text-center text-xs text-muted-foreground">{fila.empatados}</span>
              <span className="text-center text-xs text-vcf-red font-bold">{fila.perdidos}</span>
              <span className="text-center text-xs text-muted-foreground hidden sm:block">{fila.golesAFavor}</span>
              <span className="text-center text-xs text-muted-foreground hidden sm:block">{fila.golesEnContra}</span>
              <span
                className={`text-center text-xs font-bold ${
                  fila.diferencia > 0
                    ? "text-[#4CAF50]"
                    : fila.diferencia < 0
                    ? "text-vcf-red"
                    : "text-muted-foreground"
                }`}
              >
                {fila.diferencia > 0 ? `+${fila.diferencia}` : fila.diferencia}
              </span>
              <span
                className={`text-center text-sm font-black ${esVCF ? "text-vcf-orange" : "text-foreground"}`}
              >
                {fila.puntos}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
