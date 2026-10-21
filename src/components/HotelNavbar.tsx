import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./HotelNavbar.css";

function HotelNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = authRepository.getCurrentUser();

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const reserve = () => {
    setOpen(false);
    navigate(authRepository.isAuthenticated() ? "/reservar" : "/login?redirect=/reservar");
  };

  const active = (path: string) => location.pathname === path;
  const profilePath = user ? "/perfil" : "/login";

  return (
    <nav className="hotel-navbar" aria-label="Navegación principal">
      <button className="hotel-navbar__brand" type="button" onClick={() => go("/")} aria-label="B&B Santa Cecilia Inc., ir al inicio">
        <span aria-hidden="true">BS</span>
        <strong>B&amp;B Santa Cecilia Inc.</strong>
      </button>

      <button
        className="hotel-navbar__toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="hotel-navbar-links"
      >
        {open ? "×" : "☰"}
      </button>

      <div id="hotel-navbar-links" className={`hotel-navbar__links ${open ? "is-open" : ""}`}>
        <button className={active("/") ? "active" : ""} aria-current={active("/") ? "page" : undefined} type="button" onClick={() => go("/")}>Inicio</button>
        <button className={active("/habitaciones") ? "active" : ""} aria-current={active("/habitaciones") ? "page" : undefined} type="button" onClick={() => go("/habitaciones")}>Habitaciones</button>
        <button className={active("/servicios") ? "active" : ""} aria-current={active("/servicios") ? "page" : undefined} type="button" onClick={() => go("/servicios")}>Servicios</button>
        <button className={active("/instalaciones") ? "active" : ""} aria-current={active("/instalaciones") ? "page" : undefined} type="button" onClick={() => go("/instalaciones")}>Instalaciones</button>
        <button className={active("/galeria") ? "active" : ""} aria-current={active("/galeria") ? "page" : undefined} type="button" onClick={() => go("/galeria")}>Galería</button>
        <button className={active("/opiniones") ? "active" : ""} aria-current={active("/opiniones") ? "page" : undefined} type="button" onClick={() => go("/opiniones")}>Opiniones</button>
        <button className={active("/promociones") ? "active" : ""} aria-current={active("/promociones") ? "page" : undefined} type="button" onClick={() => go("/promociones")}>Ofertas</button>
        <button className={active("/contacto") ? "active" : ""} aria-current={active("/contacto") ? "page" : undefined} type="button" onClick={() => go("/contacto")}>Contacto</button>
        {user?.role === "ADMIN" && (
          <button className={active("/admin") ? "active" : ""} aria-current={active("/admin") ? "page" : undefined} type="button" onClick={() => go("/admin")}>Administración</button>
        )}
        <button className={`hotel-navbar__profile ${active("/perfil") || active("/login") ? "active" : ""}`} type="button" onClick={() => go(profilePath)}>
          <span className="profile-icon" aria-hidden="true">♙</span>
          {user ? "Mi perfil" : "Perfil / Ingresar"}
        </button>
        <button className="hotel-navbar__reserve" type="button" onClick={reserve}>Reservar</button>
      </div>
    </nav>
  );
}

export default HotelNavbar;