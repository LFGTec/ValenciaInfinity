import { useEffect, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useSeasonStatus() {
  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/season-status`
        );

        if (!res.ok) throw new Error("Error fetching season status");

        const data = await res.json();

        setSeason(data); 
      } catch (err) {
        console.error("season-status error:", err);
        setSeason(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeason();
  }, []);

  return {
    season,
    loading,
  };
}