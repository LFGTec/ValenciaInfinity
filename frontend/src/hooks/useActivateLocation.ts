import { supabase } from "@/services/supabaseClient";
import { useState } from "react";

export const useActivateLocation = () => {
  const [loadingActivate, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateLocation = async (user: any, saveLocation: (u: any) => Promise<void>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      await saveLocation(user);

      // 2. activar preferences
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          show_location: true,
        });

      if (error) throw error;

      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error activando ubicación");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activateLocation, loadingActivate, error };
};