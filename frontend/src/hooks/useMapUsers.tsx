import { useEffect, useState } from "react";
import { getMapGeoData, subscribeToMapUsers } from "@/services/mapService";

export const useMapUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channel = subscribeToMapUsers(() => {
      console.log("📡 cambio en mapa → refetch");
      fetchData();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { data, loading, error };
};