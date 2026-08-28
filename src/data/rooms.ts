import standardRoomImage from "../assets/home/habitacion-estandar.svg";
import familyRoomImage from "../assets/home/habitacion-familiar.svg";
import suiteRoomImage from "../assets/home/habitacion-suite.svg";

export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  totalRooms: number;
  roomNumbers: string[];
  bedConfiguration: string;
  size: string;
  amenities: string[];
  policies: string[];
  reservationInfo: string[];
  availableRanges: Array<{ from: string; to: string }>;
  unavailableDates: Array<{ from: string; to: string; reason: string }>;
  image: string;
};

export const rooms: Room[] = [
  {
    id: "standard",
    name: "Habitación Estándar",
    description:
      "Cómoda habitación para viajes cortos, con cama doble, baño privado y ambiente cálido para descansar.",
    pricePerNight: 55,
    capacity: 2,
    totalRooms: 18,
    roomNumbers: ["101", "102", "103", "104", "201", "202"],
    bedConfiguration: "1 cama matrimonial o 2 camas individuales",
    size: "24 m²",
    amenities: ["Wi-Fi", "TV Smart", "Aire acondicionado", "Baño privado", "Caja fuerte"],
    policies: ["Check-in desde las 14:00", "Check-out hasta las 11:00", "No fumadores"],
    reservationInfo: ["Reserva con 20% de anticipo", "Cancelación sin cargo hasta 48 horas antes"],
    availableRanges: [
      { from: "2026-08-29", to: "2026-09-04" },
      { from: "2026-09-09", to: "2026-09-30" },
    ],
    unavailableDates: [{ from: "2026-09-05", to: "2026-09-08", reason: "Reservas confirmadas" }],
    image: standardRoomImage,
  },
  {
    id: "family",
    name: "Habitación Familiar",
    description:
      "Espacio amplio con dos camas, ideal para familias o grupos que buscan comodidad durante su estancia.",
    pricePerNight: 95,
    capacity: 4,
    totalRooms: 10,
    roomNumbers: ["301", "302", "303", "304", "401"],
    bedConfiguration: "2 camas queen y sofá cama",
    size: "38 m²",
    amenities: ["Wi-Fi", "Minibar", "TV Smart", "Cuna bajo solicitud", "Baño privado amplio"],
    policies: ["Niños bienvenidos", "Máximo 4 huéspedes", "Mascotas pequeñas bajo solicitud"],
    reservationInfo: ["Incluye desayuno para 4", "Pago restante al llegar al hotel"],
    availableRanges: [
      { from: "2026-08-29", to: "2026-09-11" },
      { from: "2026-09-15", to: "2026-10-15" },
    ],
    unavailableDates: [{ from: "2026-09-12", to: "2026-09-14", reason: "Alta ocupación familiar" }],
    image: familyRoomImage,
  },
  {
    id: "suite",
    name: "Suite Premium",
    description:
      "Suite elegante con cama king, sala de descanso y detalles exclusivos para una experiencia superior.",
    pricePerNight: 145,
    capacity: 6,
    totalRooms: 6,
    roomNumbers: ["501", "502", "601"],
    bedConfiguration: "1 cama king, 2 camas individuales y sala con sofá cama",
    size: "56 m²",
    amenities: ["Jacuzzi", "Balcón privado", "Room service", "Cafetera", "Amenities premium"],
    policies: ["Depósito reembolsable requerido", "Late check-out sujeto a disponibilidad"],
    reservationInfo: ["Prioridad para reservas corporativas", "Incluye bienvenida y desayuno premium"],
    availableRanges: [
      { from: "2026-08-29", to: "2026-09-30" },
      { from: "2026-10-05", to: "2026-10-31" },
    ],
    unavailableDates: [{ from: "2026-10-01", to: "2026-10-04", reason: "Mantenimiento programado" }],
    image: suiteRoomImage,
  },
];

