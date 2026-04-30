import { supabase } from "@/services/supabaseClient";
import { roundCoord } from "@/utils/locationUtils";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const getBrowserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const useUserLocation = () => {

  const saveLocation = async (user: any) => {
    try {

      // 1. validar preferencias
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("show_location")
        .eq("user_id", user.id)
        .single();

      if (!prefs?.show_location) {
        console.log(" ubicación desactivada por preferences");
        return;
      }

      // 2. obtener ubicación actual
      const position = await getBrowserLocation();

      if (!position?.coords) return;
      
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;


      // 3. revisar si ya existe y si ya tiene geodata
      const { data: existing } = await supabase
        .from("user_locations")
        .select("city, country, region")
        .eq("user_id", user.id)
        .maybeSingle();

      const shouldFetchGeo =
        !existing?.city || !existing?.country;

      let city = existing?.city ?? null;
      let region = existing?.region ?? null;
      let country = existing?.country ?? null;

      // 4. reverse geocoding SOLO UNA VEZ
      if (shouldFetchGeo) {

        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${TOKEN}`
          );

          const data = await res.json();
          const features = data.features;

          city = features.find((f: any) =>
            f.place_type.includes("place")
          )?.text ?? null;

          region = features.find((f: any) =>
            f.place_type.includes("region")
          )?.text ?? null;

          country = features.find((f: any) =>
            f.place_type.includes("country")
          )?.text ?? null;

        } catch (err) {
          console.error("error geocoding:", err);
        }
      } else {
        console.log("⚡ usando geodata existente (no API call)");
      }

      // 5. guardar (insert/update)
      const { error } = await supabase.from("user_locations").upsert(
        {
          user_id: user.id,
          lat: roundCoord(lat, 0),
          lng: roundCoord(lng, 0),
          city,
          region,
          country,
          is_visible: true,
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error("error guardando:", error);
      } else {
        console.log("ubicación guardada");
      }

    } catch (err) {
      console.error("error general:", err);
    }
  };

  return { saveLocation };
};