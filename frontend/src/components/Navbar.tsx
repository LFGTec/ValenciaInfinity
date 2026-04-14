import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Navbar() {
  const { user, isAuthenticated, signOut, isSigningOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogout = async () => {
    setLogoutMessage("Cerrando sesión...");
    const { error } = await signOut();

    if (error) {
      setLogoutMessage(`Error al cerrar sesión: ${error}`);
      setTimeout(() => setLogoutMessage(""), 3000);
      return;
    }

    setLogoutMessage("Sesión cerrada correctamente");
    setShowDropdown(false);

    // Redirect after brief delay
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            INICIO
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/team"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            EQUIPO
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/matches"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            PARTIDOS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/news"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            NOTICIAS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/fanzone"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            ZONA FAN
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/game"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            JUEGO
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/nou-mestalla"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            NOU-MESTALLA
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            TIENDA
          </NavLink>
        </li>
      </ul>

      {isAuthenticated && user ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="navbar-login-btn flex items-center gap-2"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 4px",
              borderRadius: "8px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            disabled={isSigningOut}
          >
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ff671f",
                }}
              />
            ) : (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff671f, #ff8a3d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span style={{ color: "#1a1a1a", fontSize: "0.875rem", fontWeight: 500, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
            </span>
            <svg
              style={{
                width: "16px",
                height: "16px",
                color: "#6b7280",
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {logoutMessage && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                zIndex: 100,
                background: logoutMessage.includes("Error") ? "rgba(238,53,36,0.9)" : "rgba(34,197,94,0.9)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {logoutMessage}
            </div>
          )}

          {showDropdown && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl z-50"
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              {/* Header con avatar y nombre */}
              <div
                className="px-5 py-4 border-b flex items-center gap-3"
                style={{ borderColor: "#efefef" }}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ff671f",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff671f, #ff8a3d)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: "#1a1a1a" }}
                  >
                    {user.user_metadata?.full_name || "Usuario"}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "#9ca3af" }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: "8px 4px" }}>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors rounded-lg"
                  style={{
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    background: "none",
                    border: "none",
                    margin: "4px 0",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>👤</span>
                  Mi perfil
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors rounded-lg"
                  style={{
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    background: "none",
                    border: "none",
                    margin: "4px 0",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>⚙️</span>
                  Configuración
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#f0f0f0", margin: "0 4px" }} />

              {/* Logout Button */}
              <div style={{ padding: "8px 4px" }}>
                <button
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors rounded-lg"
                  style={{
                    color: isSigningOut ? "#d1d5db" : "#ef4444",
                    cursor: isSigningOut ? "not-allowed" : "pointer",
                    opacity: isSigningOut ? 0.6 : 1,
                    fontSize: "0.875rem",
                    background: "none",
                    border: "none",
                    margin: "4px 0",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>🚪</span>
                  {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="navbar-login-btn"
        >
          Iniciar sesión
        </button>
      )}
    </nav>
  );
}

export default Navbar;

