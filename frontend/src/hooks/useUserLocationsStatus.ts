import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

export const useUserLocationStatus = (userId?: string) => {
  const [locationSaved, setLocationSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadinguserLocation, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("user_locations")
      .select("lat, lng, is_visible")
      .eq("user_id", userId)
      .maybeSingle();

    if (data?.lat && data?.lng) {
      setLocationSaved(true);
      setIsVisible(data.is_visible ?? false);
    } else {
      setLocationSaved(false);
      setIsVisible(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();

    if (!userId) return;

    // 🔥 REALTIME
    const channel = supabase
      .channel("user-location-status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_locations",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("📡 location status changed:", payload);

          const newRow = payload.new as { lat?: number; lng?: number; is_visible?: boolean };

          if (newRow?.lat && newRow?.lng) {
            setLocationSaved(true);
            setIsVisible(newRow.is_visible ?? false);
          } else {
            setLocationSaved(false);
            setIsVisible(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    locationSaved,
    isVisible,
    setLocationSaved,
    setIsVisible,
    loadinguserLocation,
    refetch: fetchStatus, 
  };
};