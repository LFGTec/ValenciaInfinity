import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { supabase } from "../services/supabaseClient";
import { finishLoadingAtom } from "../stores/authStore";
import type { User } from "../services/authService";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getUserProfile } from "../services/authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const finishLoading = useSetAtom(finishLoadingAtom);

  // 🔥 Mapper con profile real
  const mapUser = async (
    user: SupabaseUser | null
  ): Promise<User | null> => {
    if (!user) return null;

    try {
      const profile = await getUserProfile(user.id);

      if (profile) return profile;
    } catch (error) {
      console.warn("⚠️ Error fetching profile, using fallback", error);
    }

    // 🔹 fallback (metadata)
    return {
      id: user.id,
      email: user.email ?? "",
      role: (user.user_metadata?.role as User["role"]) || "fan",
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      user_metadata: user.user_metadata,
    };
  };

  useEffect(() => {
    let mounted = true;

    // 🔹 1. Restaurar sesión al cargar
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (mounted) {
        const mappedUser = await mapUser(data.session?.user ?? null);
        finishLoading(mappedUser);
      }
    };

    init();

    // 🔹 2. Escuchar cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AUTH EVENT:", event);

        if (!mounted) return;

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const mappedUser = await mapUser(session?.user ?? null);
          finishLoading(mappedUser);
        }

        if (event === "SIGNED_OUT") {
          finishLoading(null);
        }

        // ❌ ignoramos INITIAL_SESSION
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [finishLoading]);

  return <>{children}</>;
}