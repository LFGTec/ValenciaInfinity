import { supabase } from "./supabaseClient";

export type UserPreferences = {
  user_id: string
  profile_public: boolean
  show_location: boolean
  allow_messages: boolean
  show_stats: boolean
  show_collection: boolean
}


export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) return null

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  if (!data) {
    const { data: newPrefs } = await supabase
      .from("user_preferences")
      .insert({
        user_id: user.id
      })
      .select()
      .single()

    return newPrefs
  }

  return data
}

export const updateUserPreference = async (
  key: keyof Omit<UserPreferences, "user_id">,
  value: boolean
) => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) throw new Error("No authenticated user")

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: user.id,
      [key]: value
    })
    .select()
    .single()

  if (error) throw error

  if (key === "show_location") {
    await supabase
      .from("user_locations")
      .upsert({
        user_id: user.id,
        is_visible: value
      })
  }

  return data
}