import { supabase } from "./supabaseClient";

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

export const getMapUsers = async () => {
  const { data } = await supabase
    .from("user_locations")
    .select("*")

  return (data as UserLocation[] || []).filter(u => u.lat && u.lng)
}


