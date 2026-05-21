import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { supabase } from "../services/supabaseClient";
import { finishLoadingAtom } from "../stores/authStore";
import type { User } from "../services/authService";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { getUserProfile } from "../services/authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const finishLoading = useSetAtom(finishLoadingAtom);

  const mapUser = async (user: SupabaseUser | null): Promise<User | null> => {
    if (!user) return null;
    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        const cachedPoints = parseInt(localStorage.getItem(`vcf_pts_${user.id}`) ?? "0", 10);
        const points = Math.max(profile.points ?? 0, cachedPoints);
        localStorage.setItem(`vcf_pts_${user.id}`, String(points));
        return {
          ...profile,
          points,
          avatar_url: profile.avatar_url ?? user.user_metadata?.avatar_url,
          user_metadata: user.user_metadata,
        };
      }
    } catch (error) {
      console.warn("⚠️ Error fetching profile, using fallback", error);
    }
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
        console.log("AUTH EVENT:", event);
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
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [finishLoading]);

  return <>{children}</>;
}