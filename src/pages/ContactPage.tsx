import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import "./ContactPage.css";

function ContactPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    setName(""); setEmail(""); setMessage("");
  };

  return <main className="contact-page"><HotelNavbar /><header className="contact-hero"><span>B&amp;B SANTA CECILIA INC. · CONTACTO</span><h1>Estamos para ayudarte.</h1><p>Consulta información sobre habitaciones, disponibilidad o el proceso de reserva.</p></header><section className="contact-content"><div className="contact-info"><span>INFORMACIÓN</span><h2>Comunícate con el hotel.</h2><div className="contact-info__items"><div><small>UBICACIÓN</small><strong>Calle Potosí N.º 386, Sucre</strong><p>B&amp;B Santa Cecilia Inc. · Chuquisaca, Bolivia.</p></div><div><small>HORARIO</small><strong>Atención 24/7</strong><p>Consulta el sistema de reservas en cualquier momento.</p></div><div><small>RESERVAS</small><strong>Online</strong><p>Revisa disponibilidad y precios desde Habitaciones.</p></div></div><button type="button" onClick={() => navigate("/habitaciones")}>Consultar habitaciones →</button></div><form className="contact-form" onSubmit={submit}><div><span>MENSAJE</span><h2>Envíanos una consulta</h2><p>Completa el formulario y registra tu mensaje.</p></div><label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Tu nombre" /></label><label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" /></label><label>Mensaje<textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="¿En qué podemos ayudarte?" /></label>{sent && <div className="contact-success">✓ Mensaje registrado correctamente en esta demostración.</div>}<button type="submit">Enviar consulta →</button></form></section><HotelFooter /></main>;
}

export default ContactPage;
