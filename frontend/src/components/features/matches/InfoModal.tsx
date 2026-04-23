import { X } from "lucide-react";
const vcfShield = "/EscudoValenciaCF.png";
import { type Partido } from "../../../hooks/usePartidosVCF";
import { colorComp, NOMBRES_MES } from "../../../constants/matches.ts";

// ─── Modal Info Partido ───────────────────────────────────────────────────────
export function InfoModal({
  partido,
  onClose,
}: {
  partido: Partido;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border-2 border-vcf-orange rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-black via-vcf-orange/30 to-black border-b-2 border-vcf-orange">
          <span
            className="text-sm font-black px-3 py-1 rounded text-white"
            style={{ backgroundColor: colorComp(partido.competicion) }}
          >
            {partido.competicion}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted hover:bg-vcf-red hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 px-6 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl p-2 border-2 border-vcf-orange">
              <img
                src={vcfShield}
                alt="Valencia CF"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-black text-base text-foreground">
              VALENCIA CF
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {partido.casa ? "Local" : "Visitante"}
            </div>
          </div>

          <div className="text-3xl font-black text-vcf-orange">VS</div>

          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl overflow-hidden border-2 border-border">
              {partido.escudoRival ? (
                <img
                  src={partido.escudoRival}
                  alt={partido.rival}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-lg font-black text-foreground">
                  {partido.codigoRival ??
                    partido.rival.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div className="font-black text-base text-foreground">
              {partido.rival.toUpperCase()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {partido.casa ? "Visitante" : "Local"}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">
              Fecha
            </div>
            <div className="font-black text-foreground">
              {partido.dia} {NOMBRES_MES[partido.mes]} {partido.anio}
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">
              Hora
            </div>
            <div className="font-black text-foreground">{partido.hora}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">
              Jornada
            </div>
            <div className="font-black text-foreground">
              {partido.jornada ?? "—"}
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">
              Lugar
            </div>
            <div
              className={`font-black ${partido.casa ? "text-vcf-orange" : "text-foreground"}`}
            >
              {partido.casa ? "🏟 Casa" : "✈️ Fuera"}
            </div>
          </div>
          {partido.resultado && (
            <div className="col-span-2 bg-black rounded-xl p-4 border border-vcf-orange flex items-center justify-center gap-4">
              <span className="text-white font-black text-sm">VALENCIA CF</span>
              <span className="text-vcf-orange font-black text-2xl">
                {partido.casa
                  ? `${partido.resultado.local} - ${partido.resultado.visitante}`
                  : `${partido.resultado.visitante} - ${partido.resultado.local}`}
              </span>
              <span className="text-white font-black text-sm">
                {partido.rival.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
