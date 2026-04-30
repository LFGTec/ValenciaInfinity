import { useEffect, useState, useCallback } from "react";
import { getMapGeoData } from "@/services/mapService";
import { supabase } from "@/services/supabaseClient";

export const useMapUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const geo = await getMapGeoData();
      setData(geo);
    } catch (err) {
      console.error(err);
      setError("Error cargando mapa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const channel = supabase
      .channel("map-users-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_locations",
        },
        () => {
          console.log("📡 user_locations change → refetch");
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_preferences",
        },
        () => {
          console.log("📡 user_preferences change → refetch");
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};