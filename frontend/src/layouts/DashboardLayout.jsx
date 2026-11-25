import { useState, useEffect } from "react";

import {
  Link,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  Menu,
  X,
  CircleUserRound,
  ArrowLeft,
  LogOut
} from "lucide-react";

import Sidebar from "../components/common/Sidebar";

import useAuthStore from "../store/authStore";

import {
  cargarDatos,
  limpiarDatos
} from "../store/cargarDatos";

const titulos = {
  admin: "Panel de administración",
  cliente: "Panel del cliente",
  prestador: "Panel del prestador"
};

function DashboardLayout() {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [reintento, setReintento] = useState(0);

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const token = useAuthStore(
    (state) => state.token
  );

  const cerrarSesion = useAuthStore(
    (state) => state.cerrarSesion
  );

  const rol = usuario?.rol;

  useEffect(() => {
    let activo = true;

    limpiarDatos();

    async function iniciarDashboard() {
      setCargando(true);
      setError("");

      try {
        await cargarDatos(rol);

      } catch (error) {
        if (activo) {
          setError(error.message);
        }

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    if (rol && token) {
      iniciarDashboard();
    }

    return () => {
      activo = false;
      limpiarDatos();
    };

  }, [rol, token, reintento]);

  function manejarCerrarSesion() {
    cerrarSesion();
    limpiarDatos();

    navigate("/login", {
      replace: true
    });
  }

  return (
    <div className="dashboard-layout">

      <div
        className={`dashboard-sidebar-wrapper ${
          menuAbierto ? "abierto" : ""
        }`}
      >

        <Sidebar
          rol={rol}
          cerrarMenu={() => setMenuAbierto(false)}
        />

      </div>

      {menuAbierto && (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="dashboard-topbar-left">

            <button
              type="button"
              className="dashboard-menu-button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={
                menuAbierto
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
            >

              {menuAbierto
                ? <X size={24} />
                : <Menu size={24} />
              }

            </button>

            <h1>
              {titulos[rol] ?? "Panel de usuario"}
            </h1>

          </div>

          <div className="dashboard-topbar-right">

            <Link
              to="/"
              className="dashboard-home-link"
            >
              <ArrowLeft size={18} />
              <span>Ir al inicio</span>
            </Link>

            <div className="dashboard-user-info">

              <CircleUserRound
                size={30}
                className="dashboard-user-icon"
              />

              <span className="dashboard-user-name">
                {usuario?.nombre}
              </span>

            </div>

            <button
              type="button"
              className="dashboard-logout-button"
              onClick={manejarCerrarSesion}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>

          </div>

        </header>

        <main className="dashboard-content">

          {cargando ? (

            <div className="dashboard-loading">
              <div className="dashboard-spinner" />

              <h3>Cargando información...</h3>

              <p>
                Obteniendo los datos de ServiYa.
              </p>
            </div>

          ) : error ? (

            <div className="dashboard-error">

              <h3>No se pudieron cargar los datos</h3>

              <p>{error}</p>

              <button
                type="button"
                className="dashboard-retry-button"
                onClick={() =>
                  setReintento((valor) => valor + 1)
                }
              >
                Reintentar
              </button>

            </div>

          ) : (

            <Outlet />

          )}

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;