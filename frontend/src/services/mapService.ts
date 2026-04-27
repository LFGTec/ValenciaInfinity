import { supabase } from "./supabaseClient";
import { roundCoord } from "@/utils/locationUtils";

export interface UserLocation {
  id: string;
  user_id: string;
  country: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  is_visible: boolean;
}


export const getMapUsers = async (): Promise<UserLocation[]> => {
  const { data, error } = await supabase
    .from("user_locations")
    .select("*")

  if (error) throw error

  return (data || []).filter(
    (u) => u.is_visible && u.lat !== null && u.lng !== null
  )
}

export const toGeoJSON = (users: UserLocation[]): GeoJSON.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: users.map((u) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          roundCoord(u.lng!, 1),
          roundCoord(u.lat!, 1)
        ]
      },
      properties: {
        userId: u.user_id,
        city: u.city,
        region: u.region,
        country: u.country
      }
    }))
  }
}

export const getMapGeoData = async () => {
  const users = await getMapUsers()
  return toGeoJSON(users)
}

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
        callback()
      }
    )
    .subscribe()
}
