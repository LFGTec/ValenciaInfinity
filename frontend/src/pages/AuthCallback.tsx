import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { exchangeCodeForSession, getUserProfile } from "../services/authService";
import { setUserAtom } from "../stores/authStore";
import { supabase } from "../services/supabaseClient";

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
          // No OAuth code — check if there's already an active session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            if (profile) setUser(profile);
            const role = profile?.role ?? session.user.user_metadata?.role ?? "fan";
            navigate(role?.toLowerCase() === "admin" ? "/admin/cards" : "/home", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
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
