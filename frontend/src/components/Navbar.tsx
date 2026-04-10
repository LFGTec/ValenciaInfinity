import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    navigate("/login", { replace: true });
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
              background: "#ff671f",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
            }}
          >
            <span>👤</span>
            <span className="max-w-[150px] truncate">{user.email}</span>
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "#e5e7eb" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {user.email}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "#6b7280" }}
                >
                  {user.role === "admin" ? "🔒 Administrador" : "👤 Fanático"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ color: "#ef4444" }}
              >
                🚪 Cerrar sesión
              </button>
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
