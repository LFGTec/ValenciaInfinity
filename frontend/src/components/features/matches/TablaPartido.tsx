import { type Partido } from "../../../hooks/usePartidosVCF";
import { FilaPartido } from "./FilaPartido";

// ─── Tabla genérica ───────────────────────────────────────────────────────────
export function TablaPartidos({
  partidos,
  cargando,
  jugado = false,
  onInfo,
}: {
  partidos: Partido[];
  cargando: boolean;
  jugado?: boolean;
  onInfo: (p: Partido) => void;
}) {
  return (
    <div className="bg-card rounded-xl border-2 border-border overflow-hidden shadow-lg">
      <div className="grid grid-cols-[100px_1fr_auto_auto] gap-4 items-center px-6 py-3 bg-black border-b-2 border-black text-sm font-black text-white uppercase tracking-widest">
        <span>Fecha</span>
        <span>Partido</span>
        <span className="text-center">Lugar</span>
        <span className="text-center">Acciones</span>
      </div>

      {cargando && (
        <div className="px-6 py-10 text-center text-muted-foreground font-bold">
          Cargando partidos...
        </div>
      )}

      {!cargando && partidos.length === 0 && (
        <div className="px-6 py-10 text-center text-muted-foreground font-bold">
          No hay partidos disponibles.
        </div>
      )}

      {!cargando &&
        partidos.map((partido) => (
          <FilaPartido
            key={partido.id}
            partido={partido}
            jugado={jugado}
            onInfo={onInfo}
          />
        ))}
    </div>
  );
}
