import { useState, useEffect } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  House,
  Wrench,
  Phone,
  Briefcase
} from "lucide-react";

import api from "../../services/api";
import authService from "../../services/authService";

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [rol, setRol] = useState("cliente");

  const [oficios, setOficios] = useState([]);
  const [oficioId, setOficioId] = useState("");
  const [experiencia, setExperiencia] = useState("0");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorOficios, setErrorOficios] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarOficios() {
      try {
        const datos = await api("/oficios", {
          autenticado: false
        });

        if (activo) {
          setOficios(datos);
        }

      } catch (error) {
        if (activo) {
          setErrorOficios(error.message);
        }
      }
    }

    cargarOficios();

    return () => {
      activo = false;
    };
  }, []);

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (cargando) return;

    setMensaje("");

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !telefono.trim() ||
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

    if (rol === "prestador") {
      if (!oficioId) {
        setMensaje("Seleccioná un oficio.");
        return;
      }

      if (
        experiencia === "" ||
        !Number.isInteger(Number(experiencia)) ||
        Number(experiencia) < 0 ||
        Number(experiencia) > 100
      ) {
        setMensaje("Ingresá una experiencia válida.");
        return;
      }
    }

    const datosRegistro = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol,

      ...(rol === "prestador" && {
        oficioId: Number(oficioId),
        experiencia: Number(experiencia)
      })
    };

    try {
      setCargando(true);

      await authService.registro(datosRegistro);

      navigate("/login", {
        replace: true
      });

    } catch (error) {
      setMensaje(error.message);

    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="registro-page">

      <div className="registro-header">
        <h2>Crear una cuenta</h2>
        <p>Unite a ServiYa y comenzá hoy.</p>
      </div>

      <form
        className="registro-form"
        onSubmit={manejarSubmit}
        noValidate
      >

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

          <label htmlFor="registro-nombre">Nombre</label>

          <div className="registro-input">
            <UserRound size={19} />

            <input
              id="registro-nombre"
              type="text"
              placeholder="Ingresá tu nombre"
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

        </div>

        <div className="registro-field">

          <label htmlFor="registro-apellido">Apellido</label>

          <div className="registro-input">
            <UserRound size={19} />

            <input
              id="registro-apellido"
              type="text"
              placeholder="Ingresá tu apellido"
              autoComplete="family-name"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

        </div>

        <div className="registro-field">

          <label htmlFor="registro-telefono">Teléfono</label>

          <div className="registro-input">
            <Phone size={19} />

            <input
              id="registro-telefono"
              type="tel"
              placeholder="381 555 5555"
              autoComplete="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

        </div>

        <div className="registro-field">

          <label htmlFor="registro-email">
            Correo electrónico
          </label>

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

        {rol === "prestador" && (
          <>

            <div className="registro-field">

              <label htmlFor="registro-oficio">
                Oficio o especialidad
              </label>

              <div className="registro-input">
                <Wrench size={19} />

                <select
                  id="registro-oficio"
                  value={oficioId}
                  onChange={(e) => setOficioId(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    color: "inherit"
                  }}
                >
                  <option value="">
                    Seleccioná un oficio
                  </option>

                  {oficios.map((oficio) => (
                    <option
                      key={oficio.id}
                      value={oficio.id}
                    >
                      {oficio.nombre}
                    </option>
                  ))}

                </select>

              </div>

              {errorOficios && (
                <p className="registro-message">
                  {errorOficios}
                </p>
              )}

            </div>

            <div className="registro-field">

              <label htmlFor="registro-experiencia">
                Años de experiencia
              </label>

              <div className="registro-input">
                <Briefcase size={19} />

                <input
                  id="registro-experiencia"
                  type="number"
                  min="0"
                  max="100"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                />
              </div>

            </div>

          </>
        )}

        <div className="registro-field">

          <label htmlFor="registro-password">
            Contraseña
          </label>

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
              onClick={() =>
                setMostrarPassword(!mostrarPassword)
              }
              aria-label={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {mostrarPassword
                ? <EyeOff size={19} />
                : <Eye size={19} />
              }
            </button>

          </div>

        </div>

        <div className="registro-field">

          <label htmlFor="registro-confirmar">
            Confirmar contraseña
          </label>

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
          <p className="registro-message" role="alert">
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          className="registro-submit"
          disabled={cargando}
        >
          {cargando
            ? "Creando cuenta..."
            : "Crear cuenta"
          }
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