import { supabase } from "./supabaseClient";

export const getMapGeoData = async () => {
  
  const { data: locations, error: locError } = await supabase
    .from("user_locations")
    .select("user_id, lat, lng")
    .eq("is_visible", true);

  if (locError) throw locError;

  if (!locations || locations.length === 0) {
    return {
      type: "FeatureCollection",
      features: []
    };
  }

  const userIds = locations.map(u => u.user_id);

  
  const { data: prefs, error: prefError } = await supabase
    .from("user_preferences")
    .select("user_id, profile_public")
    .in("user_id", userIds);

  if (prefError) throw prefError;

 
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  if (profileError) throw profileError;

  const prefMap = new Map(
    prefs?.map(p => [p.user_id, p]) || []
  );

  const profileMap = new Map(
    profiles?.map(p => [p.id, p]) || []
  );
  

  const features = locations.map(loc => {
    const pref = prefMap.get(loc.user_id);
    const profile = profileMap.get(loc.user_id);
    console.log("LOC:", loc.user_id)
    console.log("PROFILE:", profile)

    const isPublic = pref?.profile_public ?? true;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [loc.lng, loc.lat]
      },
      properties: {
        userId: loc.user_id,
        username: isPublic
          ? (profile?.full_name || "Usuario")
          : null,
        profile_public: isPublic
      }
    };
  });

  return {
    type: "FeatureCollection",
    features
  };
};


export const subscribeToMapUsers = (callback: () => void) => {
  return supabase
    .channel("user_locations_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_locations"
      },
      () => {
        callback();
      }
    )
    .subscribe();
};