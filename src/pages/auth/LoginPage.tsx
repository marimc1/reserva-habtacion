import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  if (authRepository.isAuthenticated()) {
    return <Navigate to={redirect} replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    navigate(redirect, { replace: true });
  };

  return (
    <main>
      <LoginForm error={error} onSubmit={handleLogin} />
    </main>
  );
}

export default LoginPage;
