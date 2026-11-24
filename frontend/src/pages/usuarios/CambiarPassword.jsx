import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import FormField from "../../components/forms/FormField";

function CambiarPassword() {

  const location = useLocation();
  const rol = location.pathname.split("/")[1];

  const [formulario, setFormulario] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: ""
  });

  const [mensaje, setMensaje] = useState("");

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    setMensaje("");

    if (
      !formulario.passwordActual ||
      !formulario.passwordNueva ||
      !formulario.confirmarPassword
    ) {
      setMensaje("Completá todos los campos.");
      return;
    }

    if (formulario.passwordNueva.length < 8) {
      setMensaje(
        "La nueva contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (
      formulario.passwordNueva !==
      formulario.confirmarPassword
    ) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (
      formulario.passwordActual ===
      formulario.passwordNueva
    ) {
      setMensaje(
        "La nueva contraseña debe ser diferente a la actual."
      );
      return;
    }

    // Pendiente: enviar la solicitud al backend.

    setMensaje(
      "Datos válidos. El cambio de contraseña requiere conexión con el servidor."
    );
  }

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Cambiar contraseña</h2>
        <p>Administrá la seguridad de tu cuenta.</p>
      </div>

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        <FormField
          label="Contraseña actual"
          nombre="passwordActual"
          tipo="password"
          valor={formulario.passwordActual}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Nueva contraseña"
          nombre="passwordNueva"
          tipo="password"
          valor={formulario.passwordNueva}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Confirmar nueva contraseña"
          nombre="confirmarPassword"
          tipo="password"
          valor={formulario.confirmarPassword}
          onChange={manejarCambio}
          requerido
        />

        {mensaje && (
          <p className="login-message" role="status">
            {mensaje}
          </p>
        )}

        <div className="crud-form-actions">

          <Link to={`/${rol}/perfil`}>
            Cancelar
          </Link>

          <button
            type="submit"
            className="perfil-boton"
          >
            Cambiar contraseña
          </button>

        </div>

      </form>

    </section>
  );
}

export default CambiarPassword;