
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";
import useClientesStore from "../../store/clientesStore";

function ClienteCreate() {
  const navigate = useNavigate();

  const agregarCliente = useClientesStore(
    (state) => state.agregarCliente
  );

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

  function manejarSubmit(e) {
    e.preventDefault();

    agregarCliente(formulario);

    navigate("/admin/clientes");
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo cliente"
        descripcion="Registrá un nuevo cliente en ServiYa."
      />

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        <div className="crud-form-grid">

          <FormField
            label="Nombre"
            nombre="nombre"
            valor={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ingresá el nombre"
            requerido
          />

          <FormField
            label="Apellido"
            nombre="apellido"
            valor={formulario.apellido}
            onChange={manejarCambio}
            placeholder="Ingresá el apellido"
            requerido
          />

          <FormField
            label="Correo electrónico"
            nombre="email"
            tipo="email"
            valor={formulario.email}
            onChange={manejarCambio}
            placeholder="cliente@ejemplo.com"
            requerido
          />

          <FormField
            label="Teléfono"
            nombre="telefono"
            tipo="tel"
            valor={formulario.telefono}
            onChange={manejarCambio}
            placeholder="381..."
            requerido
          />

        </div>

        <div className="crud-form-actions">

          <Button
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => navigate("/admin/clientes")}
          >
            Cancelar
          </Button>

          <Button
            tipo="submit"
            icono={Save}
          >
            Guardar cliente
          </Button>

        </div>

      </form>

    </section>
  );
}

export default ClienteCreate;
