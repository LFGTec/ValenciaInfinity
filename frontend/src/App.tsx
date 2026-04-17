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
import { AuthProvider } from "./providers/AuthProvider";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
