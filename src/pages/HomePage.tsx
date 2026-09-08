import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { getReservations, hasReservationConflict, roomInventory } from "../data/rooms";
import "./HomePage.css";

const today = new Date().toISOString().slice(0, 10);

function HomePage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("Selecciona fechas para consultar disponibilidad.");

  const results = useMemo(() => {
    if (!searched || !checkIn || !checkOut || checkOut <= checkIn) return [];
    return roomInventory.filter((room) => room.status === "Disponible" && room.capacity >= Number(guests) && checkIn >= room.availableFrom && checkOut <= room.availableTo && !hasReservationConflict(room.number, checkIn, checkOut));
  }, [checkIn, checkOut, guests, searched]);

  const available = roomInventory.filter((room) => room.status === "Disponible").length;
  const reservations = getReservations().length;

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
    if (!checkIn || !checkOut) return setMessage("Completa ambas fechas para realizar la búsqueda.");
    if (checkOut <= checkIn) return setMessage("La salida debe ser posterior a la entrada.");
    if (checkIn < today) return setMessage("La fecha de entrada no puede ser anterior a hoy.");
    const count = roomInventory.filter((room) => room.status === "Disponible" && room.capacity >= Number(guests) && checkIn >= room.availableFrom && checkOut <= room.availableTo && !hasReservationConflict(room.number, checkIn, checkOut)).length;
    setMessage(count ? `${count} habitación${count === 1 ? "" : "es"} disponible${count === 1 ? "" : "s"}.` : "No hay habitaciones disponibles para esas fechas.");
  };

  return <main className="home-page"><HotelNavbar /><header className="home-hero"><div className="home-hero__copy"><span>HOTEL ROLEX · SUCRE · BOLIVIA</span><h1>Una estancia con <em>estándar profesional.</em></h1><p>Consulta nuestro inventario, revisa servicios, explora la galería y realiza tu reserva desde un sistema claro y organizado.</p><div className="home-hero__actions"><button type="button" onClick={() => navigate("/habitaciones")}>Explorar habitaciones →</button><button type="button" className="ghost" onClick={() => navigate("/galeria")}>Ver galería</button></div><div className="home-metrics"><div><strong>10</strong><span>habitaciones</span></div><div><strong>3</strong><span>categorías</span></div><div><strong>24/7</strong><span>atención</span></div></div></div><div className="home-hero__card"><div className="home-hero__image"><img src={roomInventory[8].image} alt="Suite Premium Hotel Rolex" /></div><div className="home-hero__cardbody"><span>DESTACADA</span><h2>Suite Premium</h2><p>Hasta 6 huéspedes · desde <b>$145</b>/noche</p><button type="button" onClick={() => navigate("/reservar?room=301")}>Reservar esta suite →</button></div></div></header><section className="home-search"><div><span>DISPONIBILIDAD</span><h2>Planifica tu estancia</h2><p>Consulta fechas y encuentra una habitación disponible.</p></div><form onSubmit={search}><label>Entrada<input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required /></label><label>Salida<input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required /></label><label>Huéspedes<select value={guests} onChange={(e) => setGuests(e.target.value)}>{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>)}</select></label><button type="submit">Consultar</button></form><div className="home-search__result"><p>{message}</p>{searched && results.length > 0 && <div>{results.slice(0,3).map((room) => <button type="button" key={room.number} onClick={() => navigate(`/reservar?room=${room.number}`)}>#{room.number} · {room.type} · ${room.price}/noche →</button>)}</div>}</div></section><section className="home-overview"><div><span>EXPERIENCIA ROLEX</span><h2>Todo separado. Todo más fácil de consultar.</h2><p>En lugar de concentrar toda la información en una sola página, cada área del hotel tiene su propio espacio: habitaciones, servicios, galería, contacto y reservas.</p></div><div className="home-overview__cards"><button type="button" onClick={() => navigate("/habitaciones")}><strong>01</strong><b>Habitaciones</b><small>Inventario y disponibilidad</small></button><button type="button" onClick={() => navigate("/servicios")}><strong>02</strong><b>Servicios</b><small>Consulta cada servicio</small></button><button type="button" onClick={() => navigate("/galeria")}><strong>03</strong><b>Galería</b><small>Explora y amplía imágenes</small></button><button type="button" onClick={() => navigate("/contacto")}><strong>04</strong><b>Contacto</b><small>Envía una consulta</small></button></div></section><section className="home-status"><div><span>ESTADO DEL SISTEMA</span><h2>Información en tiempo real del navegador.</h2><p><b>{available}</b> habitaciones disponibles ahora · <b>{reservations}</b> reservas registradas localmente.</p></div><button type="button" onClick={() => navigate("/reservar")}>Nueva reserva →</button></section><HotelFooter /></main>;
}

export default HomePage;
