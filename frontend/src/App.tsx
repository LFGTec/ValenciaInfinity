import { useEffect } from "react";
import { useSetAtom } from "jotai";
import AppRoutes from "./router/AppRoutes";
import {
  getCurrentUser,
  onAuthStateChange,
} from "./services/authService";
import {
  setLoadingAtom,
  setUserAtom,
} from "./stores/authStore";

function App() {
  const setUser = useSetAtom(setUserAtom);
  const setLoading = useSetAtom(setLoadingAtom);

  useEffect(() => {
    // Initialize auth state on app mount
    const initializeAuth = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    initializeAuth();

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser, setLoading]);

  return <AppRoutes />;
}

export default App;
