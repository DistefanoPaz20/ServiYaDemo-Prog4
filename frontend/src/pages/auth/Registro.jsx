
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  House,
  Wrench
} from "lucide-react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function manejarSubmit(evento) {
    evento.preventDefault();
    setMensaje("");

    if (
      !nombre.trim() ||
      !email.trim() ||
      !password ||
      !confirmarPassword
    ) {
      setMensaje("Completá todos los campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMensaje("Ingresá un correo electrónico válido.");
      return;
    }

    if (password.length < 8) {
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    // Más adelante enviaremos estos datos al backend.
    const datosRegistro = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol
    };

    // Nunca mostramos ni guardamos la contraseña en consola.
    setMensaje(
      `Datos válidos para el rol ${datosRegistro.rol}. ` +
      "Falta conectar el registro con el servidor."
    );
  }

  return (
    <section className="registro-page">
      <div className="registro-header">
        <h2>Crear una cuenta</h2>
        <p>Unite a ServiYa y comenzá hoy.</p>
      </div>

      <form className="registro-form" onSubmit={manejarSubmit} noValidate>

        <div className="registro-field">
          <label>¿Cómo querés utilizar ServiYa?</label>

          <div className="registro-roles">
            <button
              type="button"
              className={`registro-rol ${rol === "cliente" ? "activo" : ""}`}
              onClick={() => setRol("cliente")}
              aria-pressed={rol === "cliente"}
            >
              <House size={26} />
              <strong>Cliente</strong>
              <span>Busco profesionales</span>
            </button>

            <button
              type="button"
              className={`registro-rol ${rol === "prestador" ? "activo" : ""}`}
              onClick={() => setRol("prestador")}
              aria-pressed={rol === "prestador"}
            >
              <Wrench size={26} />
              <strong>Prestador</strong>
              <span>Ofrezco mis servicios</span>
            </button>
          </div>
        </div>

        <div className="registro-field">
          <label htmlFor="registro-nombre">Nombre completo</label>
          <div className="registro-input">
            <UserRound size={19} />
            <input
              id="registro-nombre"
              type="text"
              placeholder="Ingresá tu nombre"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </div>

        <div className="registro-field">
          <label htmlFor="registro-email">Correo electrónico</label>
          <div className="registro-input">
            <Mail size={19} />
            <input
              id="registro-email"
              type="email"
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="registro-field">
          <label htmlFor="registro-password">Contraseña</label>
          <div className="registro-input">
            <LockKeyhole size={19} />
            <input
              id="registro-password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="registro-toggle-password"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <div className="registro-field">
          <label htmlFor="registro-confirmar">Confirmar contraseña</label>
          <div className="registro-input">
            <LockKeyhole size={19} />
            <input
              id="registro-confirmar"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
          </div>
        </div>

        {mensaje && (
          <p className="registro-message" role="status">
            {mensaje}
          </p>
        )}

        <button type="submit" className="registro-submit">
          Crear cuenta
        </button>
      </form>

      <p className="registro-login">
        ¿Ya tenés una cuenta?{" "}
        <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}

export default Registro;
