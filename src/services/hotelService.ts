import { roomInventory, getReservations } from "../data/rooms";
import type { OperationStatus, PaymentStatus, ReservationStatus, RoomStatus } from "../data/rooms";
import { storageService } from "./storageService";

const ROOM_STATUS_KEY = "hotel-rolex-room-status";
const NOTIFICATIONS_KEY = "hotel-rolex-notifications";

export type HotelNotification = { id: string; userId: string; text: string; date: string; read: boolean };

export function getEffectiveRooms() {
  const overrides = storageService.get<Record<string, RoomStatus>>(ROOM_STATUS_KEY) || {};
  return roomInventory.map((r) => ({ ...r, status: overrides[r.number] || r.status }));
}

export function setRoomStatus(number: string, status: RoomStatus) {
  const overrides = storageService.get<Record<string, RoomStatus>>(ROOM_STATUS_KEY) || {};
  storageService.set(ROOM_STATUS_KEY, { ...overrides, [number]: status });
}

export function updatePaymentStatus(id: string, status: PaymentStatus) {
  const list = getReservations();
  storageService.set("hotel-rolex-reservations", list.map((r) => r.id === id ? { ...r, paymentStatus: status } : r));
}

export function updateReservationStatus(id: string, status: ReservationStatus) {
  const list = getReservations();
  storageService.set("hotel-rolex-reservations", list.map((r) => r.id === id ? { ...r, status } : r));
}

export function updateOperationStatus(id: string, operationStatus: OperationStatus) {
  const list = getReservations();
  const reservation = list.find((r) => r.id === id);
  const next = list.map((r) => r.id === id ? { ...r, operationStatus } : r);
  storageService.set("hotel-rolex-reservations", next);
  if (reservation?.userId) {
    const text = operationStatus === "Check-in" ? `Check-in registrado para la habitación #${reservation.roomNumber}.` : operationStatus === "Check-out" ? `Check-out registrado para la habitación #${reservation.roomNumber}.` : `Reserva ${reservation.id} actualizada.`;
    addNotification(reservation.userId, text);
  }
}

export function addNotification(userId: string, text: string) {
  const notifications = storageService.get<HotelNotification[]>(NOTIFICATIONS_KEY) || [];
  storageService.set(NOTIFICATIONS_KEY, [{ id: `NOT-${Date.now()}`, userId, text, date: new Date().toISOString(), read: false }, ...notifications]);
}

export function getNotifications(userId: string) {
  return (storageService.get<HotelNotification[]>(NOTIFICATIONS_KEY) || []).filter((item) => item.userId === userId);
}

export function markNotificationsRead(userId: string) {
  const notifications = storageService.get<HotelNotification[]>(NOTIFICATIONS_KEY) || [];
  storageService.set(NOTIFICATIONS_KEY, notifications.map((item) => item.userId === userId ? { ...item, read: true } : item));
}

export function getHotelStats() {
  const rooms = getEffectiveRooms();
  const reservations = getReservations();
  const active = reservations.filter((r) => r.status !== "Cancelada");
  return {
    rooms: rooms.length,
    available: rooms.filter((r) => r.status === "Disponible").length,
    occupied: rooms.filter((r) => r.status === "Ocupada").length,
    maintenance: rooms.filter((r) => r.status === "Mantenimiento").length,
    reservations: active.length,
    paid: active.filter((r) => r.paymentStatus === "Pagado").length,
    pending: active.filter((r) => r.paymentStatus !== "Pagado").length,
    revenue: active.filter((r) => r.paymentStatus === "Pagado").reduce((a, r) => a + r.total, 0),
  };
}
