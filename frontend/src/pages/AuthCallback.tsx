import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { getCurrentUser } from "../services/authService";
import { setUserAtom } from "../stores/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useSetAtom(setUserAtom);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("🔄 AuthCallback - Iniciando...");

        // Esperar un poco para que Supabase procese la sesión
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Obtener el usuario actual (Supabase ya intercambió el código automáticamente)
        const user = await getCurrentUser();
        console.log("👤 Usuario obtenido:", user?.email);

        if (user) {
          console.log("✅ Autenticado como:", user.email);
          setUser(user);
          // Redirigir inmediatamente
          navigate("/home", { replace: true });
        } else {
          console.error("❌ No hay usuario");
          setError("No se pudo completar el inicio de sesión");
          setTimeout(() => {
            navigate("/login?error=auth_failed", { replace: true });
          }, 2000);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        console.error("❌ Excepción:", message);
        setError(message);
        setTimeout(() => {
          navigate(
            `/login?error=${encodeURIComponent(message)}`,
            { replace: true }
          );
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <>
            <div
              className="p-4 rounded-lg mb-4"
              style={{
                background: "rgba(238,53,36,0.1)",
                border: "1px solid rgba(238,53,36,0.3)",
                color: "#EE3524",
              }}
            >
              <p className="font-semibold">{error}</p>
              <p className="text-sm">Redirigiendo...</p>
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completando autenticación...</p>
          </>
        )}
      </div>
    </div>
  );
}
