import { useEffect, useState } from "react";
import { playersService, type Player } from "@/services/teamService";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playersService
      .getAll()
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, []);

  return { players, loading };
}