import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import standardRoomImage from "../assets/home/habitacion-estandar.svg";
import familyRoomImage from "../assets/home/habitacion-familiar.svg";
import suiteRoomImage from "../assets/home/habitacion-suite.svg";
import "./HomePage.css";

type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  image: string;
  unavailableDates: Array<{ from: string; to: string }>;
};

const rooms: Room[] = [
  { id: "standard", name: "Habitación Estándar", description: "Cómoda habitación para viajes cortos, con cama doble, baño privado y ambiente cálido para descansar.", pricePerNight: 55, capacity: 2, image: standardRoomImage, unavailableDates: [{ from: "2026-09-05", to: "2026-09-08" }] },
  { id: "family", name: "Habitación Familiar", description: "Espacio amplio con dos camas, ideal para familias o grupos que buscan comodidad durante su estancia.", pricePerNight: 95, capacity: 4, image: familyRoomImage, unavailableDates: [{ from: "2026-09-12", to: "2026-09-14" }] },
  { id: "suite", name: "Suite Premium", description: "Suite elegante con cama king, sala de descanso y detalles exclusivos para una experiencia superior.", pricePerNight: 145, capacity: 6, image: suiteRoomImage, unavailableDates: [{ from: "2026-10-01", to: "2026-10-04" }] },
];

const datesOverlap = (start: string, end: string, bookedStart: string, bookedEnd: string) => start < bookedEnd && end > bookedStart;

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [searchMessage, setSearchMessage] = useState("Completa los datos y pulsa Buscar para ver habitaciones disponibles.");
  const [hasSearched, setHasSearched] = useState(false);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleRoomSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
    if (!checkIn || !checkOut) {
      setAvailableRooms([]);
      setSearchMessage("Marca la fecha de check-in y check-out para buscar habitaciones.");
      return;
    }
    if (checkOut <= checkIn) {
      setAvailableRooms([]);
      setSearchMessage("La fecha de check-out debe ser posterior al check-in.");
      return;
    }
    const requestedGuests = Number(guests);
    const matchingRooms = rooms.filter((room) => room.capacity >= requestedGuests && !room.unavailableDates.some((range) => datesOverlap(checkIn, checkOut, range.from, range.to)));
    setAvailableRooms(matchingRooms);
    setSearchMessage(matchingRooms.length > 0 ? `${matchingRooms.length} habitación${matchingRooms.length === 1 ? "" : "es"} disponible${matchingRooms.length === 1 ? "" : "s"} para tu solicitud.` : "No hay habitaciones disponibles con esas fechas y cantidad de huéspedes.");
  };

  return (
    <main className="home-page">
      <nav className="home-navbar" aria-label="Navegación principal">
        <button className="home-navbar__brand" type="button" onClick={() => navigate("/")}>Hotel Rolex</button>
        <ul className="home-navbar__menu">
          <li><button className="home-navbar__link" type="button" onClick={() => navigate("/#inicio")}>Inicio</button></li>
          <li><button className="home-navbar__link" type="button" onClick={() => navigate("/habitaciones")}>Habitaciones</button></li>
          <li><button className="home-navbar__link" type="button" onClick={() => navigate("/#servicios")}>Servicios</button></li>
          <li><button className="home-navbar__link" type="button" onClick={() => navigate("/#galeria")}>Galería</button></li>
          <li><button className="home-navbar__link" type="button" onClick={() => navigate("/#contacto")}>Contacto</button></li>
          <li><button className="home-navbar__link home-navbar__reserve" type="button" onClick={() => navigate("/#reservar")}>Reservar</button></li>
        </ul>
      </nav>

      <header id="inicio" className="home-header">
        <div className="home-header__content">
          <p className="home-header__eyebrow">Bienvenido a Hotel Rolex</p>
          <h1>Descansa y disfruta tu estancia.</h1>
          <button className="home-header__button" type="button" onClick={() => navigate("/#reservar")}>Reservar ahora</button>
        </div>
        <div className="home-header__image-placeholder" aria-label="Espacio reservado para imagen principal del hotel"><span>Imagen del hotel</span></div>
      </header>

      <section className="home-page__content">
        <h2>Página principal</h2>
        {user ? <><p>Bienvenido, {user.name}</p><p>Carnet: {user.carnet}</p><p>Rol: {user.role}</p><button type="button" onClick={handleLogout}>Cerrar sesión</button></> : <p>No existe una sesión activa.</p>}
      </section>

      <section id="habitaciones" className="home-section">
        <h2>Habitaciones</h2>
        <p>Conoce nuestro inventario completo, disponibilidad, características y reservas.</p>
        <button type="button" onClick={() => navigate("/habitaciones")}>Ver todas las habitaciones</button>
      </section>

      <section id="servicios" className="home-section"><h2>Servicios</h2><p>Disfruta de los servicios que Hotel Rolex tiene preparados para ti.</p></section>
      <section id="galeria" className="home-section"><h2>Galería</h2><p>Conoce nuestras instalaciones.</p></section>

      <section id="reservar" className="home-section home-reservation">
        <div className="home-reservation__intro"><h2>Reservar habitación</h2><p>Selecciona tus fechas, indica cuántos huéspedes se quedarán y encuentra la mejor habitación disponible.</p></div>
        <form className="reservation-search" aria-label="Buscar habitación" onSubmit={handleRoomSearch}>
          <label className="reservation-search__field" htmlFor="check-in"><span>Check-in</span><input id="check-in" name="check-in" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required /></label>
          <label className="reservation-search__field" htmlFor="check-out"><span>Check-out</span><input id="check-out" name="check-out" type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} required /></label>
          <label className="reservation-search__field" htmlFor="guests"><span>Huéspedes</span><select id="guests" name="guests" value={guests} onChange={(event) => setGuests(event.target.value)}><option value="1">1 persona</option><option value="2">2 personas</option><option value="3">3 personas</option><option value="4">4 personas</option><option value="5">5 personas</option><option value="6">6 personas</option></select></label>
          <button className="reservation-search__button" type="submit">Buscar</button>
        </form>
        <div className="reservation-results" aria-live="polite"><p className="reservation-results__message">{searchMessage}</p>{hasSearched && availableRooms.length > 0 && <div className="room-cards">{availableRooms.map((room) => <article className="room-card" key={room.id}><div className="room-card__image-column"><img src={room.image} alt={`Imagen de ${room.name}`} /><strong>${room.pricePerNight} / noche</strong></div><div className="room-card__content"><span>Hasta {room.capacity} huéspedes</span><h3>{room.name}</h3><p>{room.description}</p><button className="room-card__button" type="button" onClick={() => navigate("/habitaciones")}>Ver detalles</button></div></article>)}</div>}</div>
      </section>

      <section id="contacto" className="home-section"><h2>Contacto</h2><p>Estamos disponibles para ayudarte con tu reserva.</p></section>
    </main>
  );
}

export default HomePage;
