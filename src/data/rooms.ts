import standardRoomImage from "../assets/home/habitacion-estandar.svg";
import familyRoomImage from "../assets/home/habitacion-familiar.svg";
import suiteRoomImage from "../assets/home/habitacion-suite.svg";

export type RoomStatus = "Disponible" | "Ocupada" | "Mantenimiento";
export type PaymentMethod = "Tarjeta" | "Transferencia bancaria" | "Efectivo";
export type PaymentStatus = "Pagado" | "Pendiente" | "Pendiente de verificación" | "Rechazado";
export type ReservationStatus = "Activa" | "Cancelada";
export type OperationStatus = "Reservada" | "Check-in" | "Check-out";
export type PromotionCode = "FINDE10" | "FAMILIA15" | "SUITE12";

export type Room = {
  number: string; type: "Estándar" | "Familiar" | "Suite Premium"; capacity: number; beds: string; price: number; floor: number;
  status: RoomStatus; image: string; description: string; amenities: string[]; availableFrom: string; availableTo: string;
};

export const roomInventory: Room[] = [
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

export type Reservation = {
  id: string; userId?: string; roomNumber: string; guestName: string; document: string; phone: string; email: string;
  checkIn: string; checkOut: string; guests: number; total: number; subtotal?: number; discount?: number; promotionCode?: PromotionCode;
  createdAt: string; status?: ReservationStatus; operationStatus?: OperationStatus; paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus; paymentReference?: string;
};

const STORAGE_KEY = "hotel-rolex-reservations";

export function getReservations(): Reservation[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Reservation[];
    return parsed.map((reservation) => ({ ...reservation, status: reservation.status || "Activa", operationStatus: reservation.operationStatus || "Reservada", paymentStatus: reservation.paymentStatus || "Pendiente" }));
  } catch { return []; }
}

export function saveReservation(reservation: Reservation): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...getReservations(), { ...reservation, status: reservation.status || "Activa", operationStatus: reservation.operationStatus || "Reservada", paymentStatus: reservation.paymentStatus || "Pendiente" }]));
}

export function hasReservationConflict(roomNumber: string, checkIn: string, checkOut: string): boolean {
  return getReservations().some((reservation) => reservation.status !== "Cancelada" && reservation.roomNumber === roomNumber && checkIn < reservation.checkOut && checkOut > reservation.checkIn);
}

export function cancelReservation(reservationId: string, user: { id: string; name: string; carnet: string }): boolean {
  const reservations = getReservations(); const normalize = (value: string) => value.trim().toLowerCase(); let cancelled = false;
  const updated = reservations.map((reservation) => {
    const belongsToUser = reservation.userId ? reservation.userId === user.id : reservation.document.trim() === user.carnet.trim() && normalize(reservation.guestName) === normalize(user.name);
    if (reservation.id === reservationId && belongsToUser && reservation.status !== "Cancelada") { cancelled = true; return { ...reservation, status: "Cancelada" as const }; }
    return reservation;
  });
  if (cancelled) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); return cancelled;
}
