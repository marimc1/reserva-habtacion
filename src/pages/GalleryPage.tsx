import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { roomInventory } from "../data/rooms";
import "./GalleryPage.css";

type GalleryItem = { id: string; title: string; category: "Habitaciones" | "Detalles" | "Experiencia"; image: string; description: string };

function GalleryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    { id: "std", title: "Habitación Estándar", category: "Habitaciones", image: roomInventory[0].image, description: "Espacio funcional y confortable para hasta 2 huéspedes." },
    { id: "fam", title: "Habitación Familiar", category: "Habitaciones", image: roomInventory[4].image, description: "Mayor amplitud para familias o grupos de hasta 4 huéspedes." },
    { id: "suite", title: "Suite Premium", category: "Habitaciones", image: roomInventory[8].image, description: "Nuestra opción superior, con capacidad para hasta 6 huéspedes." },
    { id: "std2", title: "Detalles de la habitación", category: "Detalles", image: roomInventory[1].image, description: "Ambientes preparados para una estancia práctica y tranquila." },
    { id: "fam2", title: "Confort familiar", category: "Experiencia", image: roomInventory[5].image, description: "Una alternativa pensada para compartir y descansar." },
    { id: "suite2", title: "Experiencia Premium", category: "Experiencia", image: roomInventory[9].image, description: "Una estancia más amplia para quienes buscan un nivel superior de comodidad." },
  ];

  const visible = filter === "Todas" ? items : items.filter((item) => item.category === filter);

  return <main className="gallery-page"><HotelNavbar /><header className="gallery-hero"><div><span>HOTEL ROLEX · GALERÍA</span><h1>Conoce nuestros espacios.</h1><p>Explora visualmente nuestras habitaciones y descubre el estilo sobrio y confortable del hotel.</p></div><div className="gallery-count"><strong>{items.length}</strong><span>imágenes<br />disponibles</span></div></header><section className="gallery-content"><div className="gallery-toolbar"><div><span>EXPLORAR</span><h2>Galería del hotel</h2></div><div className="gallery-filters">{["Todas", "Habitaciones", "Detalles", "Experiencia"].map((option) => <button key={option} type="button" className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}</button>)}</div></div><div className="gallery-grid">{visible.map((item) => <button className="gallery-card" type="button" key={item.id} onClick={() => setSelected(item)}><div><img src={item.image} alt={item.title} /><span>Ver detalle</span></div><section><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p></section></button>)}</div><div className="gallery-cta"><div><span>¿TE GUSTÓ LO QUE VISTE?</span><h2>Consulta disponibilidad y reserva.</h2></div><button type="button" onClick={() => navigate("/habitaciones")}>Ver habitaciones →</button></div></section>{selected && <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}><div className="gallery-modal__card" onClick={(event) => event.stopPropagation()}><button className="gallery-modal__close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">×</button><img src={selected.image} alt={selected.title} /><div><small>{selected.category}</small><h2>{selected.title}</h2><p>{selected.description}</p><button type="button" onClick={() => navigate("/reservar")}>Reservar ahora →</button></div></div></div>}<HotelFooter /></main>;
}

export default GalleryPage;
