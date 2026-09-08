import { useNavigate } from "react-router-dom";
import "./HotelFooter.css";

function HotelFooter() {
  const navigate = useNavigate();
  return <footer className="hotel-footer"><div><div className="hotel-footer__brand"><span>HR</span><strong>Hotel Rolex</strong></div><p>Hospitalidad, comodidad y atención profesional en cada estancia.</p></div><div><b>Explorar</b><button type="button" onClick={() => navigate("/habitaciones")}>Habitaciones</button><button type="button" onClick={() => navigate("/servicios")}>Servicios</button><button type="button" onClick={() => navigate("/galeria")}>Galería</button></div><div><b>Reservas</b><button type="button" onClick={() => navigate("/reservar")}>Nueva reserva</button><button type="button" onClick={() => navigate("/contacto")}>Contacto</button></div><div><b>Hotel Rolex</b><span>Sucre, Bolivia</span><span>Atención 24/7</span><span>© 2026</span></div></footer>;
}

export default HotelFooter;
