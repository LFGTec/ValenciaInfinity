import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  Home, TrendingUp, Users, BookOpen, 
  Gamepad2, Calendar, Trophy, Settings, Menu, LogOut, ChevronLeft,
  BarChart3
} from "lucide-react";
import vcfShield from "../assets/EscudoValenciaCF.png";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, isSigningOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const adminNavItems = [
    { id: "home", label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { id: "statistics", label: "Estadísticas", icon: BarChart3, path: "/admin/statistics" },
    { id: "activity", label: "Actividad", icon: TrendingUp, path: "/admin/activity" },
    { id: "users", label: "Usuarios", icon: Users, path: "/admin/users" },
    { id: "manage-cards", label: "Cartas", icon: BookOpen, path: "/admin/cards" },
    { id: "manage-trivias", label: "Trivias", icon: Gamepad2, path: "/admin/trivias" },
    { id: "manage-timeline", label: "Línea de Tiempo", icon: Calendar, path: "/admin/timeline" },
    { id: "manage-calendar", label: "Calendario", icon: Calendar, path: "/admin/calendar" },
    { id: "winners", label: "Ganadores", icon: Trophy, path: "/admin/winners" },
    { id: "settings", label: "Ajustes", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      {/* <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-black border-r border-vcf-orange/30 transition-all duration-300 flex flex-col fixed h-screen z-50`}
      > */}
        <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col fixed h-screen z-50`}>
        {/* Logo Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img src={vcfShield} alt="VCF" className="w-10 h-10 object-contain" />
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-white font-black text-xs tracking-tighter">VALENCIA CF</span>
              <span className="text-vcf-orange text-[10px] font-bold uppercase tracking-widest">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all
                ${isActive 
                  ? "bg-vcf-orange text-white shadow-lg shadow-vcf-orange/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-vcf-orange transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isSigningOut}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-bold text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 min-h-screen`}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {/* Aquí es donde se renderizarán las sub-páginas (AdminDashboard, AdminUsers, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}