import { useAtom } from "jotai";
import { userAtom, loadingAtom, errorAtom } from "../stores/authStore";
import { signOut as signOutService } from "../services/authService";
import { useCallback } from "react";

export function useAuth() {
  const [user] = useAtom(userAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  const signOut = useCallback(async () => {
    const { error: signoutError } = await signOutService();
    if (signoutError) {
      console.error("Signout error:", signoutError);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: user !== null,
    signOut,
  };
}
