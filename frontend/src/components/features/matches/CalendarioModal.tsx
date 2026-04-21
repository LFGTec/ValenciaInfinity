import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type Partido } from "../../../hooks/usePartidosVCF";
import {
  COMP_COLORS,
  colorComp,
  NOMBRES_MES,
  NOMBRES_DIA,
  primerDiaDeMes,
  diasEnMes,
} from "../../../constants/matches";

// ─── Modal Calendario ─────────────────────────────────────────────────────────
export function CalendarioModal({
  partidos,
  onClose,
}: {
  partidos: Partido[];
  onClose: () => void;
}) {
  const navegar = useNavigate();
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [seleccionado, setSeleccionado] = useState<Partido | null>(null);

  const mesPrev = () => {
    if (mes === 0) {
      setMes(11);
      setAnio((a) => a - 1);
    } else setMes((m) => m - 1);
  };
  const mesSig = () => {
    if (mes === 11) {
      setMes(0);
      setAnio((a) => a + 1);
    } else setMes((m) => m + 1);
  };

  const primerDia = primerDiaDeMes(anio, mes);
  const diasDelMes = diasEnMes(anio, mes);
  const celdas = Array.from({ length: primerDia + diasDelMes }, (_, i) =>
    i < primerDia ? null : i - primerDia + 1,
  );
  while (celdas.length % 7 !== 0) celdas.push(null);

  const partidoDelDia = (d: number | null) =>
    d
      ? partidos.find((p) => p.dia === d && p.mes === mes && p.anio === anio)
      : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border-2 border-vcf-orange rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-black via-vcf-orange/30 to-black border-b-2 border-vcf-orange">
          <button
            onClick={mesPrev}
            className="w-9 h-9 rounded-full bg-vcf-orange/20 hover:bg-vcf-orange hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <h2 className="font-black text-2xl text-white uppercase tracking-widest">
              {NOMBRES_MES[mes]}
            </h2>
            <span className="text-muted-foreground text-sm">{anio}</span>
          </div>
          <button
            onClick={mesSig}
            className="w-9 h-9 rounded-full bg-vcf-orange/20 hover:bg-vcf-orange hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="ml-4 w-9 h-9 rounded-full bg-muted hover:bg-vcf-red hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 px-6 py-3 border-b border-border bg-muted/40">
          {Object.entries(COMP_COLORS).map(([comp, color]) => (
            <div key={comp} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground font-bold">
                {comp}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block bg-[#4CAF50]" />
            <span className="text-sm text-muted-foreground font-bold">HOY</span>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {NOMBRES_DIA.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-sm font-black text-muted-foreground uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {celdas.map((dia, idx) => {
            const partido = partidoDelDia(dia);
            const esHoy =
              dia === hoy.getDate() &&
              mes === hoy.getMonth() &&
              anio === hoy.getFullYear();
            const color = partido ? colorComp(partido.competicion) : null;
            return (
              <div
                key={idx}
                onClick={() => partido && setSeleccionado(partido)}
                className={`relative min-h-[72px] p-2 border-b border-r border-border flex flex-col items-center
                  ${partido ? "cursor-pointer hover:bg-vcf-orange/10 transition-colors" : ""}
                  ${!dia ? "bg-muted/30" : ""}`}
              >
                {dia && (
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm mb-1
                    ${esHoy ? "bg-[#4CAF50] text-white" : "text-foreground"}`}
                  >
                    {dia}
                  </span>
                )}
                {partido && (
                  <div
                    className="w-full rounded-md px-1 py-0.5 text-center"
                    style={{
                      backgroundColor: color + "33",
                      border: `1px solid ${color}88`,
                    }}
                  >
                    <div
                      className="text-xs font-black truncate"
                      style={{ color: color! }}
                    >
                      {partido.casa ? "🏟" : "✈️"} {partido.rival.split(" ")[0]}
                    </div>
                    <div className="text-xs text-foreground/70">
                      {partido.hora}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {seleccionado && (
          <div className="px-6 py-4 bg-vcf-orange/10 border-t-2 border-vcf-orange flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colorComp(seleccionado.competicion) + "33",
                }}
              >
                <span className="text-2xl">
                  {seleccionado.casa ? "🏟" : "✈️"}
                </span>
              </div>
              <div>
                <div className="font-black text-foreground text-lg">
                  Valencia CF vs {seleccionado.rival}
                </div>
                <div className="text-muted-foreground text-base">
                  {NOMBRES_MES[seleccionado.mes]} {seleccionado.dia} ·{" "}
                  {seleccionado.hora}
                </div>
                <span
                  className="inline-block text-sm font-black px-2 py-0.5 rounded mt-1 text-white"
                  style={{
                    backgroundColor: colorComp(seleccionado.competicion),
                  }}
                >
                  {seleccionado.competicion}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  navegar("/juego");
                }}
                className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-black text-sm hover:bg-[#a86d12] transition-colors"
              >
                ROOM
              </button>
              <button
                onClick={() => setSeleccionado(null)}
                className="px-4 py-2 bg-muted border border-border rounded-lg font-black text-sm text-foreground hover:bg-border transition-colors"
              >
                CERRAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
