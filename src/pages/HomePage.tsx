import { useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { getReservations, roomInventory } from "../data/rooms";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const available = roomInventory.filter((room) => room.status === "Disponible").length;
  const reservations = getReservations().length;

  return (
    <main className="home-page">
      <HotelNavbar />
      <header className="home-hero">
        <div className="home-hero__copy">
          <span>HOTEL ROLEX · SUCRE · BOLIVIA</span>
          <h1>Una estancia con <em>estándar profesional.</em></h1>
          <p>Conoce nuestras habitaciones, servicios e instalaciones desde un sistema claro, moderno y organizado.</p>
          <div className="home-hero__actions">
            <button type="button" onClick={() => navigate("/habitaciones")}>Explorar habitaciones →</button>
            <button type="button" className="ghost" onClick={() => navigate("/instalaciones")}>Ver instalaciones</button>
          </div>
          <div className="home-metrics">
            <div><strong>10</strong><span>habitaciones</span></div>
            <div><strong>3</strong><span>categorías</span></div>
            <div><strong>6</strong><span>instalaciones</span></div>
          </div>
        </div>
        <div className="home-hero__card">
          <div className="home-hero__image"><img src={roomInventory[8].image} alt="Suite Premium Hotel Rolex" /></div>
          <div className="home-hero__cardbody">
            <span>HABITACIÓN DESTACADA</span>
            <h2>Suite Premium</h2>
            <p>Hasta 6 huéspedes · desde <b>$145</b>/noche</p>
            <button type="button" onClick={() => navigate("/habitaciones")}>Conocer habitaciones →</button>
          </div>
        </div>
      </header>

      <section className="home-intro">
        <span>HOTEL ROLEX</span>
        <h2>Todo lo que necesitas, en su propio espacio.</h2>
        <p>El sitio está organizado por secciones para que puedas consultar la información sin repetir constantemente el botón de reserva.</p>
      </section>

      <section className="home-overview">
        <div className="home-overview__cards">
          <button type="button" onClick={() => navigate("/habitaciones")}><strong>01</strong><b>Habitaciones</b><small>Inventario, precios y disponibilidad</small></button>
          <button type="button" onClick={() => navigate("/servicios")}><strong>02</strong><b>Servicios</b><small>Conoce lo que ofrece el hotel</small></button>
          <button type="button" onClick={() => navigate("/instalaciones")}><strong>03</strong><b>Instalaciones</b><small>Fotos de los espacios del hotel</small></button>
          <button type="button" onClick={() => navigate("/galeria")}><strong>04</strong><b>Galería</b><small>Explora las habitaciones en detalle</small></button>
          <button type="button" onClick={() => navigate("/contacto")}><strong>05</strong><b>Contacto</b><small>Envía una consulta al hotel</small></button>
        </div>
      </section>

      <section className="home-status">
        <div>
          <span>ESTADO DEL SISTEMA</span>
          <h2>Inventario listo para consultar.</h2>
          <p><b>{available}</b> habitaciones marcadas como disponibles · <b>{reservations}</b> reservas registradas localmente.</p>
        </div>
        <button type="button" onClick={() => navigate("/habitaciones")}>Ver inventario →</button>
      </section>
      <HotelFooter />
    </main>
  );
}

export default HomePage;
