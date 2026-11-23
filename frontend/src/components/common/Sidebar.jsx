
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  House,
  Wrench,
  BriefcaseBusiness,
  ClipboardList
} from "lucide-react";

import logoServiYa from "../../assets/images/LogoServiYa.png";

const opciones = [
  {
    nombre: "Dashboard",
    ruta: "/admin",
    icono: LayoutDashboard
  },
  {
    nombre: "Clientes",
    ruta: "/admin/clientes",
    icono: Users
  },
  {
    nombre: "Hogares",
    ruta: "/admin/hogares",
    icono: House
  },
  {
    nombre: "Prestadores",
    ruta: "/admin/prestadores",
    icono: Wrench
  },
  {
    nombre: "Oficios",
    ruta: "/admin/oficios",
    icono: BriefcaseBusiness
  },
  {
    nombre: "Servicios",
    ruta: "/admin/servicios",
    icono: ClipboardList
  }
];

function Sidebar({ cerrarMenu }) {
  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-logo">
        <img src={logoServiYa} alt="ServiYa" />
      </div>

      <nav className="sidebar-nav" aria-label="Menú del administrador">
        {opciones.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.ruta === "/admin"}
              onClick={cerrarMenu}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "activo" : ""}`
              }
            >
              <Icono size={20} />
              <span>{opcion.nombre}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}

export default Sidebar;
