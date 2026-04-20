import AppRoutes from "./router/AppRoutes";
import { AuthProvider } from "./providers/AuthProvider";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
