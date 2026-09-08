import { useState } from "react";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import "./FacilitiesPage.css";

type Facility = {
  name: string;
  category: string;
  description: string;
  image: string;
  details: string[];
};

const facilities: Facility[] = [
  {
    name: "Lobby y recepción",
    category: "Áreas comunes",
    description: "Un espacio de bienvenida pensado para orientar a los huéspedes desde su llegada.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85",
    details: ["Recepción y atención", "Zona de espera", "Área de información", "Acceso principal"]
  },
  {
    name: "Piscina",
    category: "Bienestar",
    description: "Área de descanso para disfrutar de un momento tranquilo durante la estancia.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
    details: ["Zona de descanso", "Área exterior", "Espacio para huéspedes", "Ambiente relajado"]
  },
  {
    name: "Restaurante",
    category: "Gastronomía",
    description: "Un ambiente elegante para desayunos, comidas y momentos especiales.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    details: ["Servicio gastronómico", "Área de mesas", "Ambiente climatizado", "Atención a huéspedes"]
  },
  {
    name: "Gimnasio",
    category: "Bienestar",
    description: "Espacio destinado a mantener una rutina activa durante la visita al hotel.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    details: ["Área de entrenamiento", "Equipamiento básico", "Espacio ventilado", "Uso para huéspedes"]
  },
  {
    name: "Salón de eventos",
    category: "Eventos",
    description: "Un espacio versátil para reuniones, celebraciones y actividades especiales.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
    details: ["Espacio adaptable", "Montaje de mesas", "Área para reuniones", "Capacidad configurable"]
  },
  {
    name: "Terraza",
    category: "Áreas comunes",
    description: "Un espacio abierto para relajarse y disfrutar del ambiente del hotel.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    details: ["Área exterior", "Zona de descanso", "Espacio abierto", "Ambiente tranquilo"]
  }
];

function FacilitiesPage() {
  const [selected, setSelected] = useState<Facility | null>(null);
  const [filter, setFilter] = useState("Todas");
  const categories = ["Todas", ...Array.from(new Set(facilities.map((facility) => facility.category)))];
  const visible = filter === "Todas" ? facilities : facilities.filter((facility) => facility.category === filter);

  return (
    <main className="facilities-page">
      <HotelNavbar />
      <header className="facilities-hero">
        <div>
          <span>HOTEL ROLEX · INSTALACIONES</span>
          <h1>Descubre cada espacio del hotel.</h1>
          <p>Conoce visualmente las principales instalaciones y abre cada ficha para consultar qué ofrece cada espacio.</p>
        </div>
        <div className="facilities-hero__count"><strong>{facilities.length}</strong><span>espacios<br />destacados</span></div>
      </header>

      <section className="facilities-content">
        <div className="facilities-toolbar">
          <div><span>EXPLORAR</span><h2>Instalaciones del hotel</h2></div>
          <div className="facilities-filters">
            {categories.map((category) => (
              <button key={category} type="button" className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>
            ))}
          </div>
        </div>

        <div className="facilities-grid">
          {visible.map((facility) => (
            <button key={facility.name} className="facility-card" type="button" onClick={() => setSelected(facility)}>
              <div className="facility-card__image"><img src={facility.image} alt={facility.name} loading="lazy" /><span>Ver información →</span></div>
              <div className="facility-card__body"><small>{facility.category}</small><h3>{facility.name}</h3><p>{facility.description}</p></div>
            </button>
          ))}
        </div>

        <div className="facilities-note">
          <span>EXPERIENCIA ROLEX</span>
          <h2>Espacios pensados para complementar tu estancia.</h2>
          <p>Esta sección funciona como catálogo visual de instalaciones. Las fotografías y características pueden actualizarse fácilmente desde un solo archivo.</p>
        </div>
      </section>

      {selected && (
        <div className="facility-modal" role="dialog" aria-modal="true" aria-label={`Información de ${selected.name}`} onClick={() => setSelected(null)}>
          <div className="facility-modal__card" onClick={(event) => event.stopPropagation()}>
            <button className="facility-modal__close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">×</button>
            <img src={selected.image} alt={selected.name} />
            <div className="facility-modal__info">
              <small>{selected.category} · HOTEL ROLEX</small>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <div className="facility-details">{selected.details.map((detail) => <span key={detail}>✓ {detail}</span>)}</div>
              <button type="button" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <HotelFooter />
    </main>
  );
}

export default FacilitiesPage;
