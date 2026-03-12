import { useEffect, useState } from "react";
import { getRanking } from "../services/rankingService";
import type { Ranking } from "../services/rankingService";

export default function RankingTable() {
  const [ranking, setRanking] = useState<Ranking[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getRanking();
      setRanking(data);
    };

    fetchRanking();
  }, []);

  return (
    <div className="ranking-container">
      <table className="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fan</th>
            <th>Puntos</th>
            <th>Nivel</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((fan, index) => (
            <tr key={fan.id}>
              <td>{index + 1}</td>
              <td>{fan.fan_nombre}</td>
              <td>{fan.puntos}</td>
              <td>{fan.nivel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
