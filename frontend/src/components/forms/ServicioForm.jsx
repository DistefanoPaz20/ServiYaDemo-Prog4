
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import FormField from "./FormField";
import Button from "../ui/Button";

import useHogaresStore from "../../store/hogaresStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useClientesStore from "../../store/clientesStore";
import useOficiosStore from "../../store/crearOficiosStore";

function ServicioForm({
  servicioInicial,
  onGuardar,
  textoBoton
}) {
  const navigate = useNavigate();

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const [formulario, setFormulario] = useState({
    hogarId: servicioInicial?.hogarId ?? "",
    prestadorId: servicioInicial?.prestadorId ?? "",
    descripcion: servicioInicial?.descripcion ?? "",
    fecha: servicioInicial?.fecha ?? "",
    precio: servicioInicial?.precio ?? "",
    estado: servicioInicial?.estado ?? "Pendiente"
  });

  const opcionesHogares = hogares.map((hogar) => {
    const cliente = clientes.find(
      (c) => String(c.id) === String(hogar.clienteId)
    );

    return {
      valor: hogar.id,
      texto: `${hogar.direccion} - ${
        cliente
          ? `${cliente.nombre} ${cliente.apellido}`
          : "Sin propietario"
      }`
    };
  });

  const opcionesPrestadores = prestadores
    .filter(
      (prestador) =>
        prestador.estado === "Activo" ||
        String(prestador.id) ===
          String(servicioInicial?.prestadorId)
    )
    .map((prestador) => {
      const oficio = oficios.find(
        (o) => String(o.id) === String(prestador.oficioId)
      );

      return {
        valor: prestador.id,
        texto: `${prestador.nombre} ${prestador.apellido} - ${
          oficio?.nombre ?? "Sin oficio"
        }`
      };
    });

  const opcionesEstados = [
    { valor: "Pendiente", texto: "Pendiente" },
    { valor: "En proceso", texto: "En proceso" },
    { valor: "Finalizado", texto: "Finalizado" },
    { valor: "Cancelado", texto: "Cancelado" }
  ];

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function manejarSubmit(e) {
    e.preventDefault();

    const hogarExiste = hogares.some(
      (hogar) =>
        String(hogar.id) === String(formulario.hogarId)
    );

    const prestadorValido = opcionesPrestadores.some(
      (prestador) =>
        String(prestador.valor) ===
          String(formulario.prestadorId)
    );

    if (!hogarExiste || !prestadorValido) {
      alert("Seleccioná un hogar y un prestador válidos.");
      return;
    }

    const precio = Number(formulario.precio);

    if (
      String(formulario.precio).trim() === "" ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      alert("Ingresá un precio válido.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      alert("Ingresá una descripción del servicio.");
      return;
    }

    if (!formulario.fecha) {
      alert("Seleccioná una fecha.");
      return;
    }

    onGuardar({
      ...formulario,
      descripcion: formulario.descripcion.trim(),
      precio
    });
  }

  return (
    <form
      className="crud-form"
      onSubmit={manejarSubmit}
    >

      <div className="crud-form-grid">

        <FormField
          label="Hogar"
          nombre="hogarId"
          tipo="select"
          opciones={opcionesHogares}
          valor={formulario.hogarId}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Prestador"
          nombre="prestadorId"
          tipo="select"
          opciones={opcionesPrestadores}
          valor={formulario.prestadorId}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Fecha del servicio"
          nombre="fecha"
          tipo="date"
          valor={formulario.fecha}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Precio ($)"
          nombre="precio"
          tipo="number"
          valor={formulario.precio}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Estado"
          nombre="estado"
          tipo="select"
          opciones={opcionesEstados}
          valor={formulario.estado}
          onChange={manejarCambio}
          requerido
        />

        <div className="crud-form-full">

          <FormField
            label="Descripción del servicio"
            nombre="descripcion"
            tipo="textarea"
            valor={formulario.descripcion}
            onChange={manejarCambio}
            placeholder="Describí el trabajo solicitado..."
            requerido
          />

        </div>

      </div>

      <div className="crud-form-actions">

        <Button
          tipo="button"
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/servicios")}
        >
          Cancelar
        </Button>

        <Button
          tipo="submit"
          icono={Save}
        >
          {textoBoton}
        </Button>

      </div>

    </form>
  );
}

export default ServicioForm;
