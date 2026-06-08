import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ChevronLeft, Check } from "lucide-react";
import { requestPasswordReset } from "../services/authService";
import { validateEmail, getAuthErrorMessage } from "../utils/validation";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Real-time email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value) {
      const validation = validateEmail(value);
      setEmailError(validation.valid ? "" : validation.error || "");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || "");
      return;
    }

    setIsLoading(true);

    const { error: resetError } = await requestPasswordReset(email);

    if (resetError) {
      const friendlyError = getAuthErrorMessage(resetError);
      setError(friendlyError);
      setIsLoading(false);
      return;
    }

    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
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
            RECUPERA TU CUENTA
          </h1>
          <p
            style={{
              color: "#b3b3b3",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            Te enviaremos un enlace seguro por correo electrónico para que
            restablezca tu contraseña.
          </p>
        </div>
      </div>

      {/* ── Panel derecho – Formulario ── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto"
        style={{ background: "var(--background)" }}
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
                color: "var(--foreground)",
                marginBottom: "6px",
                lineHeight: 1.15,
              }}
            >
              {submitted ? "Verifica tu correo" : "¿Olvidaste tu contraseña?"}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", margin: 0 }}>
              {submitted
                ? "Hemos enviado instrucciones a tu correo"
                : "Ingresa tu correo electrónico para recibir un enlace de recuperación"}
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
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
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>
                Correo enviado exitosamente
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "20px" }}>
                Revisa tu bandeja de entrada (y spam) para el enlace de
                recuperación. El enlace expira en 24 horas.
              </p>
              <button
                onClick={() => navigate("/login")}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Volver al iniciar sesión
              </button>
            </div>
          ) : (
            <>
              {/* Formulario */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      marginBottom: "8px",
                      color: "var(--foreground)",
                      fontWeight: 600,
                    }}
                  >
                    Correo electrónico
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
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
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="tu@email.es"
                      style={{
                        width: "100%",
                        paddingLeft: "44px",
                        paddingRight: "16px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        background: "var(--input-background)",
                        border: emailError
                          ? "1px solid #ef4444"
                          : "1px solid var(--border)",
                        color: "var(--foreground)",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#ff671f")}
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = emailError
                          ? "#ef4444"
                          : "var(--border)")
                      }
                    />
                  </div>
                  {emailError && (
                    <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px" }}>
                      {emailError}
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
                  disabled={isLoading || !email}
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
                    cursor: isLoading || !email ? "not-allowed" : "pointer",
                    opacity: isLoading || !email ? 0.6 : 1,
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Enviar enlace de recuperación
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <button
                onClick={() => navigate("/login")}
                style={{
                  marginTop: "24px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#ff671f",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 0",
                }}
              >
                <ChevronLeft size={16} />
                Volver a iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
