import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { type Partido } from "../../../hooks/usePartidosVCF";
import { colorComp } from "../../../constants/matches";

const vcfShield = "/EscudoValenciaCF.png";

// ─── Fila de partido ──────────────────────────────────────────────────────────
export function FilaPartido({
  partido,
  jugado = false,
  onInfo,
}: {
  partido: Partido;
  jugado?: boolean;
  onInfo: (p: Partido) => void;
}) {
  const navegar = useNavigate();

  return (
    <div className="grid grid-cols-[100px_1fr_auto_auto] gap-4 items-center px-6 py-5 border-b border-border last:border-0 hover:bg-vcf-orange/5 transition-colors">
      <div className="text-center">
        <div className="text-vcf-orange font-black text-sm tracking-widest">
          {partido.mesTexto}
        </div>
        <div className="text-4xl font-black text-foreground leading-none">
          {partido.dia}
        </div>
        <div className="text-base text-muted-foreground font-bold">
          {partido.hora}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0 p-1">
            <img
              src={vcfShield}
              alt="Valencia CF"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-black text-lg text-foreground">
            VALENCIA CF
          </span>
        </div>

        {jugado && partido.resultado ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg">
            <span className="font-black text-xl text-white">
              {partido.casa
                ? `${partido.resultado.local} - ${partido.resultado.visitante}`
                : `${partido.resultado.visitante} - ${partido.resultado.local}`}
            </span>
          </div>
        ) : (
          <span className="font-black text-vcf-orange text-xl px-2">VS</span>
        )}

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-muted rounded-full flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
            {partido.escudoRival ? (
              <img
                src={partido.escudoRival}
                alt={partido.rival}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-xs font-bold text-foreground">
                {partido.codigoRival ?? partido.rival.slice(0, 3).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-black text-lg text-foreground">
              {partido.rival}
            </div>
            <span
              className="inline-block px-2 py-0.5 rounded text-sm font-black text-white"
              style={{ backgroundColor: colorComp(partido.competicion) }}
            >
              {partido.competicion}
              {partido.jornada ? ` · ${partido.jornada}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-base font-bold px-4">
        <MapPin
          size={16}
          className={partido.casa ? "text-vcf-orange" : "text-muted-foreground"}
        />
        <span
          className={partido.casa ? "text-vcf-orange" : "text-muted-foreground"}
        >
          {partido.casa ? "Casa" : "Fuera"}
        </span>
      </div>

      <div className="flex gap-2">
        {!jugado && (
          <button
            onClick={() => navegar("/juego")}
            className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg text-base font-black hover:bg-[#e05516] transition-all shadow-md hover:scale-105"
          >
            ROOM
          </button>
        )}
        <button
          onClick={() => onInfo(partido)}
          className="px-4 py-2 bg-white border-2 border-white text-vcf-orange rounded-lg text-base font-black hover:bg-gray-100 transition-all shadow-md hover:scale-105"
        >
          INFO
        </button>
      </div>
    </div>
  );
}
