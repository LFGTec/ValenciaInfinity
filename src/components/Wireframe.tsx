import React, { useState, useEffect } from "react";
import vcfShield from "../assets/EscudoValenciaCF.png";
import valenciaPointsIcon from "../assets/ValenciaPoints.png";
import {
  Home,
  Trophy,
  Calendar,
  Users,
  Bell,
  ShoppingBag,
  Video,
  Menu,
  X,
  Search,
  ChevronDown,
  Play,
  MessageSquare,
  TrendingUp,
  FileText,
  Gift,
  Gamepad2,
  Globe,
  User,
  Settings,
  LogOut,
  Clock,
  Star,
  Award,
  Share2,
  Heart,
  Eye,
  ArrowRight,
  BookOpen,
  Ticket,
  Sun,
  Moon,
} from "lucide-react";
import { MatchRooms } from "./features/MatchRooms";
import { CardAlbum } from "./features/CardAlbum";
import { TriviasQuizzes } from "./features/TriviasQuizzes";
import { Rankings } from "./features/Rankings";
import { CardExchange } from "./features/CardExchange";
import { VirtualWorld } from "./features/VirtualWorld";
import { UserProfile } from "./features/UserProfile";
import { FanMoodTracker } from "./features/FanMoodTracker";
import { UnityGame } from "./features/UnityGame";
import { HomePage } from "./pages/HomePage";
import { FansZonePage } from "./pages/FansZonePage";
import { MatchesPage } from "./pages/MatchesPage";
import { NewsPage } from "./pages/NewsPage";
import { TeamPage } from "./pages/TeamPage";
import { StorePage } from "./pages/StorePage";
import { VCFLogin } from "./VCFLogin";
import { NouMestellaPage } from "./NouMestellaPage";

export function Wireframe() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [userType, setUserType] = useState<"fan" | "admin">(
    "fan",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = (type: "fan" | "admin") => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  if (!isLoggedIn) {
    return <VCFLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}

      {/* Main Header */}
      <header className="bg-black border-b-2 border-vcf-orange sticky top-0 z-50 shadow-md">
        <div className="w-full  px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-14 h-14 flex-shrink-0 drop-shadow-lg">
                <img
                  src={vcfShield}
                  alt="Valencia CF"
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-11">
              {[
                { id: "home", label: "INICIO" },
                { id: "team", label: "EQUIPO" },
                { id: "matches", label: "PARTIDOS" },
                { id: "news", label: "NOTICIAS" },
                { id: "fans", label: "ZONA FAN" },
                { id: "unity-game", label: "JUEGO" },
                { id: "nou-mestalla", label: "NOU MESTALLA" },
                { id: "store", label: "TIENDA" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 font-bold text-sm tracking-wide transition-all ${
                    currentPage === item.id
                      ? "text-vcf-orange border-b-4 border-vcf-orange"
                      : "text-white hover:text-vcf-orange"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Valencia Points */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-vcf-orange/20 to-vcf-yellow/20 border-2 border-vcf-orange/50 rounded-lg hover:border-vcf-orange transition-all cursor-pointer">
                <div className="w-8 h-8 flex-shrink-0">
                  <img
                    src={valenciaPointsIcon}
                    alt="Valencia Points"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-vcf-yellow font-bold uppercase tracking-wide">
                    Puntos
                  </span>
                  <span className="text-lg font-black text-white leading-none">
                    2,340
                  </span>
                </div>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={darkMode ? "Modo Claro" : "Modo Oscuro"}
              >
                {darkMode ? (
                  <Sun size={20} className="text-vcf-yellow" />
                ) : (
                  <Moon size={20} className="text-white" />
                )}
              </button>
              <button
                onClick={() => setCurrentPage("search")}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search size={20} className="text-white" />
              </button>
              <button
                onClick={() => setCurrentPage("notifications")}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              >
                <Bell size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-vcf-red rounded-full animate-pulse"></span>
              </button>
              <button
                onClick={() => setCurrentPage("profile")}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                <User size={18} />
                <span className="text-sm font-medium">
                  MI PERFIL
                </span>
              </button>
              <button
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-b-2 border-vcf-orange shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <nav className="space-y-2">
              {[
                { id: "home", label: "INICIO" },
                { id: "team", label: "EQUIPO" },
                { id: "matches", label: "PARTIDOS" },
                { id: "news", label: "NOTICIAS" },
                { id: "fans", label: "ZONA FAN" },
                { id: "unity-game", label: "JUEGO" },
                { id: "nou-mestalla", label: "NOU MESTALLA" },
                { id: "store", label: "TIENDA" },
                { id: "profile", label: "MI PERFIL" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 font-bold text-sm rounded transition-colors ${
                    currentPage === item.id
                      ? "bg-vcf-orange text-white"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      {userType === "fan" ? (
        <FanContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <AdminContent />
      )}

      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Club Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center p-1">
                  <img
                    src={vcfShield}
                    alt="Valencia CF"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-bold text-xl">
                  VALENCIA CF
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                La plataforma oficial de engagement para los
                fans del Valencia CF.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "CLUB",
                links: [
                  "Historia",
                  "Estadio",
                  "Palmarés",
                  "Contacto",
                ],
              },
              {
                title: "ZONA FAN",
                links: [
                  "Match Rooms",
                  "Trivias",
                  "Álbum",
                  "Rankings",
                ],
              },
              {
                title: "LEGAL",
                links: [
                  "Privacidad",
                  "Términos",
                  "Cookies",
                  "FAQs",
                ],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4 text-vcf-orange">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <button className="hover:text-vcf-orange transition-colors">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Valencia CF Fan Platform. Todos los
              derechos reservados.
            </p>
            <div className="flex gap-4">
              {["F", "T", "I", "Y"].map((social, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-gray-800 rounded-full hover:bg-vcf-orange flex items-center justify-center transition-colors font-bold"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FanContent({
  currentPage,
  setCurrentPage,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}) {
  // Página principal
  if (currentPage === "home")
    return <HomePage setCurrentPage={setCurrentPage} />;

  // Páginas con funciones básicas
  if (currentPage === "matches")
    return <MatchesPage setCurrentPage={setCurrentPage} />;
  if (currentPage === "news")
    return <NewsPage setCurrentPage={setCurrentPage} />;
  if (currentPage === "fans")
    return <FansZonePage setCurrentPage={setCurrentPage} />;
  if (currentPage === "team") return <TeamPage />;
  if (currentPage === "store") return <StorePage />;
  if (currentPage === "nou-mestalla")
    return <NouMestellaPage />;

  // Funcionalidades específicas completas
  if (currentPage === "match-rooms") return <MatchRooms />;
  if (currentPage === "album") return <CardAlbum />;
  if (currentPage === "trivias") return <TriviasQuizzes />;
  if (currentPage === "rankings") return <Rankings />;
  if (currentPage === "exchange") return <CardExchange />;
  if (currentPage === "virtual-world") return <VirtualWorld />;
  if (currentPage === "profile") return <UserProfile />;
  if (currentPage === "mood-tracker") return <FanMoodTracker />;
  if (currentPage === "unity-game") return <UnityGame />;

  return <HomePage setCurrentPage={setCurrentPage} />;
}

function AdminContent() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          PANEL DE{" "}
          <span className="text-vcf-orange">
            ADMINISTRACIÓN
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Gestión de contenido y usuarios
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Usuarios Activos",
            value: "1,234",
            icon: Users,
            color: "bg-vcf-blue",
          },
          {
            label: "Noticias",
            value: "89",
            icon: FileText,
            color: "bg-vcf-orange",
          },
          {
            label: "Trivias",
            value: "45",
            icon: Gamepad2,
            color: "bg-vcf-yellow",
          },
          {
            label: "Cartas",
            value: "200",
            icon: BookOpen,
            color: "bg-vcf-red",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-4xl font-black text-foreground">
                {stat.value}
              </div>
            </div>
            <div className="text-sm font-bold text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "GESTIONAR NOTICIAS",
            color: "hover:border-vcf-orange",
          },
          {
            title: "GESTIONAR CALENDARIO",
            color: "hover:border-vcf-blue",
          },
          {
            title: "GESTIONAR CARTAS",
            color: "hover:border-vcf-yellow",
          },
          {
            title: "GESTIONAR TRIVIAS",
            color: "hover:border-vcf-red",
          },
          {
            title: "ESTADÍSTICAS USUARIOS",
            color: "hover:border-vcf-orange",
          },
          {
            title: "VER GANADORES",
            color: "hover:border-vcf-blue",
          },
        ].map((module) => (
          <button
            key={module.title}
            className={`bg-card border-2 border-border rounded-lg p-8 text-left ${module.color} transition-all group hover:shadow-lg`}
          >
            <h3 className="text-xl font-black mb-2 text-foreground group-hover:text-vcf-orange transition-colors">
              {module.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Administrar y configurar
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-vcf-orange">
              ACCEDER{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}