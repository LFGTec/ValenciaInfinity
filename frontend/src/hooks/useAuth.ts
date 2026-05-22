import { useAtom } from "jotai";
import { userAtom, loadingAtom, errorAtom, setUserAtom } from "../stores/authStore";
import { signOut as signOutService } from "../services/authService";
import { supabase } from "../services/supabaseClient";
import { useCallback, useState } from "react";

export function useAuth() {
  const [user] = useAtom(userAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);
  const setUser = useAtom(setUserAtom)[1];
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    try {
      setIsSigningOut(true);
      const { error: signoutError } = await signOutService();

      if (signoutError) {
        console.error("Signout error:", signoutError);
        return { error: signoutError };
      }

      // Ensure state is fully cleared
      setUser(null);
      setIsSigningOut(false);

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout exception:", message);
      setIsSigningOut(false);
      return { error: message };
    }
  }, [setUser]);

  const updatePoints = useCallback((delta: number) => {
    if (!user) return;
    const newPoints = (user.puntos ?? 0) + delta;
    setUser({ ...user, puntos: newPoints });
    supabase
      .from("profiles")
      .update({ puntos: newPoints })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("❌ Error sincronizando puntos:", error.message);
        else console.log("✅ Puntos sincronizados en Supabase:", newPoints);
      });
  }, [user, setUser]);

  return {
    user,
    loading,
    error,
    isSigningOut,
    isAuthenticated: user !== null,
    signOut,
    updatePoints,
  };
}

