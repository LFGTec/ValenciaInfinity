import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";
import { usePartidosVCF, type Partido } from "../hooks/usePartidosVCF";
import { EstadisticasTemporadaCard } from "../components/features/EstadisticasTemporada";

const COMP_COLORS: Record<string, string> = {
  "LA LIGA": "#ff671f",
  CHAMPIONS: "#1a1a2e",
};

const colorComp = (comp: string) => COMP_COLORS[comp] ?? "#D18817";

const NOMBRES_MES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const NOMBRES_DIA = ["L", "M", "X", "J", "V", "S", "D"];

function primerDiaDeMes(anio: number, mes: number): number {
  const d = new Date(anio, mes, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function diasEnMes(anio: number, mes: number): number {
  return new Date(anio, mes + 1, 0).getDate();
}

// ─── Modal Info Partido ───────────────────────────────────────────────────────
function InfoModal({
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

// ─── Modal Calendario ─────────────────────────────────────────────────────────
function CalendarioModal({
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

// ─── Fila de partido ──────────────────────────────────────────────────────────
function FilaPartido({
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

// ─── Tabla genérica ───────────────────────────────────────────────────────────
function TablaPartidos({
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

// ─── MatchesPage ──────────────────────────────────────────────────────────────
export function MatchesPage() {
  const navegar = useNavigate();
  const { proximos, jugados, estadisticas, cargando } = usePartidosVCF();
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
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
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
        <h1 className="text-5xl font-black mb-3 text-foreground">PARTIDOS</h1>
        <p className="text-base text-muted-foreground">
          Calendario completo de la temporada 2025/26
        </p>
      </div>

      {/* Filtros + botón calendario */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-1 flex-1">
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              onClick={() => {
                setFiltroActivo(filtro);
                setJugadosVisibles(5);
              }}
              className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base ${
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
          onClick={() => setMostrarCalendario(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black border-2 border-black rounded-xl font-black hover:bg-black hover:text-white transition-all shadow-lg hover:scale-105 whitespace-nowrap text-base"
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
        <div className="bg-white text-black rounded-2xl p-8 mb-8 shadow-2xl border-2 border-vcf-orange">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
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
              <div className="w-px h-16 bg-black/20" />
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl p-2 border-2 border-vcf-orange">
                    <img
                      src={vcfShield}
                      alt="Valencia CF"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-black text-base text-black">
                    VALENCIA CF
                  </div>
                  <div className="text-xs text-black/60">
                    {partidoDestacado.casa ? "Local" : "Visitante"}
                  </div>
                </div>
                <div className="text-3xl font-black text-vcf-orange">VS</div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl border-2 border-gray-300 overflow-hidden">
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
                  <div className="font-black text-base text-black">
                    {partidoDestacado.rival.toUpperCase()}
                  </div>
                  <div className="text-xs text-black/60">
                    {partidoDestacado.casa ? "Visitante" : "Local"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[180px]">
              <button
                onClick={() => navegar("/juego")}
                className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-all shadow-md hover:scale-105 flex items-center gap-2 text-base"
              >
                <Video size={18} /> MATCH ROOM
              </button>
              <button
                onClick={() => navegar("/fanzone")}
                className="px-6 py-3 bg-white border-2 border-vcf-orange text-vcf-orange rounded-lg font-black transition-all shadow-md hover:shadow-lg hover:scale-105 text-base"
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
          <h2 className="text-3xl font-black text-foreground">
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
          <h2 className="text-3xl font-black text-foreground">
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

      {/* Estadísticas temporada */}
      {estadisticas && (
        <div className="mt-16 mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-black text-foreground">
              ESTADÍSTICAS <span className="text-vcf-orange">TEMPORADA</span>
            </h2>
          </div>
          <EstadisticasTemporadaCard stats={estadisticas} />
        </div>
      )}
    </div>
  );
}
