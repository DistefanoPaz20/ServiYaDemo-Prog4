import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useClientesStore from "../../store/clientesStore";
import useOperacion from "../../hooks/useOperacion";

function ClienteEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const cliente = useClientesStore((state) =>
    state.clientes.find(
      (c) => String(c.id) === String(id)
    )
  );

  const editarCliente = useClientesStore(
    (state) => state.editarCliente
  );

  const { ejecutar, procesando, error } = useOperacion();

  const [formulario, setFormulario] = useState({
    nombre: cliente?.nombre ?? "",
    apellido: cliente?.apellido ?? "",
    email: cliente?.email ?? "",
    telefono: cliente?.telefono ?? ""
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
      editarCliente(id, formulario)
    );

    if (correcto) {
      navigate("/admin/clientes");
    }
  }

  if (!cliente) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Cliente no encontrado"
          descripcion="El cliente solicitado no existe."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/clientes")}
        >
          Volver al listado
        </Button>

      </section>
    );
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Editar cliente"
        descripcion="Modificá los datos del cliente seleccionado."
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
            {procesando ? "Guardando..." : "Guardar cambios"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default ClienteEdit;