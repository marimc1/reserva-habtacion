import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getReservations } from "../../data/rooms";
import type { PaymentStatus } from "../../data/rooms";
import { authRepository } from "../../repositories/authRepository";
import { getEffectiveRooms, getHotelStats, getConsultations, updateConsultationStatus, setRoomStatus, updateOperationStatus, updatePaymentStatus, updateReservationStatus } from "../../services/hotelService";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState("resumen");
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().slice(0, 7));
  const stats = useMemo(() => getHotelStats(), [refresh]);
  const rooms = useMemo(() => getEffectiveRooms(), [refresh]);
  const reservations = useMemo(() => getReservations(), [refresh]);
  const consultations = useMemo(() => getConsultations(), [refresh]);
  const newConsultations = consultations.filter((item) => item.status === "Nueva").length;

  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (user.role !== "ADMIN") {
    return <main className="admin-denied"><h1>Acceso restringido</h1><p>Esta sección es exclusiva para administradores.</p><button onClick={() => navigate("/")}>Volver al inicio</button></main>;
  }

  const refreshData = () => setRefresh((value) => value + 1);
  const active = reservations.filter((reservation) => reservation.status !== "Cancelada");
  const monthStart = `${calendarDate}-01`;
  const monthEnd = new Date(Number(calendarDate.slice(0, 4)), Number(calendarDate.slice(5, 7)), 0).getDate();
  const days = Array.from({ length: monthEnd }, (_, index) => index + 1);

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><span>B&B SANTA CECILIA INC. · ADMINISTRACIÓN</span><h1>Panel de control.</h1><p>Gestiona habitaciones, reservas, huéspedes, pagos y operación diaria.</p></div>
        <div className="admin-head-actions">
          <button onClick={() => navigate("/")}>Ver sitio</button>
          <button onClick={() => { authRepository.logout(); navigate("/", { replace: true }); }}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {[[ "resumen", "Resumen" ], [ "reservas", "Reservas" ], [ "calendario", "Calendario" ], [ "habitaciones", "Habitaciones" ], [ "pagos", "Pagos" ], [ "operacion", "Check-in / Check-out" ], [ "usuarios", "Huéspedes" ], [ "consultas", `Consultas${newConsultations ? ` (${newConsultations})` : ""}` ]].map(([id, label]) => (
          <button className={tab === id ? "active" : ""} onClick={() => setTab(id)} key={id}>{label}</button>
        ))}
      </nav>

      <section className="admin-content">
        {tab === "resumen" && (
          <>
            <div className="admin-stats">
              <div><b>HABITACIONES</b><strong>{stats.rooms}</strong><span>Inventario total</span></div>
              <div><b>DISPONIBLES</b><strong>{stats.available}</strong><span>Listas para reservar</span></div>
              <div><b>OCUPADAS</b><strong>{stats.occupied}</strong><span>En uso</span></div>
              <div><b>MANTENIMIENTO</b><strong>{stats.maintenance}</strong><span>Fuera de servicio</span></div>
              <div><b>RESERVAS</b><strong>{stats.reservations}</strong><span>Activas</span></div>
              <div><b>INGRESOS</b><strong>${stats.revenue}</strong><span>Pagos confirmados</span></div>
            </div>
            <div className="admin-panels">
              <article><span>ESTADO OPERATIVO</span><h2>Resumen del hotel</h2>
                <div className="bars">
                  <p><b>Disponibilidad</b><i style={{ width: `${stats.rooms ? (stats.available / stats.rooms) * 100 : 0}%` }}></i><small>{stats.available}/{stats.rooms}</small></p>
                  <p><b>Pagos confirmados</b><i style={{ width: `${active.length ? (stats.paid / active.length) * 100 : 0}%` }}></i><small>{stats.paid}/{active.length}</small></p>
                  <p><b>Pagos pendientes</b><i style={{ width: `${active.length ? (stats.pending / active.length) * 100 : 0}%` }}></i><small>{stats.pending}</small></p>
                </div>
              </article>
              <article><span>ACCIONES RÁPIDAS</span><h2>Operación</h2>
                <div className="quick-actions">
                  <button onClick={() => setTab("reservas")}>Ver reservas →</button>
                  <button onClick={() => setTab("pagos")}>Revisar pagos →</button>
                  <button onClick={() => setTab("habitaciones")}>Gestionar habitaciones →</button>
                  <button onClick={() => setTab("calendario")}>Abrir calendario →</button>
                  <button onClick={() => setTab("consultas")}>Ver consultas ({newConsultations}) →</button>
                </div>
              </article>
            </div>
          </>
        )}

        {tab === "consultas" && <ConsultationsPanel consultations={consultations} onRefresh={refreshData} />}

        {tab === "reservas" && <AdminTable title="Todas las reservas" reservations={reservations} onRefresh={refreshData} />}

        {tab === "calendario" && (
          <section className="admin-section">
            <div className="admin-section-head"><div><span>PLANIFICACIÓN</span><h2>Calendario de ocupación</h2></div><input type="month" value={calendarDate} onChange={(event) => setCalendarDate(event.target.value)} /></div>
            <div className="calendar-grid" style={{ gridTemplateColumns: `150px repeat(${Math.min(days.length, 31)}, minmax(30px, 1fr))` }}>
              <div className="calendar-label">Habitación</div>
              {days.map((day) => <div className="calendar-day" key={day}>{day}</div>)}
              {rooms.map((room) => (
                <div className="calendar-row" style={{ display: "contents" }} key={room.number}>
                  <strong>#{room.number}</strong>
                  {days.map((day) => {
                    const cell = `${calendarDate}-${String(day).padStart(2, "0")}`;
                    const booked = active.some((reservation) => reservation.roomNumber === room.number && reservation.checkIn <= cell && reservation.checkOut > cell);
                    return <span className={booked ? "booked" : room.status !== "Disponible" ? "blocked" : "free"} key={day}>{booked ? "R" : ""}</span>;
                  })}
                </div>
              ))}
            </div>
            <p className="legend"><span className="free"></span> Disponible <span className="booked"></span> Reserva <span className="blocked"></span> Estado no disponible</p>
            <small className="admin-calendar-note">Mostrando {monthStart} a {calendarDate}-{String(monthEnd).padStart(2, "0")}.</small>
          </section>
        )}

        {tab === "habitaciones" && (
          <section className="admin-section"><div className="admin-section-head"><div><span>INVENTARIO</span><h2>Gestionar habitaciones</h2></div></div>
            <div className="admin-room-grid">
              {rooms.map((room) => (
                <article key={room.number}>
                  <div><span>#{room.number}</span><b>{room.type}</b></div>
                  <p>{room.capacity} huéspedes · ${room.price}/noche</p>
                  <strong className={`admin-room-status ${room.status}`}>{room.status}</strong>
                  <select value={room.status} onChange={(event) => { setRoomStatus(room.number, event.target.value as any); refreshData(); }}>
                    <option>Disponible</option><option>Ocupada</option><option>Mantenimiento</option>
                  </select>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "pagos" && <PaymentTable reservations={active} onRefresh={refreshData} />}

        {tab === "operacion" && (
          <section className="admin-section"><div className="admin-section-head"><div><span>RECEPCIÓN</span><h2>Check-in / Check-out</h2></div></div>
            <div className="operation-list">
              {active.map((reservation) => (
                <article key={reservation.id}>
                  <div><small>{reservation.id}</small><strong>Habitación #{reservation.roomNumber}</strong><span>{reservation.guestName} · {reservation.checkIn} → {reservation.checkOut}</span><b>Estado: {reservation.operationStatus || "Reservada"}</b></div>
                  <div>
                    <button onClick={() => { updateOperationStatus(reservation.id, "Check-in"); refreshData(); }}>Check-in</button>
                    <button onClick={() => { updateOperationStatus(reservation.id, "Check-out"); refreshData(); }}>Check-out</button>
                    <button onClick={() => navigate(`/comprobante/${reservation.id}`)}>Comprobante</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "usuarios" && (
          <section className="admin-section"><div className="admin-section-head"><div><span>HUÉSPEDES</span><h2>Usuarios registrados</h2></div></div>
            <div className="user-list">
              {authRepository.getUsers().map((registeredUser) => (
                <article key={registeredUser.id}><strong>{registeredUser.name}</strong><span>{registeredUser.email}</span><b>{registeredUser.role}</b></article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function ConsultationsPanel({ consultations, onRefresh }: { consultations: Array<{ id: string; name: string; email: string; message: string; date: string; status: "Nueva" | "En revisión" | "Atendida" }>; onRefresh: () => void }) {
  return (
    <section className="admin-section">
      <div className="admin-section-head"><div><span>MENSAJES DE VISITANTES</span><h2>Consultas recibidas</h2></div><button className="admin-refresh" onClick={onRefresh}>Actualizar lista ↻</button></div>
      {consultations.length === 0 ? <div className="admin-empty"><h3>Aún no hay consultas</h3><p>Cuando una persona envíe el formulario de Contacto, su mensaje aparecerá aquí.</p></div> : (
        <div className="consultation-list">
          {consultations.map((item) => (
            <article className="consultation-card" key={item.id}>
              <div className="consultation-card__top"><div><span className="consultation-id">{item.id}</span><h3>{item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a></div><span className={`consultation-status ${item.status.replace(" ", "-")}`}>{item.status}</span></div>
              <p className="consultation-message">{item.message}</p>
              <div className="consultation-card__bottom"><small>{new Date(item.date).toLocaleString("es-BO", { dateStyle: "medium", timeStyle: "short" })}</small><label>Estado <select value={item.status} onChange={(event) => { updateConsultationStatus(item.id, event.target.value as "Nueva" | "En revisión" | "Atendida"); onRefresh(); }}><option>Nueva</option><option>En revisión</option><option>Atendida</option></select></label></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AdminTable({ title, reservations, onRefresh }: { title: string; reservations: any[]; onRefresh: () => void }) {
  return (
    <section className="admin-section">
      <div className="admin-section-head"><div><span>GESTIÓN</span><h2>{title}</h2></div></div>
      <div className="admin-table">
        {reservations.map((reservation) => (
          <article key={reservation.id}>
            <div><small>{reservation.id}</small><strong>#{reservation.roomNumber} · {reservation.guestName}</strong><span>{reservation.checkIn} → {reservation.checkOut} · {reservation.guests} huéspedes</span></div>
            <div><b>${reservation.total}</b><span>{reservation.paymentMethod || "No especificado"}</span><em className={reservation.paymentStatus}>{reservation.paymentStatus || "Pendiente"}</em></div>
            <div><button onClick={() => window.print()}>Comprobante</button>{reservation.status !== "Cancelada" && <button onClick={() => { updateReservationStatus(reservation.id, "Cancelada"); onRefresh(); }}>Cancelar</button>}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PaymentTable({ reservations, onRefresh }: { reservations: any[]; onRefresh: () => void }) {
  const statuses: PaymentStatus[] = ["Pagado", "Pendiente de verificación", "Pendiente", "Rechazado"];
  return (
    <section className="admin-section">
      <div className="admin-section-head"><div><span>FINANZAS</span><h2>Control de pagos</h2></div></div>
      <div className="admin-table">
        {reservations.map((reservation) => (
          <article key={reservation.id}>
            <div><small>{reservation.id}</small><strong>#{reservation.roomNumber} · {reservation.guestName}</strong><span>{reservation.paymentMethod || "No especificado"} · ${reservation.total}</span></div>
            <div><em className={reservation.paymentStatus}>{reservation.paymentStatus || "Pendiente"}</em>{reservation.paymentReference && <span>Ref.: {reservation.paymentReference}</span>}</div>
            <div><select value={reservation.paymentStatus || "Pendiente"} onChange={(event) => { updatePaymentStatus(reservation.id, event.target.value as PaymentStatus); onRefresh(); }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
