
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import ServicioForm from "../../components/forms/ServicioForm";

import useServiciosStore from "../../store/serviciosStore";

function ServicioCreate() {
  const navigate = useNavigate();

  const agregarServicio = useServiciosStore(
    (state) => state.agregarServicio
  );

  function manejarGuardar(datos) {
    agregarServicio(datos);

    navigate("/admin/servicios");
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo servicio"
        descripcion="Registrá un nuevo trabajo solicitado en ServiYa."
      />

      <ServicioForm
        onGuardar={manejarGuardar}
        textoBoton="Guardar servicio"
      />

    </section>
  );
}

export default ServicioCreate;
