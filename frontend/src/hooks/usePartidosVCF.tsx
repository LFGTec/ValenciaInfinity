import { useState, useEffect } from "react";

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

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const VCF_ID = 95;

const MESES_CORTO = [
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
  "Primera Division": "LA LIGA",
  "Copa del Rey": "COPA DEL REY",
  "UEFA Champions League": "CHAMPIONS",
};

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
    competicion:
      COMPETICION_MAP[match.competition.name] ?? match.competition.name,
    jornada: match.matchday ? `JOR. ${match.matchday}` : undefined,
    casa: esLocal,
    escudoRival: rival.crest,
    codigoRival: rival.tla,
    estado,
    resultado: tieneResultado
      ? {
          local: match.score.fullTime.home,
          visitante: match.score.fullTime.away,
        }
      : undefined,
  };
}

export function usePartidosVCF() {
  const [proximos, setProximos] = useState<Partido[]>([]);
  const [jugados, setJugados] = useState<Partido[]>([]);
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasTemporada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodo() {
      try {
        const headers = { "X-Auth-Token": API_KEY };
        const base = `/api-football/v4/teams/${VCF_ID}/matches`;

        const [resProximos, resJugados, resStats] = await Promise.all([
          fetch(`${base}?status=SCHEDULED&competitions=2014&limit=5`, {
            headers,
          }),
          fetch(`${base}?status=FINISHED&competitions=2014&limit=10`, {
            headers,
          }),
          fetch(`${base}?status=FINISHED&competitions=2014`, { headers }),
        ]);

        if (!resProximos.ok)
          throw new Error(`Próximos: Error ${resProximos.status}`);
        if (!resJugados.ok)
          throw new Error(`Jugados: Error ${resJugados.status}`);
        if (!resStats.ok) throw new Error(`Stats: Error ${resStats.status}`);

        const [dataProximos, dataJugados, dataStats] = await Promise.all([
          resProximos.json(),
          resJugados.json(),
          resStats.json(),
        ]);

        setProximos(
          (dataProximos.matches as any[]).map((m) =>
            mapearPartido(m, "PROXIMO"),
          ),
        );
        setJugados(
          (dataJugados.matches as any[])
            .reverse()
            .map((m) => mapearPartido(m, "JUGADO")),
        );

        // Calcular estadísticas manualmente desde los partidos
        const matches = dataStats.matches as any[];

        let ganados = 0,
          empatados = 0,
          perdidos = 0;
        let golesAFavor = 0,
          golesEnContra = 0;

        matches.forEach((m: any) => {
          const esLocal = m.homeTeam.id === VCF_ID;
          golesAFavor += esLocal
            ? m.score.fullTime.home
            : m.score.fullTime.away;
          golesEnContra += esLocal
            ? m.score.fullTime.away
            : m.score.fullTime.home;

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

        setEstadisticas({
          jugados: matches.length,
          ganados,
          empatados,
          perdidos,
          puntos: ganados * 3 + empatados,
          golesAFavor,
          golesEnContra,
          jornada: ultimaJornada,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchTodo();
  }, []);

  return { proximos, jugados, estadisticas, cargando, error };
}
