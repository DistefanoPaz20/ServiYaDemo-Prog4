const express = require("express");
const pool = require("../config/db");

const crearModeloCrud = require("../models/crud.model");

const crearControladorCrud = require(
  "../controllers/crud.controller"
);

const router = express.Router();

const modelo = crearModeloCrud("servicios");

const autenticar = require(
  "../middlewares/auth.middleware"
);

const autorizarRoles = require(
  "../middlewares/roles.middleware"
);

const {
  servicioPropio,
  validarSolicitudCliente
} = require("../middlewares/permisos.middleware");

function validarServicio(datos) {
  const hogarId = Number(datos.hogarId);

  const prestadorId = Number(datos.prestadorId);

  const descripcion = typeof datos.descripcion === "string"
    ? datos.descripcion.trim()
    : "";

  const fecha = datos.fecha;

  const precio = Number(datos.precio);

  const estado = datos.estado;

  const estadosPermitidos = [
    "Pendiente",
    "En proceso",
    "Finalizado",
    "Cancelado"
  ];

  if (
    !Number.isSafeInteger(hogarId) ||
    hogarId <= 0 ||
    hogarId > 2147483647
  ) {
    return {
      error: "Debe seleccionar un hogar valido"
    };
  }

  if (
    !Number.isSafeInteger(prestadorId) ||
    prestadorId <= 0 ||
    prestadorId > 2147483647
  ) {
    return {
      error: "Debe seleccionar un prestador valido"
    };
  }

  if (!descripcion || descripcion.length > 10000) {
    return {
      error: "Descripcion no valida"
    };
  }

  if (
    typeof fecha !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
  ) {
    return {
      error: "Fecha no valida"
    };
  }

  const fechaObj = new Date(`${fecha}T00:00:00Z`);

  if (
    Number.isNaN(fechaObj.getTime()) ||
    fechaObj.toISOString().slice(0, 10) !== fecha
  ) {
    return {
      error: "Fecha no valida"
    };
  }

  if (
    datos.precio === "" ||
    datos.precio == null ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    precio > 9999999999.99
  ) {
    return {
      error: "Precio no valido"
    };
  }

  if (!estadosPermitidos.includes(estado)) {
    return {
      error: "Estado no valido"
    };
  }

  return {
    datos: {
      hogarId,
      prestadorId,
      descripcion,
      fecha,
      precio,
      estado
    }
  };
}

const controlador = crearControladorCrud(
  modelo,
  validarServicio,
  "Servicio"
);

async function verificarPrestador(req, res, next) {
  try {
    const resultado = validarServicio(req.body || {});

    if (resultado.error) {
      return res.status(400).json({
        message: resultado.error
      });
    }

    const { prestadorId } = resultado.datos;

    const [rows] = await pool.execute(
      `SELECT id, estado
       FROM prestadores
       WHERE id = ?`,
      [prestadorId]
    );

    if (!rows.length) {
      return res.status(400).json({
        message: "Prestador no encontrado"
      });
    }

    if (req.method === "PUT") {
      const servicio = await modelo.obtenerPorId(
        req.params.id
      );

      if (!servicio) {
        return res.status(404).json({
          message: "Servicio no encontrado"
        });
      }

      const [presupuestos] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM presupuestos
         WHERE servicioId = ?`,
        [servicio.id]
      );

      if (presupuestos[0].total > 0) {
        const datos = resultado.datos;

        if (
          Number(servicio.hogarId) !== datos.hogarId ||
          Number(servicio.prestadorId) !== datos.prestadorId ||
          Number(servicio.precio) !== datos.precio ||
          servicio.estado !== datos.estado
        ) {
          return res.status(409).json({
            message: "El servicio tiene presupuestos asociados. Utilice las operaciones correspondientes"
          });
        }
      }

      if (
        Number(servicio.prestadorId) === prestadorId
      ) {
        return next();
      }
    }

    if (rows[0].estado !== "Activo") {
      return res.status(409).json({
        message: "El prestador se encuentra inactivo"
      });
    }

    next();

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
}

const Servicio = require("../models/servicios.model");

router.use(autenticar);

router.get("/", async (req, res, next) => {
  try {
    if (req.usuario.rol === "admin") {
      return controlador.listar(req, res);
    }

    if (req.usuario.rol === "cliente") {
      const [rows] = await pool.execute(
        `SELECT s.*
         FROM servicios s
         INNER JOIN hogares h ON h.id = s.hogarId
         WHERE h.clienteId = ?
         ORDER BY s.id DESC`,
        [req.usuario.perfilId]
      );

      return res.json(rows);
    }

    if (req.usuario.rol === "prestador") {
      const [rows] = await pool.execute(
        `SELECT * FROM servicios
         WHERE prestadorId = ?
         ORDER BY id DESC`,
        [req.usuario.perfilId]
      );

      return res.json(rows);
    }

    res.status(403).json({
      message: "Acceso denegado"
    });

  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  servicioPropio,
  controlador.obtenerPorId
);

router.post(
  "/",
  autorizarRoles("admin", "cliente"),
  validarSolicitudCliente,
  verificarPrestador,
  controlador.crear
);

router.put(
  "/:id",
  autorizarRoles("admin"),
  verificarPrestador,
  controlador.actualizar
);

router.delete(
  "/:id",
  autorizarRoles("admin"),
  controlador.eliminar
);

router.patch(
  "/:id/estado",
  autorizarRoles("admin", "cliente", "prestador"),
  servicioPropio,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body || {};

      if (
        !/^\d+$/.test(id) ||
        !Number.isSafeInteger(Number(id)) ||
        Number(id) <= 0 ||
        Number(id) > 2147483647
      ) {
        return res.status(400).json({
          message: "ID no valido"
        });
      }

      if (!["Cancelado", "Finalizado"].includes(estado)) {
        return res.status(400).json({
          message: "Estado no valido"
        });
      }

      if (
        req.usuario.rol === "cliente" &&
        estado !== "Cancelado"
      ) {
        return res.status(403).json({
          message: "El cliente solo puede cancelar solicitudes"
        });
      }

      if (
        req.usuario.rol === "prestador" &&
        estado !== "Finalizado"
      ) {
        return res.status(403).json({
          message: "El prestador solo puede finalizar trabajos"
        });
      }

      const servicio = await Servicio.cambiarEstado(
        id,
        estado
      );

      res.json(servicio);

    } catch (error) {
      console.error(error.message);

      res.status(error.status || 500).json({
        message: error.status
          ? error.message
          : "Error interno del servidor"
      });
    }
  }
);

module.exports = router;