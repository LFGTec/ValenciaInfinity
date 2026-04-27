import { useEffect } from "react";
import { useAtom } from "jotai";
import { partidosAtom, type PartidosState } from "../stores/partidosStore";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CACHE_KEY = "vcf_partidos_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

type CachePayload = Pick<PartidosState, "proximos" | "jugados" | "estadisticas">;

function getCached(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(data: CachePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export interface Partido {
  id: string;
  dia: number;
  mes: number;
  anio: number;
  mesTexto: string;
  hora: string;
  rival: string;
  competicion: string;
  jornada?: string;
  casa: boolean;
  escudoRival?: string;
  codigoRival?: string;
  resultado?: { local: number; visitante: number };
  estado: "JUGADO" | "PROXIMO";
}

export interface EstadisticasTemporada {
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  puntos: number;
  golesAFavor: number;
  golesEnContra: number;
  jornada: number;
}

const VCF_ID = 95;

const MESES_CORTO = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

const COMPETICION_MAP: Record<string, string> = {
  "Primera Division": "LA LIGA",
  "Copa del Rey": "COPA DEL REY",
  "UEFA Champions League": "CHAMPIONS",
};

async function footballFetch(path: string, params: Record<string, string>) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/football-proxy`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path, params }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

function mapearPartido(match: any, estado: "JUGADO" | "PROXIMO"): Partido {
  const fecha = new Date(match.utcDate);
  const esLocal = match.homeTeam.id === VCF_ID;
  const rival = esLocal ? match.awayTeam : match.homeTeam;

  const tieneResultado =
    match.score?.fullTime?.home !== null &&
    match.score?.fullTime?.away !== null;

  return {
    id: String(match.id),
    dia: fecha.getDate(),
    mes: fecha.getMonth(),
    anio: fecha.getFullYear(),
    mesTexto: MESES_CORTO[fecha.getMonth()],
    hora: `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}h`,
    rival: rival.shortName ?? rival.name,
    competicion: COMPETICION_MAP[match.competition.name] ?? match.competition.name,
    jornada: match.matchday ? `JOR. ${match.matchday}` : undefined,
    casa: esLocal,
    escudoRival: rival.crest,
    codigoRival: rival.tla,
    estado,
    resultado: tieneResultado
      ? { local: match.score.fullTime.home, visitante: match.score.fullTime.away }
      : undefined,
  };
}

export function usePartidosVCF() {
  const [state, setState] = useAtom(partidosAtom);

  useEffect(() => {
    if (state.fetched) return;

    async function fetchTodo() {
      const cached = getCached();
      if (cached) {
        setState({ ...cached, cargando: false, error: null, fetched: true });
        return;
      }

      try {
        const base = `/v4/teams/${VCF_ID}/matches`;

        // 2 requests en lugar de 3: los jugados sirven tanto para display como para stats
        const [dataProximos, dataJugados] = await Promise.all([
          footballFetch(base, { status: "SCHEDULED", competitions: "2014", limit: "5" }),
          footballFetch(base, { status: "FINISHED", competitions: "2014" }),
        ]);

        const allJugados = dataJugados.matches as any[];
        let ganados = 0, empatados = 0, perdidos = 0;
        let golesAFavor = 0, golesEnContra = 0;

        allJugados.forEach((m: any) => {
          const esLocal = m.homeTeam.id === VCF_ID;
          golesAFavor += esLocal ? m.score.fullTime.home : m.score.fullTime.away;
          golesEnContra += esLocal ? m.score.fullTime.away : m.score.fullTime.home;

          if (m.score.winner === "DRAW") {
            empatados++;
          } else if (
            (m.score.winner === "HOME_TEAM" && esLocal) ||
            (m.score.winner === "AWAY_TEAM" && !esLocal)
          ) {
            ganados++;
          } else {
            perdidos++;
          }
        });

        const ultimaJornada = allJugados[allJugados.length - 1]?.matchday ?? 0;
        const jugadosRecientes = allJugados.slice(-10).reverse();

        const payload: CachePayload = {
          proximos: dataProximos.matches.map((m: any) => mapearPartido(m, "PROXIMO")),
          jugados: jugadosRecientes.map((m: any) => mapearPartido(m, "JUGADO")),
          estadisticas: {
            jugados: allJugados.length,
            ganados,
            empatados,
            perdidos,
            puntos: ganados * 3 + empatados,
            golesAFavor,
            golesEnContra,
            jornada: ultimaJornada,
          },
        };

        setCache(payload);
        setState({ ...payload, cargando: false, error: null, fetched: true });
      } catch (err: any) {
        setState((prev) => ({ ...prev, error: err.message, cargando: false, fetched: true }));
      }
    }

    fetchTodo();
  }, [state.fetched, setState]);

  return {
    proximos: state.proximos,
    jugados: state.jugados,
    estadisticas: state.estadisticas,
    cargando: state.cargando,
    error: state.error,
  };
}
