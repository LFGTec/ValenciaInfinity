import { useEffect } from "react"
import { supabase } from "@/services/supabaseClient"
import { roundCoord } from "@/utils/locationUtils"

export const useUserLocation = () => {
  useEffect(() => {
    const run = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) return

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("show_location")
        .eq("user_id", user.id)
        .single()

      if (!prefs?.show_location) return

      const { data: existing } = await supabase
    .from("user_locations")
    .select("lat")
    .eq("user_id", user.id)
    .maybeSingle()

      if (existing?.lat) return

      const res = await fetch("https://ipapi.co/json/")
      const loc = await res.json()

      if (!loc.latitude || !loc.longitude) return

      await supabase.from("user_locations").upsert({
            user_id: user.id,
            lat: roundCoord(loc.latitude, 1),
            lng: roundCoord(loc.longitude, 1),
            city: loc.city,
            region: loc.region,
            country: loc.country_name,
            is_visible: true
        })
    }

    run()
  }, [])
}