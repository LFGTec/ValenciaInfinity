import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Check, ChevronRight } from "lucide-react";
import { updatePassword } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Password validation
  const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 8) {
      return { valid: false, error: "Mínimo 8 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: "Falta una mayúscula" };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, error: "Falta un número" };
    }
    return { valid: true };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value) {
      const validation = validatePassword(value);
      setPasswordError(validation.valid ? "" : validation.error || "");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (!newPassword) {
      setPasswordError("Por favor ingresa una contraseña");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setPasswordError(validation.error || "Contraseña inválida");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await updatePassword(newPassword);

    if (updateError) {
      const friendlyError = getAuthErrorMessage(updateError);
      setError(friendlyError);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ── Panel izquierdo ── */}
      <div
        className="hidden lg:flex flex-1 relative flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)",
        }}
      >
        {/* Fondo estadio */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1754253780399-aa2dcd99eded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYWxlbmNpYSUyMENGJTIwTWVzdGFsbGElMjBzdGFkaXVtJTIwZm9vdGJhbGwlMjBuaWdodHxlbnwxfHx8fDE3NzI4MTcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />

        {/* Gradiente decorativo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(209,136,23,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,151,216,0.05) 0%, transparent 50%)",
          }}
        />

        {/* Contenido */}
        <div className="relative z-10 px-12 max-w-lg text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/EscudoValenciaCF.png"
              alt="Valencia CF"
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            CONTRASEÑA SEGURA
          </h1>
          <p
            style={{
              color: "#b3b3b3",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            Establece una contraseña fuerte para proteger tu cuenta de Valencia
            CF.
          </p>
        </div>
      </div>

      {/* ── Panel derecho – Formulario ── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto"
        style={{ background: "#f5f5f5" }}
      >
        {/* Línea acento móvil */}
        <div
          className="absolute top-0 left-0 w-full h-1 lg:hidden"
          style={{ background: "#ff671f" }}
        />

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                fontWeight: 900,
                fontSize: "1.8rem",
                color: "#1a1a1a",
                marginBottom: "6px",
                lineHeight: 1.15,
              }}
            >
              {success ? "¡Contraseña actualizada!" : "Nueva contraseña"}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
              {success
                ? "Tu contraseña ha sido restablecida correctamente"
                : "Ingresa una contraseña fuerte y segura"}
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.2)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Check size={32} style={{ color: "#22c55e" }} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
                Contraseña actualizada
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "20px" }}>
                Tu contraseña ha sido cambiada exitosamente. Continúa disfrutando
                de Valencia Infinity.
              </p>
              <button
                onClick={() => navigate("/home")}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "#ff671f",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Ir al inicio
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* Formulario */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                {/* Nueva Contraseña */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Nueva contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        paddingLeft: "44px",
                        paddingRight: "48px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        background: "#f9fafb",
                        border: passwordError
                          ? "1px solid #ef4444"
                          : "1px solid #e5e7eb",
                        color: "#1a1a1a",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#ff671f")}
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = passwordError
                          ? "#ef4444"
                          : "#e5e7eb")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} style={{ color: "#6b7280" }} />
                      ) : (
                        <Eye size={16} style={{ color: "#6b7280" }} />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px" }}>
                      {passwordError}
                    </p>
                  )}
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "6px" }}>
                    Mínimo 8 caracteres, con mayúscula y número
                  </p>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Confirmar contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        paddingLeft: "44px",
                        paddingRight: "48px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        color: "#1a1a1a",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#ff671f")}
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          newPassword &&
                          confirmPassword &&
                          newPassword !== confirmPassword
                            ? "#ef4444"
                            : "#e5e7eb")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} style={{ color: "#6b7280" }} />
                      ) : (
                        <Eye size={16} style={{ color: "#6b7280" }} />
                      )}
                    </button>
                  </div>
                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px" }}>
                        Las contraseñas no coinciden
                      </p>
                    )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      textAlign: "center",
                      background: "rgba(238,53,36,0.1)",
                      border: "1px solid rgba(238,53,36,0.3)",
                      color: "#EE3524",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Botón principal */}
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    !!passwordError
                  }
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "15px 0",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "#ff671f",
                    border: "none",
                    cursor:
                      isLoading ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      !!passwordError
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      isLoading ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      !!passwordError
                        ? 0.6
                        : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "opacity 0.2s",
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Actualizar contraseña
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
