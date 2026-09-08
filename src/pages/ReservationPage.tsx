import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { hasReservationConflict, roomInventory, saveReservation } from "../data/rooms";
import type { Reservation } from "../data/rooms";
import "./ReservationPage.css";

const today = new Date().toISOString().slice(0, 10);

function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoomNumber = new URLSearchParams(location.search).get("room") || "";
  const firstAvailable = roomInventory.find((room) => room.status === "Disponible");
  const selectedRoom = roomInventory.find((room) => room.number === selectedRoomNumber) || firstAvailable;

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

  const handleRoomChange = (value: string) => {
    setRoomNumber(value);
    const newRoom = roomInventory.find((item) => item.number === value);
    if (newRoom && guests > newRoom.capacity) setGuests(newRoom.capacity);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!room) return setMessage("Selecciona una habitación.");
    if (room.status !== "Disponible") return setMessage("La habitación seleccionada no está disponible.");
    if (!guestName.trim() || !document.trim() || !phone.trim() || !email.trim()) return setMessage("Completa todos los datos del huésped.");
    if (!checkIn || !checkOut || nights <= 0) return setMessage("Selecciona fechas válidas de entrada y salida.");
    if (checkIn < today) return setMessage("La fecha de entrada no puede ser anterior a hoy.");
    if (checkIn < room.availableFrom || checkOut > room.availableTo) return setMessage(`Esta habitación está disponible entre ${room.availableFrom} y ${room.availableTo}.`);
    if (guests < 1 || guests > room.capacity) return setMessage(`Esta habitación tiene capacidad máxima para ${room.capacity} huéspedes.`);
    if (hasReservationConflict(room.number, checkIn, checkOut)) return setMessage("La habitación ya tiene una reserva en esas fechas. Elige otras fechas o habitación.");

    const reservation: Reservation = { id: `RES-${Date.now()}`, roomNumber: room.number, guestName: guestName.trim(), document: document.trim(), phone: phone.trim(), email: email.trim(), checkIn, checkOut, guests, total, createdAt: new Date().toISOString() };
    saveReservation(reservation);
    setConfirmed(reservation);
  };

  if (confirmed) return <main className="reservation-page"><nav className="reservation-navbar"><button type="button" onClick={() => navigate("/")}>Hotel Rolex</button><button type="button" onClick={() => navigate("/habitaciones")}>← Habitaciones</button></nav><section className="confirmation-card"><div className="confirmation-icon">✓</div><span>RESERVA CONFIRMADA</span><h1>¡Reserva realizada!</h1><p>Tu reserva fue registrada correctamente en este dispositivo.</p><div className="confirmation-details"><div><b>Código de reserva</b><span>{confirmed.id}</span></div><div><b>Habitación</b><span>{confirmed.roomNumber} · {room?.type}</span></div><div><b>Huésped</b><span>{confirmed.guestName}</span></div><div><b>Entrada</b><span>{confirmed.checkIn}</span></div><div><b>Salida</b><span>{confirmed.checkOut}</span></div><div><b>Huéspedes</b><span>{confirmed.guests}</span></div><div className="confirmation-total"><b>Total</b><span>${confirmed.total}</span></div></div><div className="confirmation-actions"><button type="button" onClick={() => navigate("/habitaciones")}>Volver a habitaciones</button><button type="button" className="outline" onClick={() => navigate("/")}>Ir al inicio</button></div></section></main>;

  return <main className="reservation-page"><nav className="reservation-navbar"><button type="button" onClick={() => navigate("/")}>Hotel Rolex</button><button type="button" onClick={() => navigate("/habitaciones")}>← Habitaciones</button></nav><section className="reservation-layout"><div className="reservation-intro"><span>HOTEL ROLEX · RESERVAS</span><h1>Haz tu reserva.</h1><p>Completa tus datos, selecciona las fechas y confirma tu habitación en pocos pasos.</p>{room && <div className="selected-room"><b>HABITACIÓN SELECCIONADA</b><strong>{room.number} · {room.type}</strong><span>Hasta {room.capacity} huéspedes · ${room.price}/noche</span><small>✓ Baño privado · ✓ Wi-Fi · ✓ Atención hotelera</small></div>}<div className="reservation-steps"><div><b>01</b><span>Elige habitación</span></div><div><b>02</b><span>Completa tus datos</span></div><div><b>03</b><span>Confirma</span></div></div></div><form className="reservation-form" onSubmit={handleSubmit}><div className="form-heading"><span>01 · ESTANCIA</span><h2>Datos de la reserva</h2><p>Indica cuándo y dónde quieres hospedarte.</p></div><label>Habitación<select value={roomNumber} onChange={(e) => handleRoomChange(e.target.value)} required>{roomInventory.filter((item) => item.status === "Disponible").map((item) => <option key={item.number} value={item.number}>{item.number} · {item.type} · ${item.price}/noche</option>)}</select></label><div className="form-grid"><label>Fecha de entrada<input type="date" value={checkIn} min={today} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }} required /></label><label>Fecha de salida<input type="date" value={checkOut} min={checkIn ? new Date(new Date(`${checkIn}T00:00:00`).getTime() + 86400000).toISOString().slice(0,10) : today} onChange={(e) => setCheckOut(e.target.value)} required /></label></div><label>Número de huéspedes<input type="number" min="1" max={room?.capacity || 6} value={guests} onChange={(e) => setGuests(Number(e.target.value))} required /></label><div className="form-heading second"><span>02 · HUÉSPED</span><h2>Datos del huésped</h2><p>Usaremos estos datos para identificar la reserva.</p></div><label>Nombre completo<input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Ej. María López" required /></label><div className="form-grid"><label>Documento<input type="text" value={document} onChange={(e) => setDocument(e.target.value)} placeholder="CI / documento" required /></label><label>Teléfono<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Número de contacto" required /></label></div><label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required /></label>{nights > 0 && <div className="price-box"><div><span>Resumen de estancia</span><strong>{nights} noche(s) × ${room?.price || 0}</strong></div><div><span>Total</span><strong>${total}</strong></div></div>}{message && <div className="reservation-error">⚠ {message}</div>}<button className="confirm-button" type="submit">Confirmar reserva <span>→</span></button><p className="saved-note">Las reservas de esta versión se almacenan localmente en tu navegador.</p></form></section></main>;
}

export default ReservationPage;
