import { useAtom } from "jotai";
import { userAtom, loadingAtom, errorAtom, setUserAtom } from "../stores/authStore";
import { signOut as signOutService } from "../services/authService";
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

  return {
    user,
    loading,
    error,
    isSigningOut,
    isAuthenticated: user !== null,
    signOut,
  };
}

