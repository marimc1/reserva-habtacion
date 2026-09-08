import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { roomInventory } from "../data/rooms";
import type { Room } from "../data/rooms";
import "./GalleryPage.css";

type GalleryItem = { id: string; title: string; category: "Habitaciones" | "Detalles" | "Experiencia"; room: Room };

function GalleryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<Room | null>(null);

  const items: GalleryItem[] = [
    { id: "std", title: "Habitación Estándar", category: "Habitaciones", room: roomInventory[0] },
    { id: "fam", title: "Habitación Familiar", category: "Habitaciones", room: roomInventory[4] },
    { id: "suite", title: "Suite Premium", category: "Habitaciones", room: roomInventory[8] },
    { id: "std2", title: "Estándar · alternativa", category: "Detalles", room: roomInventory[2] },
    { id: "fam2", title: "Familiar · alternativa", category: "Detalles", room: roomInventory[6] },
    { id: "suite2", title: "Suite Premium · alternativa", category: "Experiencia", room: roomInventory[9] },
  ];

  const visible = filter === "Todas" ? items : items.filter((item) => item.category === filter);

  return <main className="gallery-page"><HotelNavbar /><header className="gallery-hero"><div><span>HOTEL ROLEX · GALERÍA</span><h1>Conoce nuestros espacios.</h1><p>Explora cada categoría y abre una ficha completa con capacidad, camas, precio, piso, disponibilidad, servicios y características de la habitación.</p></div><div className="gallery-count"><strong>{roomInventory.length}</strong><span>habitaciones<br />en inventario</span></div></header><section className="gallery-content"><div className="gallery-toolbar"><div><span>EXPLORAR</span><h2>Habitaciones y espacios</h2></div><div className="gallery-filters">{["Todas", "Habitaciones", "Detalles", "Experiencia"].map((option) => <button key={option} type="button" className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}</button>)}</div></div><div className="gallery-grid">{visible.map((item) => <button className="gallery-card" type="button" key={item.id} onClick={() => setSelected(item.room)}><div><img src={item.room.image} alt={`${item.title} ${item.room.number}`} /><span>Ver detalles completos →</span></div><section><small>{item.category} · Habitación #{item.room.number}</small><h3>{item.title}</h3><p>{item.room.description}</p><div className="gallery-card__meta"><span>{item.room.capacity} huéspedes</span><span>{item.room.beds}</span><strong>${item.room.price}/noche</strong></div></section></button>)}</div><div className="gallery-cta"><div><span>¿ENCONTRASTE TU OPCIÓN?</span><h2>Consulta disponibilidad y reserva.</h2></div><button type="button" onClick={() => navigate("/habitaciones")}>Ver habitaciones →</button></div></section>{selected && <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`Detalles habitación ${selected.number}`} onClick={() => setSelected(null)}><div className="gallery-modal__card gallery-modal__card--room" onClick={(event) => event.stopPropagation()}><button className="gallery-modal__close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">×</button><div className="room-modal-image"><img src={selected.image} alt={`Habitación ${selected.number}`} /><span className={`room-modal-status ${selected.status.toLowerCase().replace(" ", "-")}`}>{selected.status}</span></div><div className="room-modal-info"><small>HOTEL ROLEX · HABITACIÓN #{selected.number}</small><h2>{selected.type}</h2><p className="room-modal-description">{selected.description}</p><div className="room-modal-price"><span>Tarifa por noche</span><strong>${selected.price}</strong></div><div className="room-modal-data"><div><span>CAPACIDAD</span><strong>{selected.capacity} huéspedes</strong></div><div><span>CAMAS</span><strong>{selected.beds}</strong></div><div><span>PISO</span><strong>{selected.floor}° piso</strong></div><div><span>ESTADO</span><strong>{selected.status}</strong></div><div><span>DISPONIBLE DESDE</span><strong>{selected.availableFrom}</strong></div><div><span>DISPONIBLE HASTA</span><strong>{selected.availableTo}</strong></div></div><div className="room-modal-section"><span>AMENIDADES INCLUIDAS</span><div className="room-modal-amenities">{selected.amenities.map((amenity) => <span key={amenity}>✓ {amenity}</span>)}</div></div><div className="room-modal-actions"><button type="button" className="room-modal-secondary" onClick={() => setSelected(null)}>Cerrar</button><button type="button" disabled={selected.status !== "Disponible"} onClick={() => navigate(`/reservar?room=${selected.number}`)}>{selected.status === "Disponible" ? "Reservar esta habitación →" : "No disponible"}</button></div></div></div></div>}<HotelFooter /></main>;
}

export default GalleryPage;
