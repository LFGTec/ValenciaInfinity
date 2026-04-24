import { useEffect, useState } from "react"
import { getMapUsers } from "@/services/mapService"

export const useMapUsers = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const users = await getMapUsers()

      const geojson = {
        type: "FeatureCollection",
        features: users.map(u => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [u.lng, u.lat]
          },
          properties: {
            userId: u.user_id
          }
        }))
      }

      setData(geojson)
    }

    load()
  }, [])

  return data
}