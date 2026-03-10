// src/hooks/usePastFixtures.ts
import { useState, useEffect } from "react";

interface Participant {
  id: number;
  name: string;
  meta: {
    location: "home" | "away";
  };
}

interface ScoreDetail {
  goals: number;
  participant: "home" | "away";
}

interface Score {
  id: number;
  fixture_id: number;
  participant_id: number;
  score: ScoreDetail;
  description: string;
}

interface Fixture {
  id: number;
  starting_at: string;
  participants: Participant[];
  scores: Score[];
}

interface Round {
  id: number;
  name: string;
  finished: boolean;
  fixtures: Fixture[];
}

interface ScheduleData {
  id: number;
  name: string;
  rounds: Round[];
}

const TEAM_ID = 214;
const URL = `/api/football/schedules/teams/${TEAM_ID}`;

export function useApiSport() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(URL, {
          headers: { Authorization: import.meta.env.VITE_SPORTMONKS_API_TOKEN },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data: { data: ScheduleData[] } = await res.json();

        // Extraemos solo fixtures de partidos finalizados (finished = true)
        const pastFixtures: Fixture[] = data.data.flatMap((schedule) =>
          schedule.rounds.flatMap((round: Round) =>
            round.fixtures.filter(
              (f) =>
                round.finished ||
                f.scores.some((s) => s.description === "FULLTIME"),
            ),
          ),
        );

        setFixtures(pastFixtures);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  return { fixtures, loading, error };
}
