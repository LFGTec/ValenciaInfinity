import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
    </nav>
  );
}

export default Navbar;
