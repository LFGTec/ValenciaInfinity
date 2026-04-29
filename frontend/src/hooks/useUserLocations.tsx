import { useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { roundCoord } from "@/utils/locationUtils";

const getBrowserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const useUserLocation = () => {
  useEffect(() => {

    const saveLocation = async (user: any) => {
      try {
        // 1. validar preferencias
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("show_location")
          .eq("user_id", user.id)
          .single();

        if (!prefs?.show_location) return;

        // 2. obtener GPS del navegador
        let loc = null;

        try {
          const position = await getBrowserLocation();

          loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (err) {
          console.error("Usuario no permitió geolocalización:", err);
          return;
        }

        if (!loc) return;

        // 3. guardar en supabase
        const { error } = await supabase.from("user_locations").upsert(
          {
            user_id: user.id,
            lat: roundCoord(loc.latitude, 0),
            lng: roundCoord(loc.longitude, 0),
            is_visible: true,
          },
          {
            onConflict: "user_id",
          }
        );

        if (error) {
          console.error("Error guardando ubicación:", error);
        }

      } catch (err) {
        console.error("Error general en useUserLocation:", err);
      }
    };

    // 4. auth listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          saveLocation(session.user);
        }
      }
    );

    // 5. sesión inicial
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) saveLocation(data.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);
};