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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const user = authRepository.register({ name, carnet, password });

    if (!user) {
      setError(
        "No se pudo crear la cuenta. Comprueba los datos y verifica que el carnet no esté registrado.",
      );
      return;
    }

    navigate("/habitaciones", { replace: true });
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <button className="register-back" type="button" onClick={() => navigate("/")}>
          ← B&B Santa Cecilia Inc.
        </button>
        <span>B&B SANTA CECILIA INC. · NUEVA CUENTA</span>
        <h1>¡Te damos la bienvenida!</h1>
        <p>
          Cualquier visitante puede crear su propia cuenta para reservar
          habitaciones y consultar sus estancias. No necesitas una cuenta
          previamente creada por el hotel.
        </p>

        <form onSubmit={submit}>
          <label>
            Nombre completo
            <input
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Carnet / documento
            <input
              autoComplete="username"
              value={carnet}
              onChange={(event) => setCarnet(event.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete="new-password"
              minLength={4}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Confirmar contraseña
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </label>

          {error && <div className="register-error" role="alert">{error}</div>}

          <button className="register-submit" type="submit">
            Crear mi cuenta →
          </button>
        </form>

        <p className="register-login">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Inicia sesión
          </button>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
