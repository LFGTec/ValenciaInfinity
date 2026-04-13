/**
 * Email validation
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, error: "El correo es requerido" };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: "El correo no es válido" };
  }

  return { valid: true };
}

/**
 * Password validation with complexity requirements
 */
export function validatePassword(password: string): {
  valid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  if (!password) {
    errors.push("La contraseña es requerida");
    return { valid: false, strength, errors };
  }

  // Minimum length check
  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }

  // Maximum length check
  if (password.length > 128) {
    errors.push("Máximo 128 caracteres");
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos 1 letra mayúscula");
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push("Al menos 1 letra minúscula");
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push("Al menos 1 número");
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Al menos 1 carácter especial (!@#$%^&* etc.)");
  }

  // Determine strength
  if (errors.length === 0) {
    strength = "strong";
  } else if (errors.length <= 2) {
    strength = "medium";
  } else {
    strength = "weak";
  }

  return {
    valid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Password match validation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): { match: boolean; error?: string } {
  if (!confirmPassword) {
    return { match: false, error: "Confirma tu contraseña" };
  }

  if (password !== confirmPassword) {
    return { match: false, error: "Las contraseñas no coinciden" };
  }

  return { match: true };
}

/**
 * Map Supabase error messages to user-friendly Spanish messages
 */
export function getAuthErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    "user_already_exists": "Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.",
    "invalid_credentials": "Correo o contraseña inválidos",
    "email_not_confirmed": "Por favor confirma tu correo antes de iniciar sesión",
    "weak_password": "La contraseña no cumple los requisitos de seguridad",
    "invalid_email": "El correo no es válido",
    "invalid_password": "La contraseña no es válida",
    "user_not_found": "El usuario no existe",
    "Invalid login credentials": "Correo o contraseña inválidos",
    "SignUp requires a valid password": "La contraseña no es válida",
    "Signups not allowed for this instance": "Los registros están temporalmente deshabilitados. Por favor, intenta más tarde.",
    "Email link is invalid or has expired": "El enlace de confirmación es inválido o ha expirado",
    "OAuth error": "Error al conectar con Google. Intenta de nuevo.",
    "already_registered": "Este correo ya está registrado",
  };

  // Check for exact match first
  if (errorMap[error]) {
    return errorMap[error];
  }

  // Check for partial match in error message
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Fallback for unknown errors
  return error || "Ha ocurrido un error inesperado";
}
