import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    const user = authRepository.register({ name, carnet, password });
    if (!user) return setError("No se pudo crear la cuenta. Verifica los datos o usa otro carnet.");
    navigate("/habitaciones", { replace: true });
  };
  return <main className="register-page"><section className="register-card"><button className="register-back" onClick={() => navigate("/")}>← Hotel Rolex</button><span>HOTEL ROLEX · NUEVA CUENTA</span><h1>Regístrate.</h1><p>Crea tu cuenta para reservar habitaciones y consultar tus estancias.</p><form onSubmit={submit}><label>Nombre completo<input value={name} onChange={e=>setName(e.target.value)} required /></label><label>Carnet / documento<input value={carnet} onChange={e=>setCarnet(e.target.value)} required /></label><label>Contraseña<input type="password" minLength={4} value={password} onChange={e=>setPassword(e.target.value)} required /></label><label>Confirmar contraseña<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required /></label>{error && <div className="register-error">⚠ {error}</div>}<button className="register-submit">Crear cuenta →</button></form><p className="register-login">¿Ya tienes cuenta? <button onClick={()=>navigate("/login")}>Inicia sesión</button></p></section></main>;
}
export default RegisterPage;
