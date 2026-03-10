import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";
import type { Match } from "../services/matchService";
import "./Matches.css";

export default function MatchesTable() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const data = await getMatches();
      setMatches(data);
    };

    fetchMatches();
  }, []);

  return (
    <div className="matches-container">
      <h2 className="matches-title">Próximos Partidos</h2>

      <table className="matches-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Partido</th>
            <th>Estadio</th>
            <th>Liga</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{new Date(match.fecha).toLocaleDateString()}</td>
              <td>
                {match.equipo_local} vs {match.equipo_visitante}
              </td>
              <td>{match.estadio}</td>
              <td>{match.liga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
