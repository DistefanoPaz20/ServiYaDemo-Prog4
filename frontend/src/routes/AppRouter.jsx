import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Páginas públicas
import Home from "../pages/public/Home";
import Servicios from "../pages/public/Servicios";
import ComoFunciona from "../pages/public/ComoFunciona";

// Autenticación
import Login from "../pages/auth/Login";
import Registro from "../pages/auth/Registro";

// Dashboards
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ClienteDashboard from "../pages/dashboard/ClienteDashboard";
import PrestadorDashboard from "../pages/dashboard/PrestadorDashboard";

// Clientes
import ClientesList from "../pages/clientes/ClientesList";
import ClienteCreate from "../pages/clientes/ClienteCreate";
import ClienteEdit from "../pages/clientes/ClienteEdit";

// Hogares
import HogaresList from "../pages/hogares/HogaresList";
import HogarCreate from "../pages/hogares/HogarCreate";
import HogarEdit from "../pages/hogares/HogarEdit";

// Oficios
import OficiosList from "../pages/oficios/OficiosList";
import OficioCreate from "../pages/oficios/OficioCreate";
import OficioEdit from "../pages/oficios/OficioEdit";

// Prestadores
import PrestadoresList from "../pages/prestadores/PrestadoresList";
import PrestadorCreate from "../pages/prestadores/PrestadorCreate";
import PrestadorEdit from "../pages/prestadores/PrestadorEdit";
import BuscarProfesionales from "../pages/prestadores/BuscarProfesionales";

// Servicios
import ServiciosList from "../pages/servicios/ServiciosList";
import ServicioCreate from "../pages/servicios/ServicioCreate";
import ServicioEdit from "../pages/servicios/ServicioEdit";

// Usuarios
import MiPerfil from "../pages/usuarios/MiPerfil";
import EditarPerfil from "../pages/usuarios/EditarPerfil";
import CambiarPassword from "../pages/usuarios/CambiarPassword";

// Presupuestos
import PresupuestosList from "../pages/presupuestos/PresupuestosList";
import PresupuestoCreate from "../pages/presupuestos/PresupuestosCreate";
import PresupuestoDetalle from "../pages/presupuestos/PresupuestosDetalle";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas publicas */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
        </Route>

        {/*autenticacion */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route element={<DashboardLayout />}>

          {/* admin*/}

          <Route path="/admin" element={<AdminDashboard />} />

          {/* Clientes */}

          <Route path="/admin/clientes" element={<ClientesList />} />
          <Route path="/admin/clientes/nuevo" element={<ClienteCreate />} />
          <Route path="/admin/clientes/editar/:id" element={<ClienteEdit />} />

          {/* Hogares */}

          <Route path="/admin/hogares" element={<HogaresList />} />
          <Route path="/admin/hogares/nuevo" element={<HogarCreate />} />
          <Route path="/admin/hogares/editar/:id" element={<HogarEdit />} />

          {/* Oficios */}

          <Route path="/admin/oficios" element={<OficiosList />} />
          <Route path="/admin/oficios/nuevo" element={<OficioCreate />} />
          <Route path="/admin/oficios/editar/:id" element={<OficioEdit />} />

          {/* Prestadores */}

          <Route path="/admin/prestadores" element={<PrestadoresList />} />
          <Route path="/admin/prestadores/nuevo" element={<PrestadorCreate />} />
          <Route path="/admin/prestadores/editar/:id" element={<PrestadorEdit />} />

          {/* Servicios */}

          <Route path="/admin/servicios" element={<ServiciosList />} />
          <Route path="/admin/servicios/nuevo" element={<ServicioCreate />} />
          <Route path="/admin/servicios/editar/:id" element={<ServicioEdit />} />

          {/* cliente*/}

          <Route path="/cliente" element={<ClienteDashboard />} />

          {/* Hogares del cliente */}

          <Route path="/cliente/hogares" element={<HogaresList />} />
          <Route path="/cliente/hogares/nuevo" element={<HogarCreate />} />
          <Route path="/cliente/hogares/editar/:id" element={<HogarEdit />} />

          {/* Buscar profesionales */}

          <Route path="/cliente/profesionales" element={<BuscarProfesionales />} />

          {/* Servicios del cliente */}

          <Route path="/cliente/servicios" element={<ServiciosList />} />
          <Route path="/cliente/servicios/nuevo" element={<ServicioCreate />} />

          {/* Presupuestos del cliente */}

          <Route path="/cliente/presupuestos" element={<PresupuestosList />} />
          <Route path="/cliente/presupuestos/:id" element={<PresupuestoDetalle />} />

          {/* Perfil del cliente */}

          <Route path="/cliente/perfil" element={<MiPerfil />} />
          <Route path="/cliente/perfil/editar" element={<EditarPerfil />} />
          <Route path="/cliente/perfil/password" element={<CambiarPassword />} />

          {/*Prestador*/}

          <Route path="/prestador" element={<PrestadorDashboard />} />

          {/* Solicitudes y trabajos */}

          <Route path="/prestador/solicitudes" element={<ServiciosList />} />
          <Route path="/prestador/trabajos" element={<ServiciosList />} />

          {/* Presupuestos del prestador */}

          <Route path="/prestador/presupuestos" element={<PresupuestosList />} />
          <Route path="/prestador/presupuestos/nuevo" element={<PresupuestoCreate />} />
          <Route path="/prestador/presupuestos/:id" element={<PresupuestoDetalle />} />

          {/* Perfil del prestador */}

          <Route path="/prestador/perfil" element={<MiPerfil />} />
          <Route path="/prestador/perfil/editar" element={<EditarPerfil />} />
          <Route path="/prestador/perfil/password" element={<CambiarPassword />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;