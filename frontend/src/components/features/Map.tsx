import { useEffect, useRef } from "react"
import ReactDOM from 'react-dom/client'
import UserPopupCard from "@/components/features/UserPopupCard"
import ClusterPopup from "@/components/ClusterPopUp"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type {
  UserFeatureCollection,
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
        cluster: true,          
        clusterMaxZoom: 14,      
        clusterRadius: 50       
      })
      

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "users",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#ff671f",
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
        },
        paint: {
          "text-color": "#ffffff"
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

      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0]
        if (!feature) return
        if (!feature.geometry || feature.geometry.type !== "Point") return

        const coords = feature.geometry.coordinates as [number, number]
        const props = feature.properties as any

        const user = {
          userId: props.userId,
          username: props.username,
          profile_public: props.profile_public
        }

        const container = document.createElement("div")
        const root = ReactDOM.createRoot(container)

        root.render(<UserPopupCard user={user} />)

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setDOMContent(container)
          .addTo(map)
      })

      
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        })

        const feature = features[0]
        if (!feature) return
        if (!feature.geometry || feature.geometry.type !== "Point") return

        const props = feature.properties
        if (!props || typeof props !== "object") return

        const clusterId = props.cluster_id
        const coords = feature.geometry.coordinates as [number, number]

        const source = map.getSource("users") as mapboxgl.GeoJSONSource

        source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
          if (err || !leaves) return

          const users = leaves.map((leaf: any) => ({
            userId: leaf.properties.userId,
            username: leaf.properties.username,
            profile_public: leaf.properties.profile_public
          }))

          const container = document.createElement("div")

          // 🔥 IMPORTANTE: render síncrono seguro
          const root = ReactDOM.createRoot(container)

          root.render(
            <ClusterPopup users={users} />
          )

          
          setTimeout(() => {
            new mapboxgl.Popup()
              .setLngLat(coords)
              .setDOMContent(container)
              .addTo(map)
          }, 0)
          
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