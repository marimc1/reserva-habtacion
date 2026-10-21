import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
  onRegister: () => void;
}

function LoginForm({ error, onSubmit, onRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return;

    onSubmit({ email: normalizedEmail, password });
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>

        <div>
          <label htmlFor="email">Correo electrónico / Gmail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ejemplo@gmail.com"
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button type="submit">Ingresar</button>

        <div className="login-register-prompt">
          <span>¿Aún no tienes una cuenta?</span>
          <button
            className="login-register-button"
            type="button"
            onClick={onRegister}
          >
            Crear cuenta <span aria-hidden="true">→</span>
          </button>
          <small>Regístrate en unos pasos y comienza a reservar.</small>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
