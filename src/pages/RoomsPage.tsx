import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservations, hasReservationConflict, roomInventory } from "../data/rooms";
import "./RoomsPage.css";

function RoomsPage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [type, setType] = useState("Todos");
  const [searched, setSearched] = useState(false);

  const availableRooms = useMemo(() => {
    return roomInventory.filter((room) => {
      if (room.status !== "Disponible") return false;
      if (type !== "Todos" && room.type !== type) return false;
      if (guests > room.capacity) return false;
      if (!checkIn || !checkOut) return true;
      if (checkIn < room.availableFrom || checkOut > room.availableTo || checkOut <= checkIn) return false;
      return !hasReservationConflict(room.number, checkIn, checkOut);
    });
  }, [checkIn, checkOut, guests, type]);

  const reservations = getReservations();
  const occupied = roomInventory.filter((room) => room.status === "Ocupada").length;
  const maintenance = roomInventory.filter((room) => room.status === "Mantenimiento").length;

  return (
    <main className="rooms-page">
      <nav className="rooms-navbar">
        <button className="rooms-brand" onClick={() => navigate("/")}>Hotel Rolex</button>
        <div className="rooms-navbar__links">
          <button onClick={() => navigate("/")}>Inicio</button>
          <button className="active">Habitaciones</button>
          <button onClick={() => navigate("/#servicios")}>Servicios</button>
          <button onClick={() => navigate("/#galeria")}>Galería</button>
          <button onClick={() => navigate("/#contacto")}>Contacto</button>
          <button className="reserve" onClick={() => navigate("/reservar")}>Reservar</button>
        </div>
      </nav>

      <header className="rooms-hero"><span>GESTIÓN HOTELERA</span><h1>Habitaciones</h1><p>Consulta y reserva habitaciones según tus fechas y cantidad de huéspedes.</p></header>

      <section className="rooms-content">
        <div className="rooms-summary">
          <div><strong>{roomInventory.length}</strong><span>Total de habitaciones</span></div>
          <div><strong>{roomInventory.length - occupied - maintenance}</strong><span>Disponibles</span></div>
          <div><strong>{occupied}</strong><span>Ocupadas</span></div>
          <div><strong>{maintenance}</strong><span>Mantenimiento</span></div>
        </div>

        <section className="availability-box">
          <div><span>BUSCAR DISPONIBILIDAD</span><h2>¿Cuándo quieres hospedarte?</h2></div>
          <div className="availability-form">
            <label>Entrada<input type="date" value={checkIn} min={new Date().toISOString().slice(0,10)} onChange={(e) => setCheckIn(e.target.value)} /></label>
            <label>Salida<input type="date" value={checkOut} min={checkIn || new Date().toISOString().slice(0,10)} onChange={(e) => setCheckOut(e.target.value)} /></label>
            <label>Huéspedes<input type="number" min="1" max="6" value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></label>
            <label>Tipo<select value={type} onChange={(e) => setType(e.target.value)}><option>Todos</option><option>Estándar</option><option>Familiar</option><option>Suite Premium</option></select></label>
            <button onClick={() => setSearched(true)}>Buscar habitaciones</button>
          </div>
          {searched && <p className="search-result">{availableRooms.length} habitación(es) disponible(s) para tu búsqueda.</p>}
        </section>

        <section className="room-types"><h2>Tipos de habitación</h2><div className="type-grid"><article><h3>Estándar</h3><p>2 huéspedes · desde $55/noche</p></article><article><h3>Familiar</h3><p>4 huéspedes · desde $95/noche</p></article><article><h3>Suite Premium</h3><p>6 huéspedes · desde $145/noche</p></article></div></section>

        <section className="rooms-list">
          <div className="section-heading"><div><h2>{searched ? "Habitaciones disponibles" : "Inventario de habitaciones"}</h2><p>{searched ? "Selecciona una habitación para continuar con la reserva." : "Información completa de las habitaciones del hotel."}</p></div></div>
          <div className="room-detail-grid">
            {(searched ? availableRooms : roomInventory).map((room) => (
              <article className="room-detail-card" key={room.number}>
                <img src={room.image} alt={`Habitación ${room.number} - ${room.type}`} />
                <div className="room-detail-card__body">
                  <div className="room-card-top"><span className={`status status-${room.status.toLowerCase().replace(" ", "-")}`}>{room.status}</span><strong>Habitación {room.number}</strong></div>
                  <h3>{room.type}</h3><p>{room.description}</p>
                  <div className="room-data"><span><b>Capacidad:</b> {room.capacity} huéspedes</span><span><b>Camas:</b> {room.beds}</span><span><b>Piso:</b> {room.floor}</span><span><b>Precio:</b> ${room.price} / noche</span><span><b>Disponible desde:</b> {room.availableFrom}</span><span><b>Disponible hasta:</b> {room.availableTo}</span></div>
                  <div className="amenities"><b>Servicios:</b> {room.amenities.map((item) => <span key={item}>{item}</span>)}</div>
                  <button className="room-reserve-button" disabled={room.status !== "Disponible"} onClick={() => navigate(`/reservar?room=${room.number}`)}>{room.status === "Disponible" ? "Reservar esta habitación" : "No disponible"}</button>
                </div>
              </article>
            ))}
          </div>
          {searched && availableRooms.length === 0 && <div className="empty-results">No encontramos habitaciones disponibles con esos criterios. Prueba otras fechas o una capacidad diferente.</div>}
        </section>

        <section className="reservation-info"><h2>Reservas realizadas en este dispositivo</h2><p>Reservas guardadas: <b>{reservations.length}</b>. Al confirmar una reserva, esas fechas dejan de aparecer como disponibles para esa habitación.</p></section>
      </section>
    </main>
  );
}

export default RoomsPage;
