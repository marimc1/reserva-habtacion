import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservations, hasReservationConflict, roomInventory } from "../data/rooms";
import "./RoomsPage.css";

const today = new Date().toISOString().slice(0, 10);

function RoomsPage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [type, setType] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [searched, setSearched] = useState(false);

  const reservations = getReservations();
  const occupied = roomInventory.filter((room) => room.status === "Ocupada").length;
  const maintenance = roomInventory.filter((room) => room.status === "Mantenimiento").length;
  const staticAvailable = roomInventory.filter((room) => room.status === "Disponible").length;

  const filteredRooms = useMemo(() => {
    return roomInventory.filter((room) => {
      if (type !== "Todos" && room.type !== type) return false;
      if (status !== "Todos" && room.status !== status) return false;
      if (searched) {
        if (room.status !== "Disponible") return false;
        if (guests > room.capacity) return false;
        if (!checkIn || !checkOut || checkOut <= checkIn) return false;
        if (checkIn < room.availableFrom || checkOut > room.availableTo) return false;
        if (hasReservationConflict(room.number, checkIn, checkOut)) return false;
      }
      return true;
    });
  }, [checkIn, checkOut, guests, type, status, searched]);

  const resetSearch = () => {
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setType("Todos");
    setStatus("Todos");
    setSearched(false);
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      setSearched(false);
      return;
    }
    setSearched(true);
  };

  const getAvailabilityText = (roomNumber: string) => {
    const room = roomInventory.find((item) => item.number === roomNumber);
    if (!room) return "";
    const roomReservations = reservations
      .filter((reservation) => reservation.roomNumber === roomNumber && reservation.checkOut >= today)
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    if (roomReservations.length > 0) {
      return `Próxima reserva: ${roomReservations[0].checkIn}`;
    }
    return `Disponible hasta ${room.availableTo}`;
  };

  return (
    <main className="rooms-page">
      <nav className="rooms-navbar">
        <button className="rooms-brand" type="button" onClick={() => navigate("/")}>Hotel Rolex</button>
        <div className="rooms-navbar__links">
          <button type="button" onClick={() => navigate("/")}>Inicio</button>
          <button type="button" className="active">Habitaciones</button>
          <button type="button" onClick={() => navigate("/#servicios")}>Servicios</button>
          <button type="button" onClick={() => navigate("/#galeria")}>Galería</button>
          <button type="button" onClick={() => navigate("/#contacto")}>Contacto</button>
          <button type="button" className="reserve" onClick={() => navigate("/reservar")}>Reservar</button>
        </div>
      </nav>

      <header className="rooms-hero">
        <div className="rooms-hero__content">
          <span>HOTEL ROLEX · GESTIÓN HOTELERA</span>
          <h1>Encuentra tu habitación ideal.</h1>
          <p>Consulta el inventario, revisa características y comprueba la disponibilidad antes de realizar tu reserva.</p>
          <div className="hero-actions">
            <button type="button" onClick={() => document.getElementById("disponibilidad")?.scrollIntoView({ behavior: "smooth" })}>Consultar disponibilidad</button>
            <button type="button" className="secondary" onClick={() => navigate("/reservar")}>Ir a reservar</button>
          </div>
        </div>
        <div className="rooms-hero__badge"><strong>{roomInventory.length}</strong><span>habitaciones<br />en inventario</span></div>
      </header>

      <section className="rooms-content">
        <div className="rooms-summary">
          <div className="summary-card"><span className="summary-icon">▦</span><strong>{roomInventory.length}</strong><span>Total de habitaciones</span></div>
          <div className="summary-card"><span className="summary-icon">✓</span><strong>{staticAvailable}</strong><span>Disponibles</span></div>
          <div className="summary-card"><span className="summary-icon">◷</span><strong>{occupied}</strong><span>Ocupadas</span></div>
          <div className="summary-card"><span className="summary-icon">⚙</span><strong>{maintenance}</strong><span>En mantenimiento</span></div>
        </div>

        <section className="availability-box" id="disponibilidad">
          <div className="availability-heading">
            <div><span>BUSCADOR INTELIGENTE</span><h2>Comprueba disponibilidad</h2></div>
            {searched && <button type="button" className="clear-search" onClick={resetSearch}>Limpiar búsqueda</button>}
          </div>
          <div className="availability-form">
            <label>Entrada<input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} /></label>
            <label>Salida<input type="date" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} /></label>
            <label>Huéspedes<input type="number" min="1" max="6" value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))} /></label>
            <label>Tipo<select value={type} onChange={(e) => setType(e.target.value)}><option>Todos</option><option>Estándar</option><option>Familiar</option><option>Suite Premium</option></select></label>
            <button type="button" onClick={handleSearch}>Buscar habitaciones</button>
          </div>
          {searched ? (
            <p className="search-result"><strong>{filteredRooms.length}</strong> habitación(es) cumplen tus criterios de búsqueda.</p>
          ) : (
            <p className="search-hint">Selecciona fechas y huéspedes para obtener resultados personalizados.</p>
          )}
        </section>

        <section className="room-types">
          <div className="section-title"><span>NUESTRAS OPCIONES</span><h2>Tipos de habitación</h2><p>Elige el espacio que mejor se adapte a tu estancia.</p></div>
          <div className="type-grid">
            <article><div className="type-number">01</div><h3>Estándar</h3><p>Confort esencial para hasta 2 huéspedes.</p><strong>Desde $55 <small>/ noche</small></strong></article>
            <article><div className="type-number">02</div><h3>Familiar</h3><p>Más espacio para familias de hasta 4 huéspedes.</p><strong>Desde $95 <small>/ noche</small></strong></article>
            <article><div className="type-number">03</div><h3>Suite Premium</h3><p>Una experiencia amplia para hasta 6 huéspedes.</p><strong>Desde $145 <small>/ noche</small></strong></article>
          </div>
        </section>

        <section className="rooms-list">
          <div className="section-heading">
            <div><span>{searched ? "RESULTADOS" : "INVENTARIO"}</span><h2>{searched ? "Habitaciones disponibles" : "Todas las habitaciones"}</h2><p>{searched ? "Estas habitaciones pueden reservarse para las fechas seleccionadas." : "Información detallada del inventario actual del Hotel Rolex."}</p></div>
            <div className="room-filters"><label>Filtrar estado<select value={status} onChange={(e) => setStatus(e.target.value)}><option>Todos</option><option>Disponible</option><option>Ocupada</option><option>Mantenimiento</option></select></label></div>
          </div>

          <div className="room-detail-grid">
            {filteredRooms.map((room) => (
              <article className="room-detail-card" key={room.number}>
                <div className="room-image-wrap"><img src={room.image} alt={`Habitación ${room.number} - ${room.type}`} /><span className={`status status-${room.status.toLowerCase().replace(" ", "-")}`}>{room.status}</span><span className="room-number">#{room.number}</span></div>
                <div className="room-detail-card__body">
                  <div className="room-card-top"><span>{room.type}</span><strong>${room.price}<small> / noche</small></strong></div>
                  <h3>{room.beds}</h3>
                  <p>{room.description}</p>
                  <div className="room-data"><span><b>Capacidad</b>{room.capacity} huéspedes</span><span><b>Piso</b>{room.floor}° piso</span><span><b>Disponible desde</b>{room.availableFrom}</span><span><b>Disponible hasta</b>{room.availableTo}</span></div>
                  <div className="amenities">{room.amenities.map((item) => <span key={item}>✓ {item}</span>)}</div>
                  <div className="room-card-footer"><small>{getAvailabilityText(room.number)}</small><button className="room-reserve-button" type="button" disabled={room.status !== "Disponible"} onClick={() => navigate(`/reservar?room=${room.number}`)}>{room.status === "Disponible" ? "Reservar habitación →" : room.status}</button></div>
                </div>
              </article>
            ))}
          </div>
          {filteredRooms.length === 0 && <div className="empty-results"><strong>No encontramos habitaciones</strong><span>Prueba otras fechas, cantidad de huéspedes o filtros.</span><button type="button" onClick={resetSearch}>Restablecer filtros</button></div>}
        </section>

        <section className="reservation-info">
          <div><span>RESERVAS LOCALES</span><h2>Tu información queda guardada en este navegador.</h2><p>Reservas registradas: <b>{reservations.length}</b>. El sistema comprueba conflictos de fechas para evitar reservar la misma habitación dos veces.</p></div>
          <button type="button" onClick={() => navigate("/reservar")}>Crear una reserva →</button>
        </section>
      </section>

      <footer className="rooms-footer"><strong>Hotel Rolex</strong><span>Hospitalidad, comodidad y una estancia inolvidable.</span><button type="button" onClick={() => navigate("/")}>Volver al inicio</button></footer>
    </main>
  );
}

export default RoomsPage;
