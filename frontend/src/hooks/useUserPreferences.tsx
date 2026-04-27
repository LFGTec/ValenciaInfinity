import { useEffect, useState } from "react"
import {
  getUserPreferences,
  updateUserPreference,
  type UserPreferences
} from "@/services/userPreferenceService"

type PrivacyState = Omit<UserPreferences, "user_id">

const defaultState: PrivacyState = {
  profile_public: true,
  show_location: true,
  allow_messages: true,
  show_stats: true,
  show_collection: true
}

export const usePrivacySettings = () => {
  const [settings, setSettings] = useState<PrivacyState>(defaultState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserPreferences()

        if (data) {
          const { user_id, ...prefs } = data
          setSettings(prefs)
        }
      } catch (err) {
        console.error("Error loading preferences:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  
  const toggleSetting = async (key: keyof PrivacyState) => {
    const newValue = !settings[key]

    setSettings(prev => ({
      ...prev,
      [key]: newValue
    }))

    try {
      await updateUserPreference(key, newValue)
    } catch (err) {
      console.error("Error updating preference:", err)

      
      setSettings(prev => ({
        ...prev,
        [key]: !newValue
      }))
    }
  }

  return {
    settings,
    loading,
    toggleSetting
  }
}