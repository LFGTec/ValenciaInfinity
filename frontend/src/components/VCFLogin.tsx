import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Trophy,
  User,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Glasses,
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";

interface VCFLoginProps {
  onLogin?: (userType: "fan" | "admin") => void;
}

export function VCFLogin({ onLogin }: VCFLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<"fan" | "admin">(
    "fan",
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) onLogin(activeTab);
    }, 1500);
  };

  const features = [
    {
      icon: Star,
      label: "Álbum de Cartas",
      desc: "Colecciona y canjea cartas exclusivas",
    },
    {
      icon: Zap,
      label: "Match Rooms",
      desc: "Vive los partidos con otros fans",
    },
    {
      icon: Shield,
      label: "Trivias & Rankings",
      desc: "Compite y demuestra tu pasión",
    },
    {
      icon: Glasses,
      label: "Experiencia VR",
      desc: "Explora Mestalla en realidad virtual",
    },
  ];

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
        {/* Fondo con imagen de estadio con overlay */}
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
          {/* Logo grande */}
          <div className="mx-auto mb-8 relative w-32 h-32">
            <img
              src={vcfShield}
              alt="Valencia CF"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h1
            className="mb-2"
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: "#ffffff",
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
            className="mb-10 text-sm"
            style={{ color: "#b3b3b3" }}
          >
            La plataforma oficial para los fans del Valencia CF.
            Vive la pasión del club todo el año.
          </p>

          {/* Features list */}
          <div className="space-y-4 text-left">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{
                  background: "rgba(45,45,45,0.8)",
                  border: "1px solid rgba(255,103,31,0.3)",
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(255,103,31,0.25)",
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: "#ff671f" }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm"
                    style={{
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#b3b3b3" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="mt-8 text-xs"
            style={{ color: "#6b7280" }}
          >
            © 2026 Valencia CF Fan Platform · Temporada 2025/26
          </p>
        </div>
      </div>

      {/* ── Panel derecho – Formulario ── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 relative"
        style={{ background: "#f5f5f5" }}
      >
        {/* Línea de acento superior móvil */}
        <div
          className="absolute top-0 left-0 w-full h-1 lg:hidden"
          style={{ background: "#ff671f" }}
        />

        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg p-2"
              style={{ background: "#ff671f" }}
            >
              <img
                src={vcfShield}
                alt="Valencia CF"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p
                className="font-black text-lg"
                style={{ color: "#1a1a1a" }}
              >
                VALENCIA CF
              </p>
              <p
                className="text-xs font-bold"
                style={{ color: "#ff671f" }}
              >
                VALENCIA INFINITY
              </p>
            </div>
          </div>

          {/* Cabecera */}
          <div className="mb-8">
            <h2
              className="mb-1"
              style={{
                fontWeight: 900,
                fontSize: "1.8rem",
                color: "#1a1a1a",
              }}
            >
              Bienvenido de vuelta
            </h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Inicia sesión para acceder a tu cuenta de fan
            </p>
          </div>

          {/* Tabs Fan / Admin */}
          <div
            className="flex mb-6 rounded-xl overflow-hidden"
            style={{
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          >
            {[
              {
                id: "fan" as const,
                label: "Fanático",
                icon: User,
              },
              {
                id: "admin" as const,
                label: "Administrador",
                icon: Shield,
              },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all duration-200"
                style={{
                  fontWeight: 700,
                  borderRadius:
                    activeTab === id ? "10px" : undefined,
                  background:
                    activeTab === id
                      ? "transparent"
                      : "transparent",
                  color:
                    activeTab === id ? "#ff671f" : "#6b7280",
                  border:
                    activeTab === id
                      ? "2px solid #ff671f"
                      : "2px solid transparent",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "#374151", fontWeight: 600 }}
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    size={16}
                    style={{ color: "#6b7280" }}
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fan@valenciacf.es"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 outline-none transition-all"
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      "#ff671f")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "#e5e7eb")
                  }
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "#374151", fontWeight: 600 }}
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    size={16}
                    style={{ color: "#6b7280" }}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm placeholder-gray-400 outline-none transition-all"
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      "#ff671f")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "#e5e7eb")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                      style={{ color: "#6b7280" }}
                    />
                  ) : (
                    <Eye
                      size={16}
                      style={{ color: "#6b7280" }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Recordar / Olvidé */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: rememberMe
                      ? "#ff671f"
                      : "#f9fafb",
                    border: `2px solid ${rememberMe ? "#ff671f" : "#d1d5db"}`,
                  }}
                >
                  {rememberMe && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{ color: "#6b7280" }}
                >
                  Recordarme
                </span>
              </label>
              <a
                href="#"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: "#ff671f", fontWeight: 600 }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-xl text-sm text-center"
                style={{
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
              className="w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#e05516] active:scale-[0.99]"
              style={{
                background: "#ff671f",
                fontWeight: 700,
                color: "#ffffff",
                border: "none",
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
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Iniciar Sesión como{" "}
                  {activeTab === "fan" ? "Fanático" : "Admin"}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <p
            className="text-center mt-6 text-sm"
            style={{ color: "#6b7280" }}
          >
            ¿No tienes cuenta?{" "}
            <a
              href="#"
              className="transition-colors hover:opacity-80"
              style={{ color: "#ff671f", fontWeight: 700 }}
            >
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}