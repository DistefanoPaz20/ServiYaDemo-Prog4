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
    </Route>
  </Routes>
</BrowserRouter>

  );
}

export default AppRouter;