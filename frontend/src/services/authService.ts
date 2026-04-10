import { supabase } from "./supabaseClient";

export type UserRole = "fan" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "No user returned from login" };
    }

    const role = (data.user.user_metadata?.role as UserRole) || "fan";

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        role,
      },
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
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
        scopes: "profile email",
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Store the intended user role in sessionStorage to use after OAuth redirect
    sessionStorage.setItem("auth_user_role", userRole);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google signin failed";
    return { error: message };
  }
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getSession();

    if (!data.session?.user) {
      return null;
    }

    const role = (data.session.user.user_metadata?.role as UserRole) || "fan";

    return {
      id: data.session.user.id,
      email: data.session.user.email || "",
      role,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signout failed";
    return { error: message };
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

      const role = (session.user.user_metadata?.role as UserRole) || "fan";

      callback({
        id: session.user.id,
        email: session.user.email || "",
        role,
      });
    });

    return () => subscription?.unsubscribe();
  } catch (error) {
    console.error("Error setting up auth state listener:", error);
    return null;
  }
}
