import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { getReservations } from "../data/rooms";
import { authRepository } from "../repositories/authRepository";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const reservations = useMemo(() => {
    if (!user) return [];
    const normalize = (value: string) => value.trim().toLowerCase();
    return getReservations().filter(
      (reservation) =>
        normalize(reservation.guestName) === normalize(user.name) ||
        reservation.document.trim() === user.carnet.trim()
    );
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    authRepository.logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="profile-page">
      <HotelNavbar />

      <header className="profile-hero">
        <div>
          <span>HOTEL ROLEX · CUENTA</span>
          <h1>Mi perfil.</h1>
          <p>Consulta tus datos y revisa las reservas asociadas a tu cuenta.</p>
        </div>
        <div className="profile-hero__badge">
          <strong>{user.name.charAt(0).toUpperCase()}</strong>
          <span>{user.role === "ADMIN" ? "Administrador" : "Huésped"}</span>
        </div>
      </header>

      <section className="profile-content">
        <div className="profile-grid">
          <article className="profile-card profile-card--main">
            <div className="profile-card__heading">
              <span>INFORMACIÓN PERSONAL</span>
              <h2>Datos de la cuenta</h2>
            </div>
            <div className="profile-data">
              <div><small>Nombre completo</small><strong>{user.name}</strong></div>
              <div><small>Carnet / usuario</small><strong>{user.carnet}</strong></div>
              <div><small>Rol</small><strong>{user.role === "ADMIN" ? "Administrador" : "Usuario"}</strong></div>
              <div><small>Estado</small><strong className="profile-status">● Cuenta activa</strong></div>
            </div>
            <button className="profile-logout" type="button" onClick={handleLogout}>Cerrar sesión</button>
          </article>

          <article className="profile-card profile-card--summary">
            <span>RESUMEN</span>
            <strong>{reservations.length}</strong>
            <h2>{reservations.length === 1 ? "Reserva registrada" : "Reservas registradas"}</h2>
            <p>Las reservas realizadas desde este navegador aparecerán aquí cuando coincidan con tus datos.</p>
          </article>
        </div>

        <section className="profile-reservations">
          <div className="profile-section-heading">
            <div>
              <span>MIS RESERVAS</span>
              <h2>Historial de estancias</h2>
            </div>
            <button type="button" onClick={() => navigate("/habitaciones")}>Buscar habitación →</button>
          </div>

          {reservations.length === 0 ? (
            <div className="profile-empty">
              <div>□</div>
              <h3>Aún no tienes reservas</h3>
              <p>Explora nuestras habitaciones y realiza una reserva para verla en tu perfil.</p>
              <button type="button" onClick={() => navigate("/habitaciones")}>Explorar habitaciones</button>
            </div>
          ) : (
            <div className="profile-reservation-list">
              {reservations.map((reservation) => (
                <article className="profile-reservation" key={reservation.id}>
                  <div><small>CÓDIGO</small><strong>{reservation.id}</strong></div>
                  <div><small>HABITACIÓN</small><strong>#{reservation.roomNumber}</strong></div>
                  <div><small>ESTANCIA</small><strong>{reservation.checkIn} → {reservation.checkOut}</strong></div>
                  <div><small>HUÉSPEDES</small><strong>{reservation.guests}</strong></div>
                  <div><small>TOTAL</small><strong>${reservation.total}</strong></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <HotelFooter />
    </main>
  );
}

export default ProfilePage;
