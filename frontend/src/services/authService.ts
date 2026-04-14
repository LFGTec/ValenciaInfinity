import { supabase } from "./supabaseClient";

export type UserRole = "fan" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
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
async function getUserProfile(userId: string): Promise<User | null> {
  try {
    console.log("🔵 [authService] Obteniendo perfil de BD:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("❌ [authService] Error obteniendo perfil:", error.message);
      return null;
    }

    console.log("✅ [authService] Perfil obtenido:", { email: data.email, role: data.role });

    return {
      id: data.id,
      email: data.email,
      role: data.role as UserRole,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      user_metadata: { role: data.role },
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

    if (error) {
      console.error("❌ Code exchange error:", error);
      return { user: null, error: error.message };
    }

    if (!data.user) {
      console.error("❌ No user returned from code exchange");
      return { user: null, error: "No user returned from OAuth" };
    }

    const userRole = (sessionStorage.getItem("auth_user_role") as UserRole) || "fan";
    sessionStorage.removeItem("auth_user_role");

    const user: User = {
      id: data.user.id,
      email: data.user.email || "",
      role: userRole,
      full_name: data.user.user_metadata?.full_name,
      avatar_url: data.user.user_metadata?.avatar_url,
      user_metadata: data.user.user_metadata,
    };

    return { user, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Code exchange failed";
    console.error("❌ Code exchange exception:", message);
    return { user: null, error: message };
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

