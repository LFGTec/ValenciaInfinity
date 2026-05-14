import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabaseClient";
import type { LiveMatchState } from "@/services/matchRoomsService";

// Solo actúa en partidos con match_id que empiece por "sim-"
// El primer cliente que entre a la sala y no detecte un driver activo
// arranca la simulación y escribe a Supabase en tiempo real.

const MS_PER_MINUTE = 1500;
const HALFTIME_MS   = 5_000;
const DRIVER_TTL_MS = 8_000; // si updated_at tiene más de esto, nadie está manejando

// ── Datos del partido simulado ─────────────────────────────────────────────────

const LINEUPS = {
  home: [
    { number: 1,  name: "Mamardashvili", position: "PO" },
    { number: 2,  name: "T. Correia",    position: "LD" },
    { number: 5,  name: "Mosquera",      position: "CT" },
    { number: 6,  name: "Yarek",         position: "CT" },
    { number: 3,  name: "Gayà",          position: "LI" },
    { number: 8,  name: "Almeida",       position: "MC" },
    { number: 14, name: "Guerra",        position: "MC" },
    { number: 10, name: "Pepelu",        position: "MC" },
    { number: 7,  name: "Ricard",        position: "ED" },
    { number: 11, name: "Diego López",   position: "EI" },
    { number: 9,  name: "Hugo Duro",     position: "DC" },
  ],
  away: [
    { number: 13, name: "Oblak",         position: "PO" },
    { number: 2,  name: "Molina",        position: "LD" },
    { number: 3,  name: "Giménez",       position: "CT" },
    { number: 15, name: "Savić",         position: "CT" },
    { number: 18, name: "Lino",          position: "LI" },
    { number: 14, name: "De Paul",       position: "MC" },
    { number: 6,  name: "Koke",          position: "MC" },
    { number: 8,  name: "Barrios",       position: "MC" },
    { number: 21, name: "Correa",        position: "ED" },
    { number: 7,  name: "Griezmann",     position: "SS" },
    { number: 9,  name: "J. Álvarez",    position: "DC" },
  ],
};

const SCRIPTED_EVENTS = [
  // ── Primera parte ─────────────────────────────────────────────────────────────
  { minute: 5,  event: { type: "GOAL",         minute: 5,  team: "Valencia CF",     player: "Hugo Duro",   assist: "Guerra"   }, homeScore: 1 },
  { minute: 12, event: { type: "YELLOW_CARD",  minute: 12, team: "Atlético Madrid", player: "Barrios"                        } },
  { minute: 18, event: { type: "GOAL",         minute: 18, team: "Atlético Madrid", player: "Griezmann",   assist: "De Paul"  }, awayScore: 1 },
  { minute: 25, event: { type: "GOAL",         minute: 25, team: "Valencia CF",     player: "Pepelu",      assist: "Ricard"   }, homeScore: 2 },
  { minute: 33, event: { type: "YELLOW_CARD",  minute: 33, team: "Valencia CF",     player: "Mosquera"                       } },
  { minute: 38, event: { type: "GOAL",         minute: 38, team: "Atlético Madrid", player: "J. Álvarez",  assist: "Griezmann"}, awayScore: 2 },
  { minute: 43, event: { type: "YELLOW_CARD",  minute: 43, team: "Atlético Madrid", player: "Savić"                          } },
  // ── Segunda parte ─────────────────────────────────────────────────────────────
  { minute: 48, event: { type: "YELLOW_CARD",  minute: 48, team: "Valencia CF",     player: "Almeida"                        } },
  { minute: 52, event: { type: "RED_CARD",     minute: 52, team: "Valencia CF",     player: "Almeida"                        } }, // 2ª amarilla
  { minute: 55, event: { type: "SUBSTITUTION", minute: 55, team: "Valencia CF",     playerIn: "Marcos André",  playerOut: "Diego López"  } },
  { minute: 61, event: { type: "GOAL",         minute: 61, team: "Atlético Madrid", player: "Correa",      assist: "Griezmann"}, awayScore: 3 },
  { minute: 67, event: { type: "GOAL",         minute: 67, team: "Atlético Madrid", player: "Griezmann"                      }, awayScore: 4 },
  { minute: 72, event: { type: "SUBSTITUTION", minute: 72, team: "Valencia CF",     playerIn: "Cenk Özkacar", playerOut: "Pepelu"       } },
  { minute: 75, event: { type: "GOAL",         minute: 75, team: "Valencia CF",     player: "Hugo Duro",   assist: "Guerra"   }, homeScore: 3 },
  { minute: 80, event: { type: "SUBSTITUTION", minute: 80, team: "Atlético Madrid", playerIn: "Witsel",       playerOut: "Koke"         } },
  { minute: 84, event: { type: "YELLOW_CARD",  minute: 84, team: "Atlético Madrid", player: "Molina"                         } },
  { minute: 87, event: { type: "GOAL",         minute: 87, team: "Valencia CF",     player: "Guerra"                         }, homeScore: 4 },
  { minute: 90, event: { type: "GOAL",         minute: 90, team: "Valencia CF",     player: "Hugo Duro"                      }, homeScore: 5 }, // hat-trick 90'!
];

const STATS_SNAPSHOTS = [
  { minute: 15, stats: { possession: { home: 60, away: 40 }, totalShots: { home: 5,  away: 2  }, shotsOnTarget: { home: 3, away: 1  }, corners: { home: 3, away: 1  }, fouls: { home: 2,  away: 5  }, yellowCards: { home: 0, away: 1 } } },
  { minute: 30, stats: { possession: { home: 56, away: 44 }, totalShots: { home: 9,  away: 6  }, shotsOnTarget: { home: 5, away: 3  }, corners: { home: 5, away: 2  }, fouls: { home: 5,  away: 8  }, yellowCards: { home: 1, away: 1 } } },
  { minute: 45, stats: { possession: { home: 53, away: 47 }, totalShots: { home: 12, away: 9  }, shotsOnTarget: { home: 6, away: 5  }, corners: { home: 6, away: 3  }, fouls: { home: 7,  away: 11 }, yellowCards: { home: 1, away: 2 } } },
  { minute: 60, stats: { possession: { home: 38, away: 62 }, totalShots: { home: 13, away: 16 }, shotsOnTarget: { home: 6, away: 9  }, corners: { home: 6, away: 7  }, fouls: { home: 11, away: 13 }, yellowCards: { home: 2, away: 2 } } }, // con 10
  { minute: 75, stats: { possession: { home: 35, away: 65 }, totalShots: { home: 16, away: 20 }, shotsOnTarget: { home: 8, away: 11 }, corners: { home: 7, away: 10 }, fouls: { home: 13, away: 15 }, yellowCards: { home: 2, away: 2 } } },
  { minute: 90, stats: { possession: { home: 34, away: 66 }, totalShots: { home: 20, away: 23 }, shotsOnTarget: { home: 11, away: 12}, corners: { home: 8, away: 11 }, fouls: { home: 15, away: 17 }, yellowCards: { home: 2, away: 3 } } },
];

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useMatchSimulation(
  matchId: string,
  liveMatch: LiveMatchState | null,
  loading: boolean
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Estado mutable del partido — evita closures stale en el loop async
  const stateRef = useRef<{
    minute: number;
    homeScore: number;
    awayScore: number;
    status: string;
    events: object[];
    stats: object;
  } | null>(null);

  useEffect(() => {
    // Solo para partidos simulados
    if (!matchId.startsWith("sim-")) return;
    // Esperar a que useLiveMatch termine de cargar
    if (loading) return;

    // Si ya hay un driver activo (updated_at reciente), no arrancar otro
    if (liveMatch?.status === "IN_PLAY" || liveMatch?.status === "PAUSED") {
      const lastUpdate = new Date(liveMatch.updated_at).getTime();
      if (Date.now() - lastUpdate < DRIVER_TTL_MS) return;
    }

    // Si el partido terminó → reiniciar desde 0 (limpia datos viejos)
    const isFinished = liveMatch?.status === "FINISHED";

    const startMinute = isFinished ? 0 : (liveMatch?.minute ?? 0);
    const startEvents = isFinished ? [] : (liveMatch?.events ?? []) as object[];
    const startHome   = isFinished ? 0 : (liveMatch?.home_score ?? 0);
    const startAway   = isFinished ? 0 : (liveMatch?.away_score ?? 0);
    const startStats  = isFinished ? {} : (liveMatch?.stats ?? {});

    stateRef.current = {
      minute:     startMinute,
      homeScore:  startHome,
      awayScore:  startAway,
      status:     "IN_PLAY",
      events:     startEvents,
      stats:      startStats,
    };

    async function push() {
      const s = stateRef.current!;
      await supabase.from("match_live_state").upsert(
        {
          match_id:    matchId,
          home_team:   "Valencia CF",
          away_team:   "Atlético Madrid",
          home_score:  s.homeScore,
          away_score:  s.awayScore,
          minute:      s.minute,
          status:      s.status,
          competition: "LA LIGA",
          events:      s.events,
          stats:       s.stats,
          lineups:     LINEUPS,
          updated_at:  new Date().toISOString(),
        },
        { onConflict: "match_id" }
      );
    }

    async function tick() {
      const s = stateRef.current!;
      if (s.status === "FINISHED") return;

      const next = s.minute + 1;

      // Descanso
      if (next === 45) {
        stateRef.current = { ...s, minute: 45, status: "PAUSED" };
        await push();
        timerRef.current = setTimeout(async () => {
          stateRef.current = { ...stateRef.current!, minute: 46, status: "IN_PLAY" };
          await push();
          timerRef.current = setTimeout(tick, MS_PER_MINUTE);
        }, HALFTIME_MS);
        return;
      }

      // Eventos scripted
      let { homeScore, awayScore, events } = s;
      for (const scripted of SCRIPTED_EVENTS.filter((e) => e.minute === next)) {
        events = [...events, scripted.event];
        if (scripted.homeScore !== undefined) homeScore = scripted.homeScore;
        if (scripted.awayScore !== undefined) awayScore = scripted.awayScore;
      }

      // Stats snapshot
      const snap = STATS_SNAPSHOTS.find((ss) => ss.minute === next);

      stateRef.current = {
        minute:    next,
        homeScore,
        awayScore,
        status:    next >= 90 ? "FINISHED" : "IN_PLAY",
        events,
        stats:     snap ? snap.stats : s.stats,
      };

      await push();

      if (stateRef.current.status !== "FINISHED") {
        timerRef.current = setTimeout(tick, MS_PER_MINUTE);
      }
    }

    // Arrancar el loop
    timerRef.current = setTimeout(tick, MS_PER_MINUTE);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, loading]);
}
