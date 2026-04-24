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

  // 🧭 inicialización (solo una vez)
  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-100, 20],
      zoom: 1.5
    })

    mapRef.current = map

    map.on("load", () => {
      map.addSource("users", {
        type: "geojson",
        data: data || {
          type: "FeatureCollection",
          features: []
        },
        cluster: true,
        clusterRadius: 50
      })

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "users",
        filter: ["has", "point_count"],
        paint: { "circle-radius": 20 }
      })

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "users",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12
        }
      })

      map.addLayer({
        id: "points",
        type: "circle",
        source: "users",
        filter: ["!", ["has", "point_count"]],
        paint: { "circle-radius": 8 }
      })

      // 🖱️ evento click en usuario
      map.on("click", "points", (e) => {
        const feature = e.features?.[0]
        const userId = feature?.properties?.userId

        if (userId && onUserClick) {
          onUserClick(userId)
        }
      })
    })

    return () => map.remove()
  }, [])

  // 🔄 actualizar datos dinámicamente
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