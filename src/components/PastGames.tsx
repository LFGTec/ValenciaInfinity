// src/components/PastFixtures.tsx
import { useApiSport } from "../hooks/useApiSport";

export function PastGames() {
  const { fixtures, loading, error } = useApiSport();

  if (loading) return <p>Cargando partidos pasados...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="fixtures-container">
      <h2 className="fixtures-title">Partidos Pasados</h2>
      {fixtures.map((f) => {
        const local = f.participants.find((p) => p.meta.location === "home");
        const visitante = f.participants.find(
          (p) => p.meta.location === "away",
        );

        const localScore = f.scores.find((s) => s.participant_id === local?.id)
          ?.score.goals;
        const visitanteScore = f.scores.find(
          (s) => s.participant_id === visitante?.id,
        )?.score.goals;

        return (
          <div key={f.id} className="fixture-card">
            <p className="fixture-date">
              {new Date(f.starting_at).toLocaleString()}
            </p>
            <p className="fixture-teams">
              {local?.name} ({localScore ?? 0}) vs {visitante?.name} (
              {visitanteScore ?? 0})
            </p>
          </div>
        );
      })}
    </div>
  );
}
