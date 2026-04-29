export type UserProperties = {
  userId: string
  username: string
}

export type UserFeature = GeoJSON.Feature<GeoJSON.Point, UserProperties>
export type UserFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  UserProperties
>