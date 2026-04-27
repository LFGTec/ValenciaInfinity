import { useEffect, useState } from "react"
import {
  getMapGeoData,
  subscribeToMapUsers
} from "@/services/mapService"

export const useMapUsers = () => {
  const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const geo = await getMapGeoData()
      setData(geo)
    } catch (err) {
      console.error(err)
      setError("Error cargando usuarios del mapa")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    const channel = subscribeToMapUsers(() => {
      load()
    })

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [])

  return {
    data,
    loading,
    error,
    reload: load
  }
}