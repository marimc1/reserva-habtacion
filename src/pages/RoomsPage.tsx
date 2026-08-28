import { Link } from "react-router-dom";
import { rooms } from "../data/rooms";
import "./RoomsPage.css";

const totalHotelRooms = rooms.reduce((total, room) => total + room.totalRooms, 0);
const maxCapacity = rooms.reduce((total, room) => total + room.capacity * room.totalRooms, 0);

function RoomsPage() {
  return (
    <main className="rooms-page">
      <nav className="rooms-navbar" aria-label="Navegación del módulo de habitaciones">
        <Link className="rooms-navbar__brand" to="/">Hotel Rolex</Link>
        <div className="rooms-navbar__links">
          <Link to="/">Inicio</Link>
          <a href="#catalogo">Catálogo</a>
          <a href="#disponibilidad">Disponibilidad</a>
          <a href="#reservas">Reservas</a>
        </div>
      </nav>

      <header className="rooms-hero">
        <p className="rooms-hero__eyebrow">Sistema de habitaciones</p>
        <h1>Información completa de habitaciones, disponibilidad y reservas.</h1>
        <p>
          Consulta tipos de habitación, capacidad, inventario total del hotel,
          equipamiento, políticas, fechas disponibles y datos importantes antes de reservar.
        </p>
      </header>

      <section className="rooms-dashboard" aria-label="Resumen del hotel">
        <article><span>{rooms.length}</span><p>Tipos de habitaciones</p></article>
        <article><span>{totalHotelRooms}</span><p>Habitaciones en el hotel</p></article>
        <article><span>{maxCapacity}</span><p>Capacidad máxima simultánea</p></article>
      </section>

      <section id="catalogo" className="rooms-section">
        <div className="rooms-section__header">
          <p>Catálogo</p>
          <h2>Tipos de habitaciones</h2>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <article className="room-detail-card" key={room.id}>
              <img src={room.image} alt={`Vista de ${room.name}`} />
              <div className="room-detail-card__content">
                <div className="room-detail-card__title">
                  <h3>{room.name}</h3>
                  <strong>${room.pricePerNight} / noche</strong>
                </div>
                <p>{room.description}</p>

                <dl className="room-specs">
                  <div><dt>Capacidad</dt><dd>Hasta {room.capacity} huéspedes</dd></div>
                  <div><dt>Cantidad</dt><dd>{room.totalRooms} habitaciones</dd></div>
                  <div><dt>Números</dt><dd>{room.roomNumbers.join(", ")} y similares</dd></div>
                  <div><dt>Camas</dt><dd>{room.bedConfiguration}</dd></div>
                  <div><dt>Tamaño</dt><dd>{room.size}</dd></div>
                </dl>

                <div className="room-tags" aria-label="Amenidades">
                  {room.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="disponibilidad" className="rooms-section">
        <div className="rooms-section__header">
          <p>Calendario</p>
          <h2>Días disponibles y ocupados</h2>
        </div>
        <div className="availability-grid">
          {rooms.map((room) => (
            <article className="availability-card" key={room.id}>
              <h3>{room.name}</h3>
              <h4>Disponible</h4>
              <ul>{room.availableRanges.map((range) => <li key={`${range.from}-${range.to}`}>{range.from} al {range.to}</li>)}</ul>
              <h4>No disponible</h4>
              <ul>{room.unavailableDates.map((range) => <li key={`${range.from}-${range.to}`}>{range.from} al {range.to}: {range.reason}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section id="reservas" className="rooms-section reservation-info-section">
        <div className="rooms-section__header">
          <p>Reservas</p>
          <h2>Información necesaria para reservar</h2>
        </div>
        <div className="reservation-info-grid">
          {rooms.map((room) => (
            <article key={room.id}>
              <h3>{room.name}</h3>
              <ul>
                {room.reservationInfo.map((item) => <li key={item}>{item}</li>)}
                {room.policies.map((policy) => <li key={policy}>{policy}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <Link className="rooms-cta" to="/#reservar">Buscar fechas para reservar</Link>
      </section>
    </main>
  );
}

export default RoomsPage;
