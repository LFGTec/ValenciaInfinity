
export function Wireframe() {
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

      

      {/* Footer */}
      
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

