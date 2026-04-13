import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Glasses,
} from "lucide-react";
import {
  signInWithEmail,
  signInWithGoogle,
  type UserRole,
} from "../services/authService";
import { setUserAtom } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, getAuthErrorMessage } from "../utils/validation";

const FEATURES = [
  {
    icon: Star,
    title: "Álbum de Cartas",
    desc: "Colecciona y canjea cartas exclusivas",
  },
  {
    icon: Zap,
    title: "Match Rooms",
    desc: "Vive los partidos con otros fans",
  },
  {
    icon: Shield,
    title: "Trivias & Rankings",
    desc: "Compite y demuestra tu pasión",
  },
  {
    icon: Glasses,
    title: "Experiencia VR",
    desc: "Explora Mestalla en realidad virtual",
  },
];

export default function LogInn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetAtom(setUserAtom);
  const { isAuthenticated } = useAuth();

  const activeTab: UserRole = "fan";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const errorMsg = searchParams.get("error");
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
    }
  }, [searchParams]);

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const validation = validateEmail(email);
      setEmailError(validation.valid ? "" : validation.error || "");
    } else {
      setEmailError("");
    }
  }, [email]);

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || "");
      return;
    }

    if (!password) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    setIsLoading(true);

    const { user, error: signInError } = await signInWithEmail(email, password);

    if (signInError) {
      const friendlyError = getAuthErrorMessage(signInError);
      setError(friendlyError);
      setIsLoading(false);
      return;
    }

    if (user) {
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      setUser(user);
      setIsLoading(false);
      navigate("/home", { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    const { error: googleError } = await signInWithGoogle(activeTab);

    if (googleError) {
      const friendlyError = getAuthErrorMessage(googleError);
      setError(friendlyError);
      setIsLoading(false);
    }
  };

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
          {/* Logo — centrado con flex */}
          <div className="flex items-center justify-center mb-8">
            <img
              src="/EscudoValenciaCF.png"
              alt="Valencia CF"
              style={{ width: "8rem", height: "8rem", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
            />
          </div>

          <h1
            className="mb-2"
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            VALENCIA CF
          </h1>
          <p
            className="mb-2"
            style={{
              color: "#ff671f",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "3px",
            }}
          >
            VALENCIA INFINITY
          </p>
          <p
            className="mb-10"
            style={{ color: "#b3b3b3", fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            La plataforma oficial para los fans del Valencia CF.
            Vive la pasión del club todo el año.
          </p>

          {/* Features — más espacio, padding generoso */}
          <div className="text-left" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(45,45,45,0.8)",
                  border: "1px solid rgba(255,103,31,0.3)",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,103,31,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} style={{ color: "#ff671f" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.875rem", marginBottom: "2px" }}>
                    {title}
                  </p>
                  <p style={{ color: "#b3b3b3", fontSize: "0.75rem", lineHeight: 1.4 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
            © 2026 Valencia CF Fan Platform · Temporada 2025/26
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
          {/* Logo móvil */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#ff671f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(255,103,31,0.4)",
              }}
            >
              <img
                src="/EscudoValenciaCF.png"
                alt="Valencia CF"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: "1.125rem", color: "#1a1a1a", margin: 0 }}>
                VALENCIA CF
              </p>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff671f", letterSpacing: "2px", margin: 0 }}>
                VALENCIA INFINITY
              </p>
            </div>
          </div>

          {/* Cabecera */}
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
              Bienvenido de vuelta
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
              Inicia sesión para acceder a tu cuenta de fan
            </p>
          </div>

          {/* Tabs Fan / Admin */}
          

          {/* Formulario */}
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
              <label
                style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px", color: "#374151", fontWeight: 600 }}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.es"
                  style={{
                    width: "100%",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    background: "#f9fafb",
                    border: emailError ? "1px solid #ef4444" : "1px solid #e5e7eb",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#ff671f")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = emailError ? "#ef4444" : "#e5e7eb")}
                />
              </div>
              {emailError && (
                <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px" }}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label
                style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px", color: "#374151", fontWeight: 600 }}
              >
                Contraseña
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  {showPassword ? (
                    <EyeOff size={16} style={{ color: "#6b7280" }} />
                  ) : (
                    <Eye size={16} style={{ color: "#6b7280" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Recordar / Olvidé */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", marginBottom: "4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                    background: rememberMe ? "#ff671f" : "#f9fafb",
                    border: `2px solid ${rememberMe ? "#ff671f" : "#d1d5db"}`,
                  }}
                >
                  {rememberMe && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Recordarme</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{
                  fontSize: "0.875rem",
                  color: "#ff671f",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginTop: "8px",
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
              disabled={isLoading || !email || !password}
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
                cursor: isLoading || !email || !password ? "not-allowed" : "pointer",
                opacity: isLoading || !email || !password ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s",
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Iniciar Sesión como {activeTab === "fan" ? "Aficionado" : "Admin"}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "36px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, whiteSpace: "nowrap" }}>
              O continúa con
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#1a1a1a",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

          {/* Registro */}
          <p style={{ textAlign: "center", marginTop: "36px", paddingBottom: "16px", fontSize: "0.875rem", color: "#6b7280" }}>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={{
                color: "#ff671f",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                padding: 0,
              }}
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}