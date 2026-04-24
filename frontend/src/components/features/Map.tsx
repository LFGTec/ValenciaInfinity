import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

type Props = {
  data: GeoJSON.FeatureCollection | null
  onUserClick?: (userId: string) => void
}

export default function Map({ data, onUserClick }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

 
  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-100, 20],
      maxZoom: 6
    })

    mapRef.current = map

    map.on("load", () => {
      map.addSource("users", {
        type: "geojson",
        data: data || {
          type: "FeatureCollection",
          features: []
        }
      })

      map.addLayer({
        id: "users-layer",
        type: "circle",
        source: "users",
        paint: {
          "circle-radius": 6,
          "circle-color": "#007cbf"
        }
      })
    })

    return () => map.remove()
  }, [])

  
  useEffect(() => {
    if (!mapRef.current) return

    const source = mapRef.current.getSource("users") as mapboxgl.GeoJSONSource

    if (source && data) {
      source.setData(data)
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px" }}
    />
  )
}