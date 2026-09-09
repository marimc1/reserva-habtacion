import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import HotelNavbar from "../components/HotelNavbar";
import HotelFooter from "../components/HotelFooter";
import { cancelReservation, getReservations } from "../data/rooms";
import { authRepository } from "../repositories/authRepository";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [refresh, setRefresh] = useState(0);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const reservations = useMemo(() => {
    if (!user) return [];
    const normalize = (value: string) => value.trim().toLowerCase();
    return getReservations().filter(
      (reservation) =>
        reservation.userId === user.id ||
        (!reservation.userId && normalize(reservation.guestName) === normalize(user.name) && reservation.document.trim() === user.carnet.trim())
    );
  }, [user, refresh]);

  if (!user) return <Navigate to="/login" replace />;

  const activeReservations = reservations.filter((reservation) => reservation.status !== "Cancelada");

  const handleLogout = () => {
    authRepository.logout();
    navigate("/", { replace: true });
  };

  const handleCancelReservation = () => {
    if (!reservationToCancel) return;
    const cancelled = cancelReservation(reservationToCancel, user);
    setReservationToCancel(null);
    setNotice(cancelled ? "La reserva fue cancelada correctamente. La habitación vuelve a estar disponible para esas fechas." : "No se pudo cancelar la reserva.");
    setRefresh((value) => value + 1);
  };

  return (
    <main className="profile-page">
      <HotelNavbar />

      <header className="profile-hero">
        <div>
          <span>HOTEL ROLEX · CUENTA</span>
          <h1>Mi perfil.</h1>
          <p>Consulta tus datos, reservas activas y el historial de tus estancias.</p>
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
            <span>RESERVAS ACTIVAS</span>
            <strong>{activeReservations.length}</strong>
            <h2>{activeReservations.length === 1 ? "Reserva activa" : "Reservas activas"}</h2>
            <p>Tus reservas confirmadas aparecen aquí y puedes cancelarlas si cometiste un error.</p>
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

          {notice && <div className="profile-notice">✓ {notice}</div>}

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
                <article className={`profile-reservation ${reservation.status === "Cancelada" ? "profile-reservation--cancelled" : ""}`} key={reservation.id}>
                  <div><small>CÓDIGO</small><strong>{reservation.id}</strong></div>
                  <div><small>HABITACIÓN</small><strong>#{reservation.roomNumber}</strong></div>
                  <div><small>ESTANCIA</small><strong>{reservation.checkIn} → {reservation.checkOut}</strong></div>
                  <div><small>HUÉSPEDES</small><strong>{reservation.guests}</strong></div>
                  <div><small>TOTAL</small><strong>${reservation.total}</strong></div>
                  <div className="profile-reservation__status">
                    <small>ESTADO</small>
                    <strong>{reservation.status === "Cancelada" ? "Cancelada" : "Activa"}</strong>
                  </div>
                  {reservation.status !== "Cancelada" && (
                    <button className="profile-cancel" type="button" onClick={() => setReservationToCancel(reservation.id)}>
                      Cancelar reserva
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      {reservationToCancel && (
        <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
          <div className="profile-modal__card">
            <div className="profile-modal__icon">!</div>
            <span>CONFIRMAR CANCELACIÓN</span>
            <h2 id="cancel-title">¿Cancelar esta reserva?</h2>
            <p>La reserva dejará de bloquear la habitación para esas fechas. Esta acción quedará registrada en tu historial.</p>
            <div className="profile-modal__actions">
              <button className="profile-modal__confirm" type="button" onClick={handleCancelReservation}>Sí, cancelar reserva</button>
              <button className="profile-modal__back" type="button" onClick={() => setReservationToCancel(null)}>Volver</button>
            </div>
          </div>
        </div>
      )}

      <HotelFooter />
    </main>
  );
}

export default ProfilePage;
