import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  House,
  Wrench,
  BriefcaseBusiness,
  ClipboardList,
  UserRound,
  FileText,
  Search
} from "lucide-react";

import logoServiYa from "../../assets/images/LogoServiYa.png";

const opcionesAdmin = [
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

const opcionesCliente = [
  {
    nombre: "Dashboard",
    ruta: "/cliente",
    icono: LayoutDashboard
  },
  {
    nombre: "Mis hogares",
    ruta: "/cliente/hogares",
    icono: House
  },
  {
    nombre: "Buscar profesionales",
    ruta: "/cliente/profesionales",
    icono: Search
  },
  {
    nombre: "Mis servicios",
    ruta: "/cliente/servicios",
    icono: ClipboardList
  },
  {
    nombre: "Mis presupuestos",
    ruta: "/cliente/presupuestos",
    icono: FileText
  },
  {
    nombre: "Mi perfil",
    ruta: "/cliente/perfil",
    icono: UserRound
  }
];

const opcionesPrestador = [
  {
    nombre: "Dashboard",
    ruta: "/prestador",
    icono: LayoutDashboard
  },
  {
    nombre: "Solicitudes",
    ruta: "/prestador/solicitudes",
    icono: ClipboardList
  },
  {
    nombre: "Mis presupuestos",
    ruta: "/prestador/presupuestos",
    icono: FileText
  },
  {
    nombre: "Mis trabajos",
    ruta: "/prestador/trabajos",
    icono: Wrench
  },
  {
    nombre: "Mi perfil",
    ruta: "/prestador/perfil",
    icono: UserRound
  }
];

const menus = {
  admin: opcionesAdmin,
  cliente: opcionesCliente,
  prestador: opcionesPrestador
};

function Sidebar({ cerrarMenu, rol = "admin" }) {

  const opciones = menus[rol] ?? [];

  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-logo">
        <img src={logoServiYa} alt="ServiYa" />
      </div>

      <nav
        className="sidebar-nav"
        aria-label={`Menú de ${rol}`}
      >
        {opciones.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.ruta === `/${rol}`}
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