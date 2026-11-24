import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  CircleUserRound,
  ArrowLeft
} from "lucide-react";

import Sidebar from "../components/common/Sidebar";

const titulos = {
  admin: "Panel de administración",
  cliente: "Panel del cliente",
  prestador: "Panel del prestador"
};

function DashboardLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const rol = location.pathname.split("/")[1];

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
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1>
              {titulos[rol] ?? "Panel de usuario"}
            </h1>

          </div>

          <div className="dashboard-topbar-right">

            <Link to="/" className="dashboard-home-link">
              <ArrowLeft size={18} />
              <span>Ir al inicio</span>
            </Link>

            <CircleUserRound
              size={30}
              className="dashboard-user-icon"
            />

          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;