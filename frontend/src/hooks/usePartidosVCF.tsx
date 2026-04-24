import { useEffect } from "react";
import { useAtom } from "jotai";
import { partidosAtom } from "../stores/partidosStore";

export interface Partido {
  id: string; //atributos
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

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY; // api key
const VCF_ID = 95; // id valencia

const MESES_CORTO = [
  // meses corto
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const COMPETICION_MAP: Record<string, string> = {
  // nombres cortos
  "Primera Division": "LA LIGA",
  "Copa del Rey": "COPA DEL REY",
  "UEFA Champions League": "CHAMPIONS",
};

function mapearPartido(match: any, estado: "JUGADO" | "PROXIMO"): Partido {
  //funcion que adapta los datos de la api en el objeto partido
  const fecha = new Date(match.utcDate); // fecha api
  const esLocal = match.homeTeam.id === VCF_ID; // es local?
  const rival = esLocal ? match.awayTeam : match.homeTeam; // rival

  const tieneResultado =
    // ya jugado?
    match.score?.fullTime?.home !== null &&
    match.score?.fullTime?.away !== null;

  return {
    id: String(match.id), // id string
    dia: fecha.getDate(),
    mes: fecha.getMonth(),
    anio: fecha.getFullYear(),
    mesTexto: MESES_CORTO[fecha.getMonth()], // mes texto
    hora: `${String(fecha.getHours()).padStart(2, "0")}:${String(
      fecha.getMinutes(),
    ).padStart(2, "0")}h`, // formato hora
    rival: rival.shortName ?? rival.name, // nombre rival
    competicion:
      COMPETICION_MAP[match.competition.name] ?? match.competition.name, // map liga
    jornada: match.matchday ? `JOR. ${match.matchday}` : undefined, // jornada
    casa: esLocal,
    escudoRival: rival.crest,
    codigoRival: rival.tla,
    estado,
    resultado: tieneResultado
      ? {
          local: match.score.fullTime.home,
          visitante: match.score.fullTime.away,
        }
      : undefined, // si hay marcador
  };
}

export function usePartidosVCF() {
  const [state, setState] = useAtom(partidosAtom);

  useEffect(() => {
    if (state.fetched) return; // ya se cargó, no volver a pedir

    async function fetchTodo() {
      try {
        const headers = { "X-Auth-Token": API_KEY };
        const base = `/api-football/v4/teams/${VCF_ID}/matches`;

        const [resProximos, resJugados, resStats] = await Promise.all([
          fetch(`${base}?status=SCHEDULED&competitions=2014&limit=5`, { headers }),
          fetch(`${base}?status=FINISHED&competitions=2014&limit=10`, { headers }),
          fetch(`${base}?status=FINISHED&competitions=2014`, { headers }),
        ]);

        if (!resProximos.ok) throw new Error(`Proximos: ${resProximos.status}`);
        if (!resJugados.ok) throw new Error(`Jugados: ${resJugados.status}`);
        if (!resStats.ok) throw new Error(`Stats: ${resStats.status}`);

        const [dataProximos, dataJugados, dataStats] = await Promise.all([
          resProximos.json(),
          resJugados.json(),
          resStats.json(),
        ]);

        const matches = dataStats.matches as any[];
        let ganados = 0, empatados = 0, perdidos = 0;
        let golesAFavor = 0, golesEnContra = 0;

        matches.forEach((m: any) => {
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

        const ultimaJornada = matches[matches.length - 1]?.matchday ?? 0;

        setState({
          proximos: dataProximos.matches.map((m: any) => mapearPartido(m, "PROXIMO")),
          jugados: dataJugados.matches.reverse().map((m: any) => mapearPartido(m, "JUGADO")),
          estadisticas: {
            jugados: matches.length,
            ganados,
            empatados,
            perdidos,
            puntos: ganados * 3 + empatados,
            golesAFavor,
            golesEnContra,
            jornada: ultimaJornada,
          },
          cargando: false,
          error: null,
          fetched: true,
        });
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
