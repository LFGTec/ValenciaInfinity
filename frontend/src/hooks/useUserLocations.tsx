import { useEffect } from "react"
import { supabase } from "@/services/supabaseClient"
import { roundCoord } from "@/utils/locationUtils"

export const useUserLocation = () => {
  useEffect(() => {

    const saveLocation = async (user: any) => {
      try {
        
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("show_location")
          .eq("user_id", user.id)
          .single()

        if (!prefs?.show_location) return

        
        let loc = null

        try {
          const res = await fetch("https://ipapi.co/json/")
          const data = await res.json()

          if (data.latitude && data.longitude) {
            loc = data
          } else {
            
            const res2 = await fetch("https://ipwho.is/")
            const data2 = await res2.json()

            if (data2.success) {
              loc = {
                latitude: data2.latitude,
                longitude: data2.longitude,
                city: data2.city,
                region: data2.region,
                country_name: data2.country
              }
            }
          }
        } catch (err) {
          console.error("Error obteniendo ubicación", err)
          return
        }

        if (!loc?.latitude || !loc?.longitude) return

        const { error } = await supabase.from("user_locations").upsert(
          {
            user_id: user.id,
            lat: roundCoord(loc.latitude, 0),
            lng: roundCoord(loc.longitude, 0),
            city: loc.city || "Unknown",
            region: loc.region || "Unknown",
            country: loc.country_name || "Unknown",
            is_visible: true
          },
          {
            onConflict: "user_id"
          }
        )

        if (error) console.error("Error guardando ubicación:", error)

      } catch (err) {
        console.error("Error general en useUserLocation:", err)
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          saveLocation(session.user)
        }
      }
    )

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) saveLocation(data.user)
    })

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])
}