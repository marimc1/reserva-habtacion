import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    const user = authRepository.register({ name, email, password });

    if (!user) {
      setError(
        "No se pudo crear la cuenta. Revisa el correo y comprueba que no esté registrado.",
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
          Crea tu cuenta con tu correo electrónico para reservar habitaciones
          y consultar tus estancias. No necesitas que el hotel registre tus datos previamente.
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
            Correo electrónico / Gmail
            <input
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
