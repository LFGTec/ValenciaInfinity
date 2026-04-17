import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  Sun, Moon, Bell, Menu, X, User, LogOut, Settings, ChevronDown 
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";
import valenciaPointsIcon from "../assets/ValenciaPoints.png";

export default function MainLayout() {
  const { user, isAuthenticated, signOut, isSigningOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      setShowDropdown(false);
      navigate("/login", { replace: true });
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="bg-black border-b-2 border-vcf-orange sticky top-0 z-50 shadow-md">
        <div className="w-full px-4">
          <div className="flex items-center justify-between py-4">
            
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3">
              <img src={vcfShield} alt="VCF" className="w-14 h-14 object-contain" />
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center gap-6">
              {[
                { path: "/home", label: "INICIO" },
                { path: "/team", label: "EQUIPO" },
                { path: "/matches", label: "PARTIDOS" },
                { path: "/news", label: "NOTICIAS" },
                { path: "/fanzone", label: "ZONA FAN" },
                { path: "/juego", label: "JUEGO" },
                { path: "/nou-mestalla", label: "NOU MESTALLA" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    px-6 py-2 font-bold text-sm tracking-wide transition-all
                    ${isActive ? "text-vcf-orange border-b-4 border-vcf-orange" : "text-white hover:text-vcf-orange"}
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Acciones Derecha */}
            <div className="flex items-center gap-4 w-[260px] justify-end">
              
              {/* Puntos (Solo si está autenticado) */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-vcf-orange/10 border border-vcf-orange/30 rounded-lg">
                  <img src={valenciaPointsIcon} alt="Pts" className="w-6 h-6" />
                  <span className="text-white font-black">2,340</span>
                </div>
              )}

              <button onClick={toggleTheme} className="text-white hover:text-vcf-orange">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Perfil / Dropdown */}
              {/* Perfil / Login (contenedor fijo) */}
              <div className="w-[120px] flex justify-end relative">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <img 
                        src={user.user_metadata?.avatar_url || "https://via.placeholder.com/150"} 
                        alt="User" 
                        className="w-9 h-9 rounded-full border-2 border-vcf-orange object-cover"
                      />
                      <ChevronDown size={16} className={`text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-[100]">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name}</p> 
                          <p className="text-xs text-gray-500 truncate">{user.email}</p> 
                        </div> 
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-vcf-orange hover:text-white transition-colors"> 
                          <User size={16} /> Mi Perfil </Link> 
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-vcf-orange hover:text-white transition-colors"> 
                          <Settings size={16} /> Configuración 
                        </Link> 
                        <div className="border-t border-white/5 mt-1"> 
                          <button onClick={handleLogout} disabled={isSigningOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors" > 
                            <LogOut size={16} /> 
                            {isSigningOut ? "Saliendo..." : "Cerrar Sesión"} 
                          </button> 
                        </div> 
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-vcf-orange px-4 py-2 rounded-lg text-white font-bold text-sm">
                  INICIAR SESIÓN
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main onClick={() => setShowDropdown(false)}>
        <Outlet />
      </main>

      {/* Footer (Simplificado) */}
      <footer className="bg-black border-t border-white/5 py-10 text-center">
         <img src={vcfShield} alt="VCF" className="w-10 h-10 mx-auto mb-4 opacity-50" />
         <p className="text-gray-600 text-xs tracking-widest uppercase">© 2026 VALENCIA CF FAN PLATFORM</p>
      </footer>
    </div>
  );
}