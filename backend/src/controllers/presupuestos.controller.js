const Presupuesto = require(
  "../models/presupuestos.model"
);

function idValido(id) {
  return /^\d+$/.test(String(id)) &&
    Number.isSafeInteger(Number(id)) &&
    Number(id) > 0 &&
    Number(id) <= 2147483647;
}

function manejarError(error, res) {
  console.error(error.message);

  if (error.status) {
    return res.status(error.status).json({
      message: error.message
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor"
  });
}

async function listar(req, res) {
  try {
    const presupuestos = await Presupuesto.listar();

    res.json(presupuestos);

  } catch (error) {
    manejarError(error, res);
  }
}

async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const presupuesto =
      await Presupuesto.obtenerPorId(id);

    if (!presupuesto) {
      return res.status(404).json({
        message: "Presupuesto no encontrado"
      });
    }

    res.json(presupuesto);

  } catch (error) {
    manejarError(error, res);
  }
}

async function crear(req, res) {
  try {
    const datos = req.body || {};

    const servicioId = Number(datos.servicioId);

    const descripcion =
      typeof datos.descripcion === "string"
        ? datos.descripcion.trim()
        : "";

    const monto = Number(datos.monto);

    if (!idValido(datos.servicioId)) {
      return res.status(400).json({
        message: "Servicio no valido"
      });
    }

    if (!descripcion || descripcion.length > 10000) {
      return res.status(400).json({
        message: "Descripcion no valida"
      });
    }

    if (
      datos.monto == null ||
      datos.monto === "" ||
      !Number.isFinite(monto) ||
      monto <= 0 ||
      monto > 9999999999.99 ||
      Math.abs(monto * 100 - Math.round(monto * 100)) > 0.0001
    ) {
      return res.status(400).json({
        message: "Monto no valido"
      });
    }

    const presupuesto = await Presupuesto.crear({
      servicioId,
      descripcion,
      monto
    });

    res.status(201).json(presupuesto);

  } catch (error) {
    manejarError(error, res);
  }
}

async function cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};

    if (!idValido(id)) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    if (!["Aceptado", "Rechazado"].includes(estado)) {
      return res.status(400).json({
        message: "Estado no valido"
      });
    }

    const presupuesto =
      await Presupuesto.cambiarEstado(id, estado);

    res.json(presupuesto);

  } catch (error) {
    manejarError(error, res);
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  cambiarEstado
};