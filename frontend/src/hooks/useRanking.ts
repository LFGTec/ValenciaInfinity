import { useEffect, useState } from "react";
import { rankingService, type RankingUser } from "@/services/rankingService";

export function useRanking() {
  const [ranking, setRanking] =
    useState<RankingUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  async function loadRanking() {
    try {
      setLoading(true);

      const data =
        await rankingService.getRanking();

      setRanking(data);

    } finally {

      setLoading(false);

    }
  }

  return {
    ranking,
    rankingLoading: loading,
    reloadRanking: loadRanking,
  };
}