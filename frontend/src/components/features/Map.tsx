import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type {
  UserFeatureCollection,
  UserProperties
} from "@/types/mapTypes"


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

type Props = {
  data: UserFeatureCollection | null
  onUserClick?: (userId: string) => void
}


export default function Map({ data, onUserClick }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

 
  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-100, 20],
      zoom: 3,
      maxZoom: 10
    })

    mapRef.current = map

    map.on("load", () => {
      map.addSource("users", {
        type: "geojson",
        data: data || {
          type: "FeatureCollection",
          features: []
        },
        cluster: true,          // 🔥 activa clustering
        clusterMaxZoom: 14,      // hasta qué zoom agrupa
        clusterRadius: 50       // tamaño del cluster
      })
      

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "users",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#d18817",
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 10,   
            6, 20,   
            10, 30   
          ]
        }
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
        id: "unclustered-point",
        type: "circle",
        source: "users",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 6,
          "circle-color": "#ee3524"
        }
      })

      // 👤 CLICK USER
      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== "Point") return

        const coords = feature.geometry.coordinates as [number, number]
        const props = feature.properties as UserProperties

        if (!props?.userId) return

        if (onUserClick) {
          onUserClick(props.userId)
          return
        }

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(`
            <div>
              <strong>${props.username}</strong><br/>
              <a href="/profile/${props.userId}">Ver perfil</a><br/>
              <a href="/album/${props.userId}">Ver álbum</a>
            </div>
          `)
          .addTo(map)
      })

      // 🔵 CLICK CLUSTER → ZOOM
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        })

        const feature = features[0]
        if (!feature || feature.geometry.type !== "Point") return

        const clusterId = feature.properties.cluster_id
        const coords = feature.geometry.coordinates as [number, number]

        const source = map.getSource("users") as mapboxgl.GeoJSONSource

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return

          map.easeTo({
            center: coords,
            zoom
          })
        })
      })
      
      // CURSOR
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer"
      })

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = ""
      })

      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer"
      })

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = ""
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