
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completá todos los campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresá un correo electrónico válido.");
      return;
    }

    // Próximamente enviaremos estos datos al backend.
    setError(
      "Formulario válido. Falta conectar la autenticación con el servidor."
    );
  }

  return (
    <section className="login-page">
      <div className="login-header">
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresá a tu cuenta de ServiYa.</p>
      </div>

      <form className="login-form" onSubmit={manejarSubmit}>
        <div className="login-field">
          <label htmlFor="login-email">Correo electrónico</label>

          <div className="login-input">
            <Mail size={19} />

            <input
              id="login-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
          </div>
        </div>

        <div className="login-field">
          <label htmlFor="login-password">Contraseña</label>

          <div className="login-input">
            <LockKeyhole size={19} />

            <input
              id="login-password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
            />

            <button
              type="button"
              className="login-toggle-password"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              aria-label={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {mostrarPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="login-message" role="status">
            {error}
          </p>
        )}

        <button type="submit" className="login-submit">
          Iniciar sesión
        </button>
      </form>

      <p className="login-register">
        ¿Todavía no tenés una cuenta?{" "}
        <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}

export default Login;
