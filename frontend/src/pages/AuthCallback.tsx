import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { exchangeCodeForSession, getCurrentUser } from "../services/authService";
import { setUserAtom } from "../stores/authStore";
import { supabase } from "../services/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetAtom(setUserAtom);
  const [error, setError] = useState<string | null>(null);

  const navigateByRole = (role?: string) => {
    if (role?.toLowerCase() === "admin") {
      navigate("/admin/cards", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const SESSION_RETRIES = 3;
  const SESSION_RETRY_DELAY_MS = 120;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1) PKCE flow: code in query string
        const code = searchParams.get("code");

        if (code) {
          console.log("🔵 [AuthCallback] Intercambiando código por sesión...");
          const { user, error: exchangeError } = await exchangeCodeForSession(code);

          if (exchangeError) {
            throw new Error(exchangeError);
          }

          if (user) {
            console.log("✅ [AuthCallback] Autenticado como:", user.email, "role:", user.role);
            setUser(user);
            navigateByRole(user.role);
            return;
          }
        }

        // 2) Hash flow fallback: #access_token=...&refresh_token=...
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw new Error(sessionError.message);
          }

          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            navigateByRole(currentUser.role);
            return;
          }
        }

        // 3) Grace period: espera corta por sesión restaurada para evitar flash de error
        for (let i = 0; i < SESSION_RETRIES; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              navigateByRole(currentUser.role);
              return;
            }
          }
          await wait(SESSION_RETRY_DELAY_MS);
        }

        throw new Error("No se pudo completar la autenticación");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        console.error("❌ [AuthCallback] Excepción:", message);
        setError("No se pudo iniciar sesión. Redirigiendo...");
        setTimeout(() => {
          navigate(
            `/login?error=${encodeURIComponent(message)}`,
            { replace: true }
          );
        }, 700);
      }
    };

    handleCallback();
  }, [navigate, setUser, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <>
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
