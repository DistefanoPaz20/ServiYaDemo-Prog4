import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import Servicios from "../pages/public/Servicios";
import ComoFunciona from "../pages/public/ComoFunciona";

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;