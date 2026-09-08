import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { getReservations, hasReservationConflict, roomInventory } from "../data/rooms";
import "./HomePage.css";

const today = new Date().toISOString().slice(0, 10);

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [searchMessage, setSearchMessage] = useState("Selecciona tus fechas y cantidad de huéspedes para comenzar.");
  const [hasSearched, setHasSearched] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const availableRooms = useMemo(() => {
    if (!hasSearched || !checkIn || !checkOut || checkOut <= checkIn) return [];
    const requestedGuests = Number(guests);
    return roomInventory.filter((room) =>
      room.status === "Disponible" &&
      room.capacity >= requestedGuests &&
      checkIn >= room.availableFrom &&
      checkOut <= room.availableTo &&
      !hasReservationConflict(room.number, checkIn, checkOut)
    );
  }, [checkIn, checkOut, guests, hasSearched]);

  const availableCount = roomInventory.filter((room) => room.status === "Disponible").length;
  const occupiedCount = roomInventory.filter((room) => room.status === "Ocupada").length;
  const reservationCount = getReservations().length;

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
    if (!checkIn || !checkOut) return setSearchMessage("Completa la fecha de entrada y salida.");
    if (checkIn < today) return setSearchMessage("La fecha de entrada no puede ser anterior a hoy.");
    if (checkOut <= checkIn) return setSearchMessage("La fecha de salida debe ser posterior a la fecha de entrada.");
    const count = roomInventory.filter((room) => room.status === "Disponible" && room.capacity >= Number(guests) && checkIn >= room.availableFrom && checkOut <= room.availableTo && !hasReservationConflict(room.number, checkIn, checkOut)).length;
    setSearchMessage(count ? `${count} habitación${count === 1 ? "" : "es"} disponible${count === 1 ? "" : "s"} para tu estancia.` : "No encontramos habitaciones para esas fechas. Prueba con otras fechas o menos huéspedes.");
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="home-page">
      <nav className="home-navbar" aria-label="Navegación principal">
        <button className="home-navbar__brand" type="button" onClick={() => navigate("/")}>Hotel Rolex</button>
        <button className="home-navbar__toggle" type="button" onClick={() => setMobileMenu((value) => !value)} aria-label="Abrir menú">☰</button>
        <div className={`home-navbar__menu ${mobileMenu ? "is-open" : ""}`}>
          <a href="#inicio" onClick={() => setMobileMenu(false)}>Inicio</a>
          <button type="button" onClick={() => navigate("/habitaciones")}>Habitaciones</button>
          <a href="#servicios" onClick={() => setMobileMenu(false)}>Servicios</a>
          <a href="#experiencia" onClick={() => setMobileMenu(false)}>Experiencia</a>
          <a href="#contacto" onClick={() => setMobileMenu(false)}>Contacto</a>
          <button className="home-navbar__reserve" type="button" onClick={() => navigate("/reservar")}>Reservar</button>
        </div>
      </nav>

      <header id="inicio" className="home-hero">
        <div className="home-hero__content">
          <span className="eyebrow">HOTEL ROLEX · SUCRE</span>
          <h1>Tu descanso empieza <em>aquí.</em></h1>
          <p>Un espacio pensado para que disfrutes cada momento de tu estancia con comodidad, tranquilidad y atención cercana.</p>
          <div className="hero-actions"><button type="button" onClick={() => navigate("/habitaciones")}>Explorar habitaciones <span>→</span></button><a href="#experiencia">Conocer el hotel</a></div>
          <div className="hero-trust"><span>★ 4.9</span><span>•</span><span>10 habitaciones</span><span>•</span><span>Atención personalizada</span></div>
        </div>
        <div className="home-hero__visual">
          <img src={roomInventory.find((room) => room.type === "Suite Premium")?.image} alt="Suite Premium de Hotel Rolex" />
          <div className="hero-floating-card"><span>DESDE</span><strong>$55</strong><small>por noche</small></div>
          <div className="hero-floating-label">Suite Premium<br /><small>La experiencia Rolex</small></div>
        </div>
      </header>

      <section className="home-stats" aria-label="Información del hotel"><div><strong>10</strong><span>Habitaciones</span></div><div><strong>3</strong><span>Tipos de habitación</span></div><div><strong>6</strong><span>Huéspedes máx.</span></div><div><strong>24/7</strong><span>Atención</span></div></section>

      {user && <section className="welcome-strip"><div><span>SESION ACTIVA</span><strong>Bienvenido/a, {user.name}</strong><small>Rol: {user.role} · Carnet: {user.carnet}</small></div><button type="button" onClick={handleLogout}>Cerrar sesión</button></section>}

      <section id="habitaciones" className="home-section rooms-preview">
        <div className="section-heading"><div><span>DESCUBRE TU ESPACIO</span><h2>Habitaciones para cada estancia</h2></div><button type="button" onClick={() => navigate("/habitaciones")}>Ver inventario completo →</button></div>
        <div className="featured-grid">
          {[
            { type: "Estándar", label: "Esencial", description: "Comodidad y practicidad para una estancia tranquila.", price: 55 },
            { type: "Familiar", label: "Espaciosa", description: "Más espacio para compartir momentos especiales.", price: 95 },
            { type: "Suite Premium", label: "Exclusiva", description: "Una experiencia superior con área de descanso.", price: 145 },
          ].map((item) => {
            const room = roomInventory.find((entry) => entry.type === item.type);
            return <article className="featured-room" key={item.type}><div className="featured-room__image"><img src={room?.image} alt={item.type} /><span>{item.label}</span></div><div className="featured-room__body"><small>HASTA {room?.capacity} HUÉSPEDES</small><h3>{item.type}</h3><p>{item.description}</p><div><strong>${item.price}</strong><span>/ noche</span><button type="button" onClick={() => navigate(`/reservar?room=${room?.number || ""}`)}>Reservar →</button></div></div></article>;
          })}
        </div>
      </section>

      <section id="servicios" className="home-section services-section"><div className="section-heading centered"><span>TODO LO QUE NECESITAS</span><h2>Servicios pensados para ti</h2><p>Pequeños detalles que hacen que una estancia se sienta especial.</p></div><div className="services-grid"><article><span>01</span><div><h3>Wi-Fi incluido</h3><p>Conexión para mantenerte comunicado durante tu estancia.</p></div></article><article><span>02</span><div><h3>Baño privado</h3><p>Espacios cómodos y preparados para tu descanso.</p></div></article><article><span>03</span><div><h3>Aire acondicionado</h3><p>Ambiente agradable para disfrutar en cualquier momento.</p></div></article><article><span>04</span><div><h3>Atención cercana</h3><p>Estamos aquí para ayudarte antes y durante tu visita.</p></div></article><article><span>05</span><div><h3>Minibar</h3><p>Disponible en nuestras habitaciones familiares y suites.</p></div></article><article><span>06</span><div><h3>Reserva sencilla</h3><p>Consulta disponibilidad y confirma en pocos pasos.</p></div></article></div></section>

      <section id="experiencia" className="home-experience"><div className="experience-image"><img src={roomInventory[4].image} alt="Habitación Familiar" /></div><div className="experience-content"><span>LA EXPERIENCIA ROLEX</span><h2>Un lugar para bajar el ritmo y disfrutar.</h2><p>Desde una habitación práctica hasta una suite amplia, nuestro objetivo es ofrecerte una experiencia sencilla, cómoda y memorable.</p><div className="experience-points"><span>✓ Espacios cómodos</span><span>✓ Ubicación pensada para descansar</span><span>✓ Reservas rápidas y claras</span><span>✓ Información de disponibilidad</span></div><button type="button" onClick={() => navigate("/habitaciones")}>Conocer todas las habitaciones →</button></div></section>

      <section id="reservar" className="home-section booking-section"><div className="section-heading centered"><span>RESERVA TU ESTANCIA</span><h2>Encuentra disponibilidad</h2><p>Indica tus fechas y nosotros te mostramos las habitaciones que puedes reservar.</p></div><form className="booking-form" onSubmit={handleSearch}><label><span>Entrada</span><input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required /></label><label><span>Salida</span><input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required /></label><label><span>Huéspedes</span><select value={guests} onChange={(e) => setGuests(e.target.value)}>{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "persona" : "personas"}</option>)}</select></label><button type="submit">Buscar habitaciones <span>→</span></button></form><div className="booking-message">{hasSearched && availableRooms.length > 0 ? <><p>{searchMessage}</p><div className="booking-results">{availableRooms.slice(0, 3).map((room) => <button type="button" key={room.number} onClick={() => navigate(`/reservar?room=${room.number}`)}><span>#{room.number}</span><strong>{room.type}</strong><small>${room.price}/noche · hasta {room.capacity}</small><b>Reservar →</b></button>)}</div></> : <p>{searchMessage}</p>}</div></section>

      <section className="home-quick-info"><div><span>ESTADO ACTUAL</span><strong>{availableCount} habitaciones disponibles</strong><small>{occupiedCount} ocupadas · {roomInventory.length - availableCount - occupiedCount} en mantenimiento</small></div><div><span>RESERVAS</span><strong>{reservationCount} registrada{reservationCount === 1 ? "" : "s"}</strong><small>Guardadas localmente en este navegador</small></div><button type="button" onClick={() => navigate("/habitaciones")}>Ver sistema completo →</button></section>

      <section id="contacto" className="home-contact"><div><span>¿NECESITAS AYUDA?</span><h2>Estamos para ayudarte.</h2><p>Si tienes dudas sobre habitaciones, disponibilidad o reservas, puedes consultar el sistema del hotel.</p></div><div className="contact-cards"><div><small>HORARIO</small><strong>Atención 24/7</strong></div><div><small>RESERVAS</small><strong>Online · Siempre disponible</strong></div><div><small>UBICACIÓN</small><strong>Sucre, Bolivia</strong></div></div></section>

      <footer className="home-footer"><div><strong>Hotel Rolex</strong><p>Hospitalidad, comodidad y una estancia inolvidable.</p></div><div><span>Explora</span><button type="button" onClick={() => navigate("/habitaciones")}>Habitaciones</button><button type="button" onClick={() => navigate("/reservar")}>Reservar</button></div><div><span>Sistema</span><small>Inventario · Disponibilidad · Reservas</small></div><div><span>© 2026 Hotel Rolex</span><small>Proyecto de sistema de reservas</small></div></footer>
    </main>
  );
}

export default HomePage;
