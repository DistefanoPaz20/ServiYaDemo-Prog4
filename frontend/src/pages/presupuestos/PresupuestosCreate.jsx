
import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import useAuthStore from "../../store/authStore";
import useServiciosStore from "../../store/serviciosStore";
import usePresupuestosStore from "../../store/presupuestosStore";

import FormField from "../../components/forms/FormField";

function PresupuestoCreate() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const prestadorId = usuario?.perfilId;

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const agregarPresupuesto = usePresupuestosStore(
    (state) => state.agregarPresupuesto
  );

  const [formulario, setFormulario] = useState({
    servicioId: searchParams.get("servicioId") ?? "",
    descripcion: "",
    monto: ""
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const serviciosDisponibles = servicios.filter(
    (servicio) =>
      usuario?.rol === "prestador" &&
      prestadorId != null &&
      String(servicio.prestadorId) === String(prestadorId) &&
      servicio.estado === "Pendiente" &&
      !presupuestos.some(
        (presupuesto) =>
          String(presupuesto.servicioId) === String(servicio.id) &&
          presupuesto.estado !== "Rechazado"
      )
  );

  function manejarCambio(evento) {

    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function manejarSubmit(evento) {

    evento.preventDefault();

    if (guardando) return;

    setError("");

    const servicio = serviciosDisponibles.find(
      (servicio) =>
        String(servicio.id) === String(formulario.servicioId)
    );

    const monto = Number(formulario.monto);

    if (!servicio || !formulario.descripcion.trim()) {
      setError("Completá todos los campos.");
      return;
    }

    if (
      !Number.isFinite(monto) ||
      monto <= 0 ||
      monto > 9999999999.99 ||
      Math.abs(monto * 100 - Math.round(monto * 100)) > 0.001
    ) {
      setError("Ingresá un monto válido de hasta dos decimales.");
      return;
    }

    setGuardando(true);

    try {

      await agregarPresupuesto({
        servicioId: servicio.id,
        descripcion: formulario.descripcion.trim(),
        monto
      });

      navigate("/prestador/presupuestos");

    } catch (error) {

      setError(
        error.message || "No se pudo registrar el presupuesto."
      );

    } finally {

      setGuardando(false);

    }
  }

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Nuevo presupuesto</h2>
        <p>Prepará una propuesta para tu cliente.</p>
      </div>

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        {serviciosDisponibles.length === 0 && (
          <p className="panel-vacio">
            No tenés solicitudes disponibles para presupuestar.
          </p>
        )}

        <FormField
          label="Servicio"
          nombre="servicioId"
          tipo="select"
          valor={formulario.servicioId}
          onChange={manejarCambio}
          opciones={serviciosDisponibles.map(
            (servicio) => ({
              valor: servicio.id,
              texto: servicio.descripcion
            })
          )}
          requerido
        />

        <FormField
          label="Descripción del presupuesto"
          nombre="descripcion"
          valor={formulario.descripcion}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Monto en pesos"
          nombre="monto"
          tipo="number"
          valor={formulario.monto}
          onChange={manejarCambio}
          requerido
        />

        {error && (
          <p className="login-message" role="alert">
            {error}
          </p>
        )}

        <div className="crud-form-actions">

          <Link to="/prestador/presupuestos">
            Cancelar
          </Link>

          <button
            type="submit"
            className="perfil-boton"
            disabled={
              guardando ||
              serviciosDisponibles.length === 0
            }
          >
            {guardando
              ? "Enviando..."
              : "Enviar presupuesto"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default PresupuestoCreate;
