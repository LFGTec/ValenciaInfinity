import { supabase } from "./supabaseClient";

export type UserRole = "fan" | "admin";

export interface User {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
  points?: number;
  current_streak?: number;
  longest_streak?: number;
  total_days?: number;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthSession {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  userRole: UserRole
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userRole,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "No user returned from signup" };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        role: userRole,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
        user_metadata: data.user.user_metadata,
      },
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return { user: null, error: message };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    console.log("🔵 [authService] signInWithEmail iniciado:", { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("🔵 [authService] signInWithEmail response:", { user: data.user?.email, error });

    if (error) {
      console.error("❌ [authService] signInWithEmail error:", error.message);
      return { user: null, error: error.message };
    }

    if (!data.user) {
      console.error("❌ [authService] signInWithEmail: No user returned");
      return { user: null, error: "No user returned from login" };
    }

    // Obtener el rol de la BD en lugar de user_metadata
    const profile = await getUserProfile(data.user.id);
    if (profile) {
      console.log("✅ [authService] signInWithEmail exitoso, role:", profile.role);
      return { user: profile, error: null };
    }

    // Fallback si no encuentra en BD
    const role = (data.user.user_metadata?.role as UserRole) || "fan";
    console.log("⚪ [authService] Usando role de metadata:", role);

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        role,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
        user_metadata: data.user.user_metadata,
      },
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("❌ [authService] signInWithEmail exception:", message);
    return { user: null, error: message };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(
  userRole: UserRole
): Promise<{ error: string | null }> {
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("❌ Google OAuth Error:", error);
      return { error: error.message };
    }
    sessionStorage.setItem("auth_user_role", userRole);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google signin failed";
    return { error: message };
  }
}

/**
 * Get user profile with role from database
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    console.log("🔵 [authService] Obteniendo perfil de BD:", userId);


    console.log("🌎 SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("🧍 USER ID BUSCADO:", userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("❌ [authService] Error obteniendo perfil:", error);
      return null;
    }

    console.log("✅ [authService] Perfil obtenido:", { email: data.email, role: data.role });

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      points: (data.points as number) ?? 0,
      user_metadata: {  },
    };
  } catch (error) {
    console.error("❌ [authService] Exception en getUserProfile:", error);
    return null;
  }
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("🔵 [authService] getCurrentUser iniciado");
    const { data } = await supabase.auth.getSession();

    console.log("🔵 [authService] getCurrentUser session:", { hasSession: !!data.session, userEmail: data.session?.user?.email });

    if (!data.session?.user) {
      console.log("⚪ [authService] getCurrentUser: No session found");
      return null;
    }

    // Obtener el rol de la BD
    const profile = await getUserProfile(data.session.user.id);
    console.log("PROFILE RESULT:", profile);
    if (profile) {
      console.log("✅ [authService] getCurrentUser exitoso, user:", profile.email, "role:", profile.role);
      return profile;
    }

    // Fallback
    const role = (data.session.user.user_metadata?.role as UserRole) || "fan";
    console.log("⚪ [authService] Usando role de metadata:", role);

    return {
      id: data.session.user.id,
      email: data.session.user.email || "",
      role,
      full_name: data.session.user.user_metadata?.full_name,
      avatar_url: data.session.user.user_metadata?.avatar_url,
      user_metadata: data.session.user.user_metadata,
    };
  } catch (error) {
    console.error("❌ [authService] Error getting current user:", error);
    return null;
  }
}

/**
 * Sign out with complete session cleanup
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    // Clear session storage first
    sessionStorage.removeItem("auth_user_role");

    // Sign out from Supabase (clears tokens from localStorage)
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    // Additional cleanup for any remaining auth-related data
    if (typeof window !== "undefined") {
      // Clear any auth-related localStorage keys
      localStorage.removeItem("supabase.auth.token");
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signout failed";
    return { error: message };
  }
}

/**
 * Exchange authorization code for session (OAuth callback)
 */
export async function exchangeCodeForSession(
  code: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: "No user returned" };

    // 🔴 LA PIEZA QUE FALTA: Buscar el perfil real en la tabla 'profiles'
    const profile = await getUserProfile(data.user.id);
    
    if (profile) {
      return { user: profile, error: null };
    }

    // Si no hay perfil, usamos el fallback de siempre
    const userRole = (sessionStorage.getItem("auth_user_role") as UserRole) || "fan";
    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        role: userRole,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
        user_metadata: data.user.user_metadata,
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: "Code exchange failed" };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): (() => void) | null {
  try {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      // Obtener el rol de la BD
      const profile = await getUserProfile(session.user.id);
      if (profile) {
        callback(profile);
        return;
      }

      // Fallback si no encuentra en BD
      const role = (session.user.user_metadata?.role as UserRole) || "fan";
      callback({
        id: session.user.id,
        email: session.user.email || "",
        role,
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
        user_metadata: session.user.user_metadata,
      });
    });

    return () => subscription?.unsubscribe();
  } catch (error) {
    console.error("Error setting up auth state listener:", error);
    return null;
  }
}


export async function requestPasswordReset(
  email: string
): Promise<{ error: string | null }> {
  try {
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Password reset request failed";
    return { error: message };
  }
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return { error: message };
  }
}

export async function addUserPoints(
  userId: string,
  points: number
): Promise<{ error: string | null }> {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", userId)
      .single();

    if (fetchError) return { error: fetchError.message };

    const newPoints = ((profile?.points as number) ?? 0) + points;

    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", userId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add points";
    return { error: message };
  }
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      const msg = uploadError.message.toLowerCase().includes("bucket")
        ? "El bucket 'avatars' no existe en Supabase Storage. Créalo desde el dashboard."
        : uploadError.message;
      return { url: null, error: msg };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await updateProfile(userId, { avatar_url: url });
    if (updateError) return { url: null, error: updateError };

    return { url, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return { url: null, error: message };
  }
}

export async function updatePassword(
  newPassword: string,
  currentPassword?: string
): Promise<{ error: string | null }> {
  try {
    const updateData: { password: string; currentPassword?: string } = {
      password: newPassword,
    };

    if (currentPassword) {
      updateData.currentPassword = currentPassword;
    }

    const { error } = await supabase.auth.updateUser(updateData);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Password update failed";
    return { error: message };
  }
}

