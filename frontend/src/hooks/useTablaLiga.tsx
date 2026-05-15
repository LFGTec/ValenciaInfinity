import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CACHE_KEY = "vcf_tabla_liga_v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

export interface FilaTabla {
  posicion: number;
  equipoId: number;
  nombre: string;
  nombreCorto: string;
  escudo: string;
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesAFavor: number;
  golesEnContra: number;
  diferencia: number;
  puntos: number;
}

async function footballFetch(path: string, params: Record<string, string>) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/football-proxy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path, params }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

function leerCache(): FilaTabla[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function guardarCache(data: FilaTabla[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export function useTablaLiga() {
  const [tabla, setTabla] = useState<FilaTabla[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = leerCache();
    if (cached) {
      setTabla(cached);
      setCargando(false);
      return;
    }

    footballFetch("/v4/competitions/2014/standings", {})
      .then((data) => {
        const totalStandings = data.standings?.find(
          (s: any) => s.type === "TOTAL"
        );
        if (!totalStandings) throw new Error("Sin datos de clasificación");

        const filas: FilaTabla[] = totalStandings.table.map((row: any) => ({
          posicion: row.position,
          equipoId: row.team.id,
          nombre: row.team.name,
          nombreCorto: row.team.shortName ?? row.team.name,
          escudo: row.team.crest ?? "",
          jugados: row.playedGames,
          ganados: row.won,
          empatados: row.draw,
          perdidos: row.lost,
          golesAFavor: row.goalsFor,
          golesEnContra: row.goalsAgainst,
          diferencia: row.goalDifference,
          puntos: row.points,
        }));

        guardarCache(filas);
        setTabla(filas);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  return { tabla, cargando, error };
}
