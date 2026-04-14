import { useEffect } from "react";
import { useSetAtom } from "jotai";
import AppRoutes from "./router/AppRoutes";
import {
  getCurrentUser,
  onAuthStateChange,
} from "./services/authService";
import {
  authAtom,
  setLoadingAtom,
  setUserAtom,
} from "./stores/authStore";
import { finishLoadingAtom } from "./stores/authStore"; // Importa el nuevo átomo

export function App() {
  const finishLoading = useSetAtom(finishLoadingAtom);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser();
        finishLoading(user); // ⚡ Actualización única: User + Loading false
      } catch (error) {
        console.error(error);
        finishLoading(null);
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChange((user) => {
      finishLoading(user); // ⚡ Actualización única también aquí
    });

    return () => unsubscribe?.();
  }, [finishLoading]);

  return <AppRoutes />;
}
