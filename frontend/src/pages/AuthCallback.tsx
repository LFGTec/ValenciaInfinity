import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { exchangeCodeForSession } from "../services/authService";
import { setUserAtom } from "../stores/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useSetAtom(setUserAtom);
  const [error, setError] = useState<string | null>(null);

  const navigateByRole = (role?: string) => {
    if (role?.toLowerCase() === "admin") {
      navigate("/admin/cards", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          throw new Error("No se encontró el código de autorización en la URL");
        }

        const processedCodeKey = "auth_callback_processed_code";
        const lastProcessedCode = sessionStorage.getItem(processedCodeKey);

        if (lastProcessedCode === code) {
          return;
        }

        sessionStorage.setItem(processedCodeKey, code);

        const { user, error: exchangeError } = await exchangeCodeForSession(code);

        if (exchangeError) {
          throw new Error(exchangeError);
        }

        if (!user) {
          throw new Error("No se pudo obtener la sesión de Supabase");
        }

        setUser(user);
        navigateByRole(user.role);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        setError(message);
        navigate(`/login?error=${encodeURIComponent(message)}`, { replace: true });
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <div
            className="p-4 rounded-lg mb-4"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "#374151",
            }}
          >
            <p className="font-semibold">{error}</p>
            <p className="text-sm">Redirigiendo...</p>
          </div>
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
