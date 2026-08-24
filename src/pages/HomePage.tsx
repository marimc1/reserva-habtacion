import { useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="home-page">
      <nav className="home-navbar" aria-label="Navegación principal">
        <a className="home-navbar__brand" href="#inicio">
          Hotel Rolex
        </a>

        <ul className="home-navbar__menu">
          <li>
            <a className="home-navbar__link" href="#inicio">
              Inicio
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#habitaciones">
              Habitaciones
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#servicios">
              Servicios
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#galeria">
              Galeria
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#contacto">
              Contacto
            </a>
          </li>
          <li>
            <a
              className="home-navbar__link home-navbar__reserve"
              href="#reservar"
            >
              Reservar
            </a>
          </li>
        </ul>
      </nav>

      <section id="inicio" className="home-page__content">
        <h1>Página principal</h1>

        {user ? (
          <>
            <p>Bienvenido, {user.name}</p>
            <p>Carnet: {user.carnet}</p>
            <p>Rol: {user.role}</p>

            <button type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>No existe una sesión activa.</p>
        )}
      </section>
    </main>
  );
}

export default HomePage;
