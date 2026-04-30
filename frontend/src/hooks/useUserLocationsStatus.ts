import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

export const useUserLocationStatus = (userId?: string) => {
  const [locationSaved, setLocationSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadinguserLocation, setLoading] = useState(true);

  useEffect(() => {
    const checkLocation = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from("user_locations")
        .select("lat, lng, is_visible")
        .eq("user_id", userId)
        .maybeSingle();

      if (data?.lat && data?.lng) {
        setLocationSaved(true);
        setIsVisible(data.is_visible ?? false);
      }

      setLoading(false);
    };

    checkLocation();
  }, [userId]);

  return {
    locationSaved,
    isVisible,
    setLocationSaved,
    setIsVisible,
    loadinguserLocation
  };
};