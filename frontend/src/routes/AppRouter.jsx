import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import Servicios from "../pages/public/Servicios";
import ComoFunciona from "../pages/public/ComoFunciona";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Registro from "../pages/auth/Registro";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ClientesList from "../pages/clientes/ClientesList";
import ClienteCreate from "../pages/clientes/ClienteCreate";
import ClienteEdit from "../pages/clientes/ClienteEdit";
import HogaresList from "../pages/hogares/HogaresList";
import HogarCreate from "../pages/hogares/HogarCreate";
import HogarEdit from "../pages/hogares/HogarEdit";
import OficiosList from "../pages/oficios/OficiosList";
import OficioCreate from "../pages/oficios/OficioCreate";
import OficioEdit from "../pages/oficios/OficioEdit";
import PrestadoresList from "../pages/prestadores/PrestadoresList";
import PrestadorCreate from "../pages/prestadores/PrestadorCreate";
import PrestadorEdit from "../pages/prestadores/PrestadorEdit";

function AppRouter() {
  return (

<BrowserRouter>
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route
        path="/como-funciona"
        element={<ComoFunciona />}
      />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Route>

    <Route element={<DashboardLayout/>}>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/admin/clientes" element={<ClientesList/>}/>
      <Route path="/admin/clientes/nuevo" element={<ClienteCreate/>}/>
      <Route path="/admin/clientes/editar/:id" element={<ClienteEdit/>}/>
      <Route path="/admin/hogares" element={<HogaresList/>}/>
      <Route path="/admin/hogares/nuevo" element={<HogarCreate/>}/>
      <Route path="/admin/hogares/editar/:id" element={<HogarEdit/>}/>
      <Route path="/admin/oficios" element={<OficiosList/>}/>
      <Route path="/admin/oficios/nuevo" element={<OficioCreate/>}/>
      <Route path="/admin/oficios/editar/:id" element={<OficioEdit/>}/>
      <Route path="/admin/prestadores" element={<PrestadoresList/>}/>
      <Route path="/admin/prestadores/nuevo" element={<PrestadorCreate/>}/>
      <Route path="/admin/prestadores/editar/:id" element={<PrestadorEdit/>}/>




    </Route>
  </Routes>
</BrowserRouter>

  );
}

export default AppRouter;