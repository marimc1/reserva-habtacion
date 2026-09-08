import { useNavigate } from "react-router-dom";
import standardRoomImage from "../assets/home/habitacion-estandar.svg";
import familyRoomImage from "../assets/home/habitacion-familiar.svg";
import suiteRoomImage from "../assets/home/habitacion-suite.svg";
import "./RoomsPage.css";

type RoomStatus = "Disponible" | "Ocupada" | "Mantenimiento";

type Room = {
  number: string;
  type: string;
  capacity: number;
  beds: string;
  price: number;
  floor: number;
  status: RoomStatus;
  image: string;
  description: string;
  amenities: string[];
  availableFrom: string;
  availableTo: string;
};

// Inventario de demostración del hotel. Estos datos pueden conectarse después al backend.
const rooms: Room[] = [
  { number: "101", type: "Estándar", capacity: 2, beds: "1 cama doble", price: 55, floor: 1, status: "Disponible", image: standardRoomImage, description: "Habitación cómoda para parejas o estadías cortas.", amenities: ["Baño privado", "Wi-Fi", "TV", "Aire acondicionado"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "102", type: "Estándar", capacity: 2, beds: "1 cama doble", price: 55, floor: 1, status: "Ocupada", image: standardRoomImage, description: "Habitación práctica y confortable para dos personas.", amenities: ["Baño privado", "Wi-Fi", "TV", "Aire acondicionado"], availableFrom: "2026-09-15", availableTo: "2026-12-31" },
  { number: "103", type: "Estándar", capacity: 2, beds: "2 camas individuales", price: 60, floor: 1, status: "Disponible", image: standardRoomImage, description: "Opción ideal para amigos o compañeros de viaje.", amenities: ["Baño privado", "Wi-Fi", "TV", "Escritorio"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "104", type: "Estándar", capacity: 2, beds: "1 cama doble", price: 55, floor: 1, status: "Mantenimiento", image: standardRoomImage, description: "Habitación estándar actualmente en mantenimiento.", amenities: ["Baño privado", "Wi-Fi", "TV"], availableFrom: "2026-09-20", availableTo: "2026-12-31" },
  { number: "201", type: "Familiar", capacity: 4, beds: "2 camas dobles", price: 95, floor: 2, status: "Disponible", image: familyRoomImage, description: "Espacio amplio para familias o grupos pequeños.", amenities: ["Baño privado", "Wi-Fi", "TV", "Aire acondicionado", "Minibar"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "202", type: "Familiar", capacity: 4, beds: "1 cama doble + 2 individuales", price: 100, floor: 2, status: "Ocupada", image: familyRoomImage, description: "Habitación familiar distribuida para mayor comodidad.", amenities: ["Baño privado", "Wi-Fi", "TV", "Minibar"], availableFrom: "2026-09-18", availableTo: "2026-12-31" },
  { number: "203", type: "Familiar", capacity: 4, beds: "2 camas dobles", price: 95, floor: 2, status: "Disponible", image: familyRoomImage, description: "Habitación espaciosa para hasta cuatro huéspedes.", amenities: ["Baño privado", "Wi-Fi", "TV", "Aire acondicionado", "Minibar"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "204", type: "Familiar", capacity: 4, beds: "2 camas dobles", price: 95, floor: 2, status: "Disponible", image: familyRoomImage, description: "Alternativa familiar con todos los servicios esenciales.", amenities: ["Baño privado", "Wi-Fi", "TV", "Minibar"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "301", type: "Suite Premium", capacity: 6, beds: "1 cama king + sofá cama", price: 145, floor: 3, status: "Disponible", image: suiteRoomImage, description: "Suite amplia con área de descanso y servicios premium.", amenities: ["Baño privado", "Wi-Fi", "TV", "Aire acondicionado", "Minibar", "Sala de estar"], availableFrom: "2026-09-08", availableTo: "2026-12-31" },
  { number: "302", type: "Suite Premium", capacity: 6, beds: "1 cama king + sofá cama", price: 145, floor: 3, status: "Ocupada", image: suiteRoomImage, description: "Suite de mayor capacidad para grupos o familias.", amenities: ["Baño privado", "Wi-Fi", "TV", "Minibar", "Sala de estar"], availableFrom: "2026-09-22", availableTo: "2026-12-31" },
];

function RoomsPage() {
  const navigate = useNavigate();
  const available = rooms.filter((room) => room.status === "Disponible").length;
  const occupied = rooms.filter((room) => room.status === "Ocupada").length;
  const maintenance = rooms.filter((room) => room.status === "Mantenimiento").length;

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
          <button className="reserve" onClick={() => navigate("/#reservar")}>Reservar</button>
        </div>
      </nav>

      <header className="rooms-hero">
        <div>
          <span>GESTIÓN HOTELERA</span>
          <h1>Habitaciones</h1>
          <p>Consulta el inventario, características, precios, capacidad y disponibilidad de cada habitación.</p>
        </div>
      </header>

      <section className="rooms-content">
        <div className="rooms-summary">
          <div><strong>{rooms.length}</strong><span>Total de habitaciones</span></div>
          <div><strong>{available}</strong><span>Disponibles</span></div>
          <div><strong>{occupied}</strong><span>Ocupadas</span></div>
          <div><strong>{maintenance}</strong><span>En mantenimiento</span></div>
        </div>

        <section className="room-types">
          <h2>Tipos de habitación</h2>
          <div className="type-grid">
            <article><h3>Estándar</h3><p>2 huéspedes · desde $55/noche</p></article>
            <article><h3>Familiar</h3><p>4 huéspedes · desde $95/noche</p></article>
            <article><h3>Suite Premium</h3><p>6 huéspedes · desde $145/noche</p></article>
          </div>
        </section>

        <section className="rooms-list">
          <div className="section-heading">
            <div><h2>Inventario de habitaciones</h2><p>Información detallada para consultar antes de realizar una reserva.</p></div>
          </div>

          <div className="room-detail-grid">
            {rooms.map((room) => (
              <article className="room-detail-card" key={room.number}>
                <img src={room.image} alt={`Habitación ${room.number} - ${room.type}`} />
                <div className="room-detail-card__body">
                  <div className="room-card-top">
                    <span className={`status status-${room.status.toLowerCase().replace(" ", "-")}`}>{room.status}</span>
                    <strong>Habitación {room.number}</strong>
                  </div>
                  <h3>{room.type}</h3>
                  <p>{room.description}</p>
                  <div className="room-data">
                    <span><b>Capacidad:</b> {room.capacity} huéspedes</span>
                    <span><b>Camas:</b> {room.beds}</span>
                    <span><b>Piso:</b> {room.floor}</span>
                    <span><b>Precio:</b> ${room.price} / noche</span>
                    <span><b>Disponible desde:</b> {room.availableFrom}</span>
                    <span><b>Disponible hasta:</b> {room.availableTo}</span>
                  </div>
                  <div className="amenities"><b>Servicios:</b> {room.amenities.map((item) => <span key={item}>{item}</span>)}</div>
                  <button className="room-reserve-button" disabled={room.status !== "Disponible"} onClick={() => navigate("/#reservar")}>
                    {room.status === "Disponible" ? "Reservar esta habitación" : "No disponible"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="reservation-info">
          <h2>Datos necesarios para una reservación</h2>
          <div className="reservation-info-grid">
            <div><b>1. Fechas</b><p>Fecha de entrada (check-in) y fecha de salida (check-out).</p></div>
            <div><b>2. Huéspedes</b><p>Cantidad de adultos, niños o huéspedes que ocuparán la habitación.</p></div>
            <div><b>3. Habitación</b><p>Número, tipo, capacidad, precio por noche y servicios incluidos.</p></div>
            <div><b>4. Datos del huésped</b><p>Nombre completo, carnet o documento, teléfono y correo electrónico.</p></div>
            <div><b>5. Reserva</b><p>Fecha de creación, noches, precio total y estado de la reserva.</p></div>
            <div><b>6. Pago</b><p>Método de pago y estado del pago, según las opciones configuradas por el hotel.</p></div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default RoomsPage;
