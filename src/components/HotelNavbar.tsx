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

  const goToReservation = () => {
    setOpen(false);
    if (!authRepository.isAuthenticated()) {
      navigate("/login?redirect=/reservar");
      return;
    }
    navigate("/reservar");
  };

  const active = (path: string) => location.pathname === path;
  const profilePath = user ? "/perfil" : "/login";

  return (
    <nav className="hotel-navbar">
      <button className="hotel-navbar__brand" type="button" onClick={() => go("/")}>
        <span>HR</span>
        <strong>Hotel Rolex</strong>
      </button>
      <button className="hotel-navbar__toggle" type="button" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú">☰</button>
      <div className={`hotel-navbar__links ${open ? "is-open" : ""}`}>
        <button className={active("/") ? "active" : ""} type="button" onClick={() => go("/")}>Inicio</button>
        <button className={active("/habitaciones") ? "active" : ""} type="button" onClick={() => go("/habitaciones")}>Habitaciones</button>
        <button className={active("/servicios") ? "active" : ""} type="button" onClick={() => go("/servicios")}>Servicios</button>
        <button className={active("/instalaciones") ? "active" : ""} type="button" onClick={() => go("/instalaciones")}>Instalaciones</button>
        <button className={active("/galeria") ? "active" : ""} type="button" onClick={() => go("/galeria")}>Galería</button>
        <button className={active("/contacto") ? "active" : ""} type="button" onClick={() => go("/contacto")}>Contacto</button>
        <button className={`hotel-navbar__profile ${active("/perfil") || active("/login") ? "active" : ""}`} type="button" onClick={() => go(profilePath)}>
          <span className="profile-icon">♙</span>
          {user ? "Mi perfil" : "Perfil / Ingresar"}
        </button>
        <button className="hotel-navbar__reserve" type="button" onClick={goToReservation}>Reservar</button>
      </div>
    </nav>
  );
}

export default HotelNavbar;
