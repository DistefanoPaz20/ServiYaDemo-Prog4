import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useClientesStore from "../../store/clientesStore";
import useOperacion from "../../hooks/useOperacion";

function ClienteCreate() {
  const navigate = useNavigate();

  const agregarCliente = useClientesStore(
    (state) => state.agregarCliente
  );

  const { ejecutar, procesando, error } = useOperacion();

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: ""
  });

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function manejarSubmit(e) {
    e.preventDefault();

    const correcto = await ejecutar(() =>
      agregarCliente(formulario)
    );

    if (correcto) {
      navigate("/admin/clientes");
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo cliente"
        descripcion="Registrá un nuevo cliente en ServiYa."
      />

      <form className="crud-form" onSubmit={manejarSubmit}>

        <div className="crud-form-grid">

          <FormField
            label="Nombre"
            nombre="nombre"
            valor={formulario.nombre}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Apellido"
            nombre="apellido"
            valor={formulario.apellido}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Correo electrónico"
            nombre="email"
            tipo="email"
            valor={formulario.email}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Teléfono"
            nombre="telefono"
            tipo="tel"
            valor={formulario.telefono}
            onChange={manejarCambio}
            requerido
          />

        </div>

        {error && (
          <p className="crud-error" role="alert">
            {error}
          </p>
        )}

        <div className="crud-form-actions">

          <Button
            tipo="button"
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => {
              if (!procesando) navigate("/admin/clientes");
            }}
          >
            Cancelar
          </Button>

          <Button tipo="submit" icono={Save}>
            {procesando ? "Guardando..." : "Guardar cliente"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default ClienteCreate;