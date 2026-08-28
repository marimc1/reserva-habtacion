import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import standardRoomImage from "../assets/home/habitacion-estandar.svg";
import familyRoomImage from "../assets/home/habitacion-familiar.svg";
import suiteRoomImage from "../assets/home/habitacion-suite.svg";
import "./RoomsPage.css";

type RoomStatus = "Disponible" | "Ocupada" | "Mantenimiento";

type Room = {
  number: string;
  type: string;
  description: string;
  capacity: number;
  beds: string;
  price: number;
  floor: number;
  size: string;
  amenities: string[];
  status: RoomStatus;
  image: string;
  availableFrom: string;
  availableTo: string;
};

const rooms: Room[] = [
  {
    number: "101",
    type: "Estándar",
    description: "Habitación cómoda para parejas o viajeros que buscan una estancia práctica y agradable.",
    capacity: 2,
    beds: "1 cama doble",
    price: 55,
    floor: 1,
    size: "22 m²",
    amenities: ["Wi-Fi", "Baño privado", "TV", "Aire acondicionado", "Escritorio"],
    status: "Disponible",
    image: standardRoomImage,
    availableFrom: "2026-08-29",
    availableTo: "2026-09-05",
  },
  {
    number: "102",
    type: "Estándar",
    description: "Habitación funcional con todas las comodidades esenciales para una estancia tranquila.",
    capacity: 2,
    beds: "1 cama doble",
    price: 55,
    floor: 1,
    size: "22 m²",
    amenities: ["Wi-Fi", "Baño privado", "TV", "Aire acondicionado", "Escritorio"],
    status: "Ocupada",
    image: standardRoomImage,
    availableFrom: "2026-09-08",
    availableTo: "2026-09-12",
  },
  {
    number: "201",
    type: "Familiar",
    description: "Espacio amplio pensado para familias o grupos pequeños que necesitan mayor capacidad.",
    capacity: 4,
    beds: "2 camas dobles",
    price: 95,
    floor: 2,
    size: "35 m²",
    amenities: ["Wi-Fi", "Baño privado", "TV", "Aire acondicionado", "Mini nevera", "Armario"],
    status: "Disponible",
    image: familyRoomImage,
    availableFrom: "2026-08-29",
    availableTo: "2026-09-12",
  },
  {
    number: "202",
    type: "Familiar",
    description: "Habitación familiar amplia con espacio adicional para descansar y organizar el equipaje.",
    capacity: 4,
    beds: "2 camas dobles",
    price: 95,
    floor: 2,
    size: "35 m²",
    amenities: ["Wi-Fi", "Baño privado", "TV", "Aire acondicionado", "Mini nevera", "Armario"],
    status: "Mantenimiento",
    image: familyRoomImage,
    availableFrom: "2026-09-15",
    availableTo: "2026-10-01",
  },
  {
    number: "301",
    type: "Suite Premium",
    description: "Suite de mayor categoría con zona de descanso independiente y servicios exclusivos.",
    capacity: 6,
    beds: "1 cama king + sofá cama",
    price: 145,
    floor: 3,
    size: "55 m²",
    amenities: ["Wi-Fi", "Baño privado", "TV", "Aire acondicionado", "Sala", "Mini bar", "Balcón"],
    status: "Disponible",
    image: suiteRoomImage,
    availableFrom: "2026-08-29",
    availableTo: "2026-10-01",
  },
];

const reservations = [
  {
    id: "RES-001",
    guest: "María López",
    room: "102",
    type: "Estándar",
    checkIn: "2026-08-25",
    checkOut: "2026-09-08",
    guests: 2,
    nights: 14,
    total: 770,
    status: "Confirmada",
  },
  {
    id: "RES-002",
    guest: "Carlos Pérez",
    room: "201",
    type: "Familiar",
    checkIn: "2026-09-12",
    checkOut: "2026-09-15",
    guests: 4,
    nights: 3,
    total: 285,
    status: "Pendiente",
  },
];

function RoomsPage() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filter, setFilter] = useState<"Todas" | RoomStatus>("Todas");
  const [search, setSearch] = useState("");

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesStatus = filter === "Todas" || room.status === filter;
        const text = `${room.number} ${room.type}`.toLowerCase();
        return matchesStatus && text.includes(search.toLowerCase());
      }),
    [filter, search]
  );

  const available = rooms.filter((room) => room.status === "Disponible").length;
  const occupied = rooms.filter((room) => room.status === "Ocupada").length;
  const maintenance = rooms.filter((room) => room.status === "Mantenimiento").length;

  return (
    <main className="rooms-page">
      <nav className="rooms-navbar">
        <button className="rooms-brand" type="button" onClick={() => navigate("/")}>Hotel Rolex</button>
        <div className="rooms-navbar__links">
          <button type="button" onClick={() => navigate("/")}>Inicio</button>
          <button className="active" type="button">Habitaciones</button>
          <button type="button" onClick={() => navigate("/#servicios")}>Servicios</button>
          <button type="button" onClick={() => navigate("/#galeria")}>Galería</button>
          <button type="button" onClick={() => navigate("/#contacto")}>Contacto</button>
          <button className="reserve-link" type="button" onClick={() => navigate("/#reservar")}>Reservar</button>
        </div>
      </nav>

      <header className="rooms-hero">
        <div>
          <span className="rooms-eyebrow">GESTIÓN HOTELERA</span>
          <h1>Habitaciones y disponibilidad</h1>
          <p>Consulta el inventario completo, características, capacidad, precios, estado y fechas de disponibilidad de cada habitación.</p>
        </div>
      </header>

      <section className="rooms-container">
        <div className="rooms-summary">
          <div><strong>{rooms.length}</strong><span>Total de habitaciones</span></div>
          <div><strong>{available}</strong><span>Disponibles</span></div>
          <div><strong>{occupied}</strong><span>Ocupadas</span></div>
          <div><strong>{maintenance}</strong><span>En mantenimiento</span></div>
        </div>

        <section className="rooms-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">INVENTARIO</span>
              <h2>Tipos de habitaciones</h2>
            </div>
            <p>Información detallada de cada habitación del hotel.</p>
          </div>

          <div className="rooms-toolbar">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número o tipo..." aria-label="Buscar habitación" />
            <select value={filter} onChange={(event) => setFilter(event.target.value as "Todas" | RoomStatus)} aria-label="Filtrar habitaciones">
              <option value="Todas">Todas</option>
              <option value="Disponible">Disponibles</option>
              <option value="Ocupada">Ocupadas</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <article className="room-detail-card" key={room.number}>
                <div className="room-detail-card__image">
                  <img src={room.image} alt={`Habitación ${room.type}`} />
                  <span className={`status status--${room.status.toLowerCase().replace("ó", "o")}`}>{room.status}</span>
                </div>
                <div className="room-detail-card__body">
                  <div className="room-number">Habitación {room.number} · Piso {room.floor}</div>
                  <h3>{room.type}</h3>
                  <p>{room.description}</p>
                  <div className="room-facts">
                    <span>👥 Hasta {room.capacity}</span>
                    <span>🛏️ {room.beds}</span>
                    <span>📐 {room.size}</span>
                    <span>💰 ${room.price}/noche</span>
                  </div>
                  <div className="availability-box">
                    <strong>Disponibilidad</strong>
                    <span>{room.availableFrom} → {room.availableTo}</span>
                  </div>
                  <button type="button" onClick={() => setSelectedRoom(room)}>Ver información completa</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rooms-section availability-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">CALENDARIO</span>
              <h2>Disponibilidad por habitación</h2>
            </div>
            <p>Rango de fechas en el que cada habitación está disponible u ocupada.</p>
          </div>
          <div className="availability-table-wrapper">
            <table>
              <thead><tr><th>Habitación</th><th>Tipo</th><th>Estado</th><th>Disponible desde</th><th>Disponible hasta</th><th>Capacidad</th><th>Precio/noche</th></tr></thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.number}>
                    <td><strong>#{room.number}</strong></td>
                    <td>{room.type}</td>
                    <td><span className={`table-status table-status--${room.status.toLowerCase().replace("ó", "o")}`}>{room.status}</span></td>
                    <td>{room.availableFrom}</td>
                    <td>{room.availableTo}</td>
                    <td>{room.capacity} huéspedes</td>
                    <td>${room.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rooms-section reservation-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">RESERVAS</span>
              <h2>Información de reservas</h2>
            </div>
            <p>Registro básico de las reservas realizadas y su estado actual.</p>
          </div>
          <div className="reservation-table-wrapper">
            <table>
              <thead><tr><th>Código</th><th>Huésped</th><th>Habitación</th><th>Entrada</th><th>Salida</th><th>Huéspedes</th><th>Noches</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td><strong>{reservation.id}</strong></td>
                    <td>{reservation.guest}</td>
                    <td>#{reservation.room} · {reservation.type}</td>
                    <td>{reservation.checkIn}</td>
                    <td>{reservation.checkOut}</td>
                    <td>{reservation.guests}</td>
                    <td>{reservation.nights}</td>
                    <td>${reservation.total}</td>
                    <td><span className={`reservation-status reservation-status--${reservation.status.toLowerCase()}`}>{reservation.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reservation-info-grid">
            <div><strong>Datos que debe contener una reserva</strong><p>Nombre del huésped, documento o carnet, teléfono, habitación, tipo de habitación, cantidad de huéspedes, fecha y hora de entrada, fecha y hora de salida.</p></div>
            <div><strong>Información de pago</strong><p>Precio por noche, cantidad de noches, subtotal, descuentos si corresponden, método de pago, monto pagado, saldo pendiente y estado del pago.</p></div>
            <div><strong>Estado de la reserva</strong><p>Una reserva puede registrarse como pendiente, confirmada, ocupada, finalizada o cancelada.</p></div>
          </div>
        </section>
      </section>

      {selectedRoom && (
        <div className="room-modal" role="dialog" aria-modal="true" aria-label="Información de habitación">
          <div className="room-modal__content">
            <button className="room-modal__close" type="button" onClick={() => setSelectedRoom(null)} aria-label="Cerrar">×</button>
            <img src={selectedRoom.image} alt="" />
            <div>
              <span className="section-kicker">HABITACIÓN #{selectedRoom.number}</span>
              <h2>{selectedRoom.type}</h2>
              <p>{selectedRoom.description}</p>
              <div className="modal-details">
                <p><strong>Capacidad:</strong> {selectedRoom.capacity} huéspedes</p>
                <p><strong>Camas:</strong> {selectedRoom.beds}</p>
                <p><strong>Superficie:</strong> {selectedRoom.size}</p>
                <p><strong>Piso:</strong> {selectedRoom.floor}</p>
                <p><strong>Precio:</strong> ${selectedRoom.price} por noche</p>
                <p><strong>Estado:</strong> {selectedRoom.status}</p>
                <p><strong>Disponible:</strong> {selectedRoom.availableFrom} hasta {selectedRoom.availableTo}</p>
                <p><strong>Servicios:</strong> {selectedRoom.amenities.join(" · ")}</p>
              </div>
              <button className="modal-reserve" type="button" onClick={() => navigate("/#reservar")}>Ir a reservar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RoomsPage;
