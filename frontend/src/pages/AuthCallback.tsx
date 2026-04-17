import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { exchangeCodeForSession } from "../services/authService";
import { setUserAtom } from "../stores/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetAtom(setUserAtom);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract code from URL
        const code = searchParams.get("code");

        if (!code) {
          console.error("❌ [AuthCallback] No authorization code found");
          setError("No authorization code found");
          setTimeout(() => {
            navigate("/login?error=no_code", { replace: true });
          }, 2000);
          return;
        }

        // Exchange code for session
        console.log("🔵 [AuthCallback] Intercambiando código por sesión...");
        const { user, error: exchangeError } = await exchangeCodeForSession(code);

        console.log("🔵 [AuthCallback] exchangeCodeForSession result:", { user: user?.email, error: exchangeError });

        if (exchangeError) {
          console.error("❌ [AuthCallback] Code exchange failed:", exchangeError);
          setError(exchangeError);
          setTimeout(() => {
            navigate(
              `/login?error=${encodeURIComponent(exchangeError)}`,
              { replace: true }
            );
          }, 2000);
          return;
        }

        if (user) {
          console.log("✅ [AuthCallback] Autenticado como:", user.email, "role:", user.role);
          setUser(user);

          // Redirección inteligente basada en el rol
          if (user.role?.toLowerCase() === 'admin') {
            navigate("/admin/cards", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } else {
          console.error("❌ [AuthCallback] No user returned from code exchange");
          setError("No se pudo completar el inicio de sesión");
          setTimeout(() => {
            navigate("/login?error=auth_failed", { replace: true });
          }, 2000);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        console.error("❌ [AuthCallback] Excepción:", message);
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
  }, [navigate, setUser, searchParams]);

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
