import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import useAuthStore from "../store/authStore";

function ProtectedRoute({ roles }) {
  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const token = useAuthStore(
    (state) => state.token
  );

  const autenticado = useAuthStore(
    (state) => state.autenticado
  );

  const location = useLocation();

  if (!autenticado || !token || !usuario) {
    return (
      <Navigate
        to="/login"
        state={{ desde: location.pathname }}
        replace
      />
    );
  }

  if (
    !["admin", "cliente", "prestador"].includes(
      usuario.rol
    )
  ) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <Navigate
        to={`/${usuario.rol}`}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;