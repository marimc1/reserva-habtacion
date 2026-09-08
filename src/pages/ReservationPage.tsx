import { FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getReservations, hasReservationConflict, Reservation, roomInventory, saveReservation } from "../data/rooms";
import "./ReservationPage.css";

function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoomNumber = new URLSearchParams(location.search).get("room") || "";
  const selectedRoom = roomInventory.find((room) => room.number === selectedRoomNumber) || roomInventory.find((room) => room.status === "Disponible");

  const [roomNumber, setRoomNumber] = useState(selectedRoom?.number || "");
  const [guestName, setGuestName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  const room = roomInventory.find((item) => item.number === roomNumber);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T00:00:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00`).getTime();
    return end > start ? Math.ceil((end - start) / 86400000) : 0;
  }, [checkIn, checkOut]);
  const total = room ? nights * room.price : 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!room) return setMessage("Selecciona una habitación.");
    if (room.status !== "Disponible") return setMessage("La habitación seleccionada no está disponible.");
    if (!checkIn || !checkOut || nights <= 0) return setMessage("Selecciona fechas válidas de entrada y salida.");
    if (guests > room.capacity) return setMessage(`Esta habitación tiene capacidad máxima para ${room.capacity} huéspedes.`);
    if (hasReservationConflict(room.number, checkIn, checkOut)) return setMessage("La habitación ya tiene una reserva en esas fechas. Elige otras fechas o habitación.");

    const reservation: Reservation = {
      id: `RES-${Date.now()}`,
      roomNumber: room.number,
      guestName,
      document,
      phone,
      email,
      checkIn,
      checkOut,
      guests,
      total,
      createdAt: new Date().toISOString(),
    };

    saveReservation(reservation);
    setConfirmed(reservation);
  };

  if (confirmed) {
    return (
      <main className="reservation-page">
        <section className="confirmation-card">
          <div className="confirmation-icon">✓</div>
          <span>RESERVA CONFIRMADA</span>
          <h1>¡Reserva realizada!</h1>
          <p>Tu reserva fue guardada correctamente en este dispositivo.</p>
          <div className="confirmation-details">
            <div><b>Código</b><span>{confirmed.id}</span></div>
            <div><b>Habitación</b><span>{confirmed.roomNumber} · {room?.type}</span></div>
            <div><b>Entrada</b><span>{confirmed.checkIn}</span></div>
            <div><b>Salida</b><span>{confirmed.checkOut}</span></div>
            <div><b>Huéspedes</b><span>{confirmed.guests}</span></div>
            <div><b>Total</b><span>${confirmed.total}</span></div>
          </div>
          <button onClick={() => navigate("/habitaciones")}>Volver a habitaciones</button>
        </section>
      </main>
    );
  }

  return (
    <main className="reservation-page">
      <nav className="reservation-navbar">
        <button onClick={() => navigate("/")}>Hotel Rolex</button>
        <button onClick={() => navigate("/habitaciones")}>← Habitaciones</button>
      </nav>
      <section className="reservation-layout">
        <div className="reservation-intro">
          <span>HOTEL ROLEX</span>
          <h1>Realizar reserva</h1>
          <p>Completa los datos y confirma tu habitación.</p>
          {room && <div className="selected-room"><b>Habitación seleccionada</b><strong>{room.number} · {room.type}</strong><span>Hasta {room.capacity} huéspedes · ${room.price}/noche</span></div>}
        </div>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <h2>Datos de la reserva</h2>
          <label>Habitación<select value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required>{roomInventory.filter((item) => item.status === "Disponible").map((item) => <option key={item.number} value={item.number}>{item.number} · {item.type} · ${item.price}/noche</option>)}</select></label>
          <div className="form-grid">
            <label>Fecha de entrada<input type="date" value={checkIn} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setCheckIn(e.target.value)} required /></label>
            <label>Fecha de salida<input type="date" value={checkOut} min={checkIn || new Date().toISOString().slice(0, 10)} onChange={(e) => setCheckOut(e.target.value)} required /></label>
          </div>
          <label>Número de huéspedes<input type="number" min="1" max={room?.capacity || 6} value={guests} onChange={(e) => setGuests(Number(e.target.value))} required /></label>
          <h2>Datos del huésped</h2>
          <label>Nombre completo<input value={guestName} onChange={(e) => setGuestName(e.target.value)} required /></label>
          <div className="form-grid">
            <label>Documento<input value={document} onChange={(e) => setDocument(e.target.value)} required /></label>
            <label>Teléfono<input value={phone} onChange={(e) => setPhone(e.target.value)} required /></label>
          </div>
          <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          {nights > 0 && <div className="price-box"><span>{nights} noche(s) × ${room?.price || 0}</span><strong>Total: ${total}</strong></div>}
          {message && <div className="reservation-error">{message}</div>}
          <button className="confirm-button" type="submit">Confirmar reserva</button>
          <p className="saved-note">Las reservas de esta versión se guardan localmente en el navegador.</p>
        </form>
      </section>
    </main>
  );
}

export default ReservationPage;
