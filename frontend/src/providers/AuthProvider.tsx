import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { supabase } from "../services/supabaseClient";
import { finishLoadingAtom } from "../stores/authStore";
import type { User } from "../services/authService";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { getUserProfile } from "../services/authService";
import { checkAndUpdateStreak } from "../services/streakService";

//funcion para ver si inicia sesion
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const finishLoading = useSetAtom(finishLoadingAtom);

  const mapUser = async (user: SupabaseUser | null): Promise<User | null> => {
    if (!user) return null;
    const isGoogleUser =
      user.identities?.some(
        identity => identity.provider === "google"
      ) ?? false;
    try {

      let profile = await getUserProfile(user.id);

      // Usuario nuevo sin fila en profiles → crearla con valores por defecto
      if (!profile) {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email ?? "",
            role: (user.user_metadata?.role as User["role"]) || "fan",
            full_name: user.user_metadata?.full_name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            puntos: 0,
            current_streak: 0,
            longest_streak: 0,
            total_days: 0,
            last_login_date: null,
            last_reward_date: null,
          },
          { onConflict: "id" },
        );

        profile = await getUserProfile(user.id);
      }

      if (profile) {
        const streak = await checkAndUpdateStreak(user.id, {
          current_streak: profile.current_streak ?? 0,
          longest_streak: profile.longest_streak ?? 0,
          total_days: profile.total_days ?? 0,
          last_login_date: profile.last_login_date ?? null,
        });
        return {
          ...profile,
          ...streak,
          avatar_url: profile.avatar_url ?? user.user_metadata?.avatar_url,
          user_metadata: user.user_metadata,
          isGoogleUser,
        };
      }
    } catch (error) {
      console.error("❌ Error en mapUser:", error);
    }

    // Fallback mínimo si todo falla
    return {
      id: user.id,
      email: user.email ?? "",
      role: (user.user_metadata?.role as User["role"]) || "fan",
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      user_metadata: user.user_metadata,
      isGoogleUser,
    };
  };

  useEffect(() => {
    let mounted = true;
    // Contador para descartar resultados de llamadas async obsoletas
    let latestCallId = 0;

    const applySession = async (session: Session | null) => {
      const callId = ++latestCallId;
      const mappedUser = await mapUser(session?.user ?? null);
      if (mounted && callId === latestCallId) {
        finishLoading(mappedUser);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED"
        ) {
          applySession(session);
        }

        if (event === "SIGNED_OUT") {
          latestCallId++; // cancela cualquier update async pendiente
          finishLoading(null);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [finishLoading]);

  return <>{children}</>;
}
