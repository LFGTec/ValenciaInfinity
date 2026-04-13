import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Star,
  Zap,
  Shield,
  Glasses,
} from "lucide-react";
import { signUpWithEmail, type UserRole } from "../services/authService";
import { setUserAtom } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";

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

export default function SignUp() {
  const navigate = useNavigate();
  const setUser = useSetAtom(setUserAtom);
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<UserRole>("fan");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    const { user, error: signUpError } = await signUpWithEmail(
      email,
      password,
      activeTab
    );

    if (signUpError) {
      setError(signUpError);
      setIsLoading(false);
      return;
    }

    if (user) {
      setUser(user);
      setIsLoading(false);
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel izquierdo */}
      <div
        className="hidden lg:flex flex-1 relative flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1754253780399-aa2dcd99eded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYWxlbmNpYSUyMENGJTIwTWVzdGFsbGElMjBzdGFkaXVtJTIwZm9vdGJhbGwlMjBuaWdodHxlbnwxfHx8fDE3NzI4MTcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(209,136,23,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,151,216,0.05) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 px-12 max-w-lg text-center">
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
            Únete a la comunidad oficial de fans del Valencia CF.
            Disfruta de contenido exclusivo y experiencias únicas.
          </p>

          {/* Features */}
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

      {/* Panel derecho */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto"
        style={{ background: "#f5f5f5" }}
      >
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
              Crea tu cuenta
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
              Únete a la comunidad de fans del Valencia CF
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              marginBottom: "24px",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          >
            {(["fan", "admin"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px 0",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: activeTab === tab ? "10px" : undefined,
                  color: activeTab === tab ? "#ff671f" : "#6b7280",
                  border: activeTab === tab ? "2px solid #ff671f" : "2px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab === "fan" ? "Aficionado" : "Administrador"}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                    border: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#ff671f")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
              </div>
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

            {/* Confirmar contraseña */}
            <div>
              <label
                style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px", color: "#374151", fontWeight: 600 }}
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
                  type={showConfirm ? "text" : "password"}
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
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? (
                    <EyeOff size={16} style={{ color: "#6b7280" }} />
                  ) : (
                    <Eye size={16} style={{ color: "#6b7280" }} />
                  )}
                </button>
              </div>
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
              disabled={isLoading}
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
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p
            className="text-center mt-10 text-sm"
            style={{ color: "#6b7280" }}
          >
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold hover:opacity-80 transition-opacity"
              style={{
                color: "#ff671f",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
