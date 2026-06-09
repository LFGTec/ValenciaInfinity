import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Flame,
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";
import valenciaPointsIcon from "../assets/ValenciaPoints.png";
import { formatNumber } from "@/utils/formatNumbers";


export default function MainLayout() {
  const { user, isAuthenticated, signOut, isSigningOut } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      setShowDropdown(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="bg-black border-b-2 border-vcf-orange sticky top-0 z-50 shadow-md">
        <div className="w-full px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3">
              <img
                src={vcfShield}
                alt="VCF"
                className="w-14 h-14 object-contain"
              />
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden xl:flex items-center gap-2 2xl:gap-4">
              {[
                { path: "/home", label: "INICIO" },
                { path: "/team", label: "EQUIPO" },
                { path: "/matches", label: "PARTIDOS" },
                { path: "/news", label: "NOTICIAS" },
                { path: "/fanzone", label: "ZONA FAN" },
                { path: "/juego", label: "MESTALLA RIVALS" },
                { path: "/ticket", label: "ENTRADAS" },
                { path: "/store", label: "TIENDA" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    px-2 xl:px-3 2xl:px-4
                    py-2
                    font-bold
                    text-xs xl:text-sm
                    tracking-wide
                    transition-all
                    whitespace-nowrap
                    hover:-translate-y-1
                    ${
                      isActive
                        ? "text-vcf-orange border-b-4 border-vcf-orange"
                        : "text-white hover:text-vcf-orange"
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Acciones Derecha */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Puntos + Racha (Solo si está autenticado) */}
              {isAuthenticated && (
                <>
                  {(user?.current_streak ?? 0) > 0 && (
                    <Link
                      to="/daily-rewards"
                      className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 hover:border-orange-500/50 transition-all hover:-translate-y-1 cursor-pointer"
                    >
                      <Flame
                        size={16}
                        className="text-orange-400 flex-shrink-0"
                      />
                      <span className="text-white font-black text-sm">
                        {user?.current_streak}
                      </span>
                    </Link>
                  )}
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-vcf-orange/10 border border-vcf-orange/30 rounded-lg whitespace-nowrap">
                    <img
                      src={valenciaPointsIcon}
                      alt=""
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="text-vcf-orange font-black text-sm tabular-nums">
                      {formatNumber(user?.puntos)}
                    </span>
                    <span className="text-white/40 text-[10px] font-bold uppercase">
                      pts
                    </span>
                  </div>
                </>
              )}

              {isAuthenticated && (
                <div className="flex md:hidden items-center gap-2">
                  {(user?.current_streak ?? 0) > 0 && (
                    <Link
                      to="/daily-rewards"
                      className="
                        flex items-center gap-1
                        px-2 py-1
                        bg-orange-500/10
                        border border-orange-500/30
                        rounded-lg
                        hover:bg-orange-500/20
                        transition-all
                        hover:-translate-y-1
                        cursor-pointer
                      "
                    >
                      <Flame
                        size={14}
                        className="text-orange-400 flex-shrink-0"
                      />
                      <span className="text-white font-black text-xs">
                        {user?.current_streak}
                      </span>
                    </Link>
                  )}

                  <div
                    className="
                      flex items-center gap-1
                      px-2 py-1
                      bg-vcf-orange/10
                      border border-vcf-orange/30
                      rounded-lg
                      whitespace-nowrap
                    "
                  >
                    <img
                      src={valenciaPointsIcon}
                      alt=""
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-vcf-orange font-black text-xs">
                      {formatNumber(user?.puntos)}
                    </span>
                  </div>
                </div>
              )}

              {/* Perfil / Login */}
              <div className="flex justify-end relative flex-shrink-0">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all hover:-translate-y-1 cursor-pointer"
                    >
                      {(user.avatar_url ?? user.user_metadata?.avatar_url) ? (
                        <img
                          src={
                            user.avatar_url ?? user.user_metadata?.avatar_url
                          }
                          alt="User"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 md:w-9 md:h-9
                                      rounded-full
                                      object-cover"
                        />
                      ) : (
                        <div className=" w-8 h-8 md:w-9 md:h-9
                                          rounded-full
                                          bg-vcf-orange
                                          flex items-center justify-center">
                          {(user.full_name ??
                            user.email ??
                            "?")[0].toUpperCase()}
                        </div>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-white transition-transform ${showDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-[100]">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-bold text-white truncate">
                            {user.full_name ?? user.user_metadata?.full_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-vcf-orange hover:text-white transition-colors"
                        >
                          <User size={16} /> Mi Perfil{" "}
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-vcf-orange hover:text-white transition-colors"
                        >
                          <Settings size={16} /> Configuración
                        </Link>
                        <div className="border-t border-white/5 mt-1">
                          <button
                            onClick={handleLogout}
                            disabled={isSigningOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <LogOut size={16} />
                            {isSigningOut ? "Saliendo..." : "Cerrar Sesión"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-vcf-orange px-4 py-2 rounded-lg text-white font-bold text-sm"
                  >
                    INICIAR SESIÓN
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="xl:hidden
                        fixed
                        top-[86px]
                        left-0
                        right-0
                        bottom-0
                        bg-black
                        z-[90]
                        overflow-y-auto">
          <nav className="flex flex-col py-2">
            {[
              { path: "/home", label: "INICIO" },
              { path: "/team", label: "EQUIPO" },
              { path: "/matches", label: "PARTIDOS" },
              { path: "/news", label: "NOTICIAS" },
              { path: "/fanzone", label: "ZONA FAN" },
              { path: "/juego", label: "MESTALLA RIVALS" },
              { path: "/store", label: "TIENDA" },
              { path: "/ticket", label: "ENTRADAS" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-6 py-4 text-sm font-bold border-l-4 transition-all hover:-translate-y-1
                  ${
                    isActive
                      ? "border-vcf-orange text-vcf-orange bg-white/5"
                      : "border-transparent text-white hover:text-vcf-orange hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main onClick={() => setShowDropdown(false)}>
        <Outlet />
      </main>

      {/* Footer (Simplificado) */}
      <footer className="bg-black border-t border-white/5 py-10 text-center">
        <img
          src={vcfShield}
          alt="VCF"
          className="w-10 h-10 mx-auto mb-4 opacity-50"
        />
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          © 2026 VALENCIA CF FAN PLATFORM
        </p>
      </footer>
    </div>
  );
}
