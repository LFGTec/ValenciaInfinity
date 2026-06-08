import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, BarChart2 } from "lucide-react";
import { usePartidosVCF, type Partido } from "../hooks/usePartidosVCF";
import { InfoModal } from "@/components/features/matches/InfoModal";
import { CalendarioModal } from "@/components/features/matches/CalendarioModal";
import { TablaPartidos } from "@/components/features/matches/TablaPartido";
const vcfShield = "/EscudoValenciaCF.png";

// ─── MatchesPage ──────────────────────────────────────────────────────────────
export function MatchesPage() {
  const navegar = useNavigate();
  const { proximos, jugados, cargando } = usePartidosVCF();
  const partidoDestacado = proximos[0];

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");
  const [partidoInfo, setPartidoInfo] = useState<Partido | null>(null);
  const [jugadosVisibles, setJugadosVisibles] = useState(5);

  const FILTROS = ["TODOS", "LA LIGA", "EN CASA", "FUERA"];

  const filtrar = (lista: Partido[]) =>
    lista.filter((p) => {
      if (filtroActivo === "TODOS") return true;
      if (filtroActivo === "EN CASA") return p.casa;
      if (filtroActivo === "FUERA") return !p.casa;
      return p.competicion === filtroActivo;
    });

  const jugadosFiltrados = filtrar(jugados);

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-4 py-12 bg-content">
      {mostrarCalendario && (
        <CalendarioModal
          partidos={[...jugados, ...proximos]}
          onClose={() => setMostrarCalendario(false)}
        />
      )}

      {partidoInfo && (
        <InfoModal partido={partidoInfo} onClose={() => setPartidoInfo(null)} />
      )}

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black mb-3 text-foreground">PARTIDOS</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Calendario completo de la temporada 2025/26
        </p>
      </div>

      {/* Filtros + botón calendario */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-3 overflow-x-auto py-2 flex-1">
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              onClick={() => {
                setFiltroActivo(filtro);
                setJugadosVisibles(5);
              }}
              className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base cursor-pointer hover:-translate-y-1 ${
                filtroActivo === filtro
                  ? "bg-vcf-orange text-white"
                  : "bg-card border-2 border-border hover:border-vcf-orange text-foreground"
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
        <button
          onClick={() => navegar("/estadisticas")}
          className="flex items-center gap-2 px-4 md:px-5 py-3 bg-card border-2 border-black hover:border-vcf-orange text-foreground hover:text-vcf-orange rounded-xl font-black transition-all shadow-lg hover:-translate-y-1 whitespace-nowrap text-sm md:text-base cursor-pointer"
        >
          <BarChart2 size={20} />
          ESTADÍSTICAS
        </button>
        <button
          onClick={() => setMostrarCalendario(true)}
          className="flex items-center gap-2 px-4 md:px-5 py-3 bg-white text-black border-2 border-black rounded-xl font-black hover:bg-black hover:text-white transition-all shadow-lg hover:-translate-y-1 whitespace-nowrap text-sm md:text-base cursor-pointer"
        >
          <Calendar size={20} />
          VER CALENDARIO
        </button>
      </div>

      {/* Hero: próximo partido */}
      {cargando ? (
        <div className="bg-card rounded-2xl p-8 mb-8 border-2 border-border flex items-center justify-center h-48">
          <span className="text-muted-foreground font-bold text-lg">
            Cargando próximo partido...
          </span>
        </div>
      ) : partidoDestacado ? (
        <div className="bg-white text-black rounded-2xl p-5 md:p-8 mb-8 shadow-2xl border-2 border-vcf-orange">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto">
              <div className="text-center">
                <div className="text-xs font-bold text-vcf-orange tracking-widest mb-1">
                  PRÓXIMO · {partidoDestacado.competicion}
                  {partidoDestacado.jornada
                    ? ` · ${partidoDestacado.jornada}`
                    : ""}
                </div>
                <div className="text-sm font-bold text-black/70">
                  {partidoDestacado.mesTexto} {partidoDestacado.dia},{" "}
                  {partidoDestacado.anio}
                </div>
                <div className="text-2xl font-black text-vcf-orange">
                  {partidoDestacado.hora}
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-black/20" />
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl p-2 border-2 border-vcf-orange">
                    <img
                      src={vcfShield}
                      alt="Valencia CF"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-black text-sm md:text-base text-black">
                    VALENCIA CF
                  </div>
                  <div className="text-xs text-black/60">
                    {partidoDestacado.casa ? "Local" : "Visitante"}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-vcf-orange">VS</div>
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl border-2 border-gray-300 overflow-hidden">
                    {partidoDestacado.escudoRival ? (
                      <img
                        src={partidoDestacado.escudoRival}
                        alt={partidoDestacado.rival}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg font-black text-black">
                        {partidoDestacado.codigoRival ??
                          partidoDestacado.rival.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="font-black text-sm md:text-base text-black">
                    {partidoDestacado.rival.toUpperCase()}
                  </div>
                  <div className="text-xs text-black/60">
                    {partidoDestacado.casa ? "Visitante" : "Local"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto sm:min-w-[180px]">
              <button
                onClick={() => navegar("/match-rooms")}
                className="flex-1 sm:flex-initial px-4 md:px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-all shadow-md hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Video size={18} /> MATCH ROOM
              </button>
              <button
                onClick={() => navegar("/fanzone")}
                className="flex-1 sm:flex-initial px-4 md:px-6 py-3 bg-white border-2 border-vcf-orange text-vcf-orange rounded-lg font-black transition-all shadow-md hover:-translate-y-1 cursor-pointer text-sm md:text-base text-center"
              >
                HACER PREDICCIÓN
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Próximos partidos */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            PRÓXIMOS <span className="text-vcf-orange">PARTIDOS</span>
          </h2>
          <span className="text-muted-foreground font-bold text-sm">
            {filtrar(proximos).length} partidos
          </span>
        </div>
        <TablaPartidos
          partidos={filtrar(proximos)}
          cargando={cargando}
          jugado={false}
          onInfo={setPartidoInfo}
        />
      </div>

      {/* Últimos resultados */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            ÚLTIMOS <span className="text-vcf-orange">RESULTADOS</span>
          </h2>
          <span className="text-muted-foreground font-bold text-sm">
            {jugadosFiltrados.length} partidos
          </span>
        </div>
        <TablaPartidos
          partidos={jugadosFiltrados.slice(0, jugadosVisibles)}
          cargando={cargando}
          jugado={true}
          onInfo={setPartidoInfo}
        />
        <div className="flex gap-3 mt-4">
          {jugadosVisibles < jugadosFiltrados.length && (
            <button
              onClick={() => setJugadosVisibles((v) => v + 5)}
              className="flex-1 py-3 bg-card border-2 border-border hover:border-vcf-orange text-foreground hover:text-vcf-orange font-black rounded-xl transition-all"
            >
              VER MÁS ({Math.min(5, jugadosFiltrados.length - jugadosVisibles)}{" "}
              más)
            </button>
          )}
          {jugadosVisibles > 5 && (
            <button
              onClick={() => setJugadosVisibles(5)}
              className="flex-1 py-3 bg-card border-2 border-border hover:border-vcf-orange text-foreground hover:text-vcf-orange font-black rounded-xl transition-all"
            >
              VER MENOS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
