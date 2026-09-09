import { roomInventory, getReservations } from "../data/rooms";
import type { RoomStatus, Reservation, PaymentStatus } from "../data/rooms";
import { storageService } from "./storageService";

const ROOM_STATUS_KEY="hotel-rolex-room-status";
export function getEffectiveRooms(){const overrides=storageService.get<Record<string,RoomStatus>>(ROOM_STATUS_KEY)||{};return roomInventory.map(r=>({...r,status:overrides[r.number]||r.status}));}
export function setRoomStatus(number:string,status:RoomStatus){const overrides=storageService.get<Record<string,RoomStatus>>(ROOM_STATUS_KEY)||{};storageService.set(ROOM_STATUS_KEY,{...overrides,[number]:status});}
export function updatePaymentStatus(id:string,status:PaymentStatus){const list=getReservations();const next=list.map(r=>r.id===id?{...r,paymentStatus:status}:r);storageService.set("hotel-rolex-reservations",next);}
export function updateReservationStatus(id:string,status:"Activa"|"Cancelada"){const list=getReservations();storageService.set("hotel-rolex-reservations",list.map(r=>r.id===id?{...r,status}:r));}
export function getHotelStats(){const rooms=getEffectiveRooms();const reservations=getReservations();const active=reservations.filter(r=>r.status!=="Cancelada");return{rooms:rooms.length,available:rooms.filter(r=>r.status==="Disponible").length,occupied:rooms.filter(r=>r.status==="Ocupada").length,maintenance:rooms.filter(r=>r.status==="Mantenimiento").length,reservations:active.length,paid:active.filter(r=>r.paymentStatus==="Pagado").length,pending:active.filter(r=>r.paymentStatus!=="Pagado").length,revenue:active.filter(r=>r.paymentStatus==="Pagado").reduce((a,r)=>a+r.total,0)}};
