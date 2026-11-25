const express = require("express");
const pool = require("../config/db");

const crearModeloCrud = require("../models/crud.model");
const crearControladorCrud = require(
  "../controllers/crud.controller"
);

const autenticar = require(
  "../middlewares/auth.middleware"
);

const autorizarRoles = require(
  "../middlewares/roles.middleware"
);

const {
  hogarPropio,
  asignarCliente
} = require("../middlewares/permisos.middleware");

const router = express.Router();

const modelo = crearModeloCrud("hogares");

function validarHogar(datos) {
  const clienteId = Number(datos.clienteId);

  const direccion = typeof datos.direccion === "string"
    ? datos.direccion.trim()
    : "";

  const localidad = typeof datos.localidad === "string"
    ? datos.localidad.trim()
    : "";

  const tipo = datos.tipo;

  const descripcion = typeof datos.descripcion === "string"
    ? datos.descripcion.trim()
    : "";

  const tiposPermitidos = [
    "Casa",
    "Departamento",
    "Duplex",
    "Otro"
  ];

  if (
    !Number.isSafeInteger(clienteId) ||
    clienteId <= 0 ||
    clienteId > 2147483647
  ) {
    return {
      error: "Debe seleccionar un cliente valido"
    };
  }

  if (!direccion || !localidad) {
    return {
      error: "La direccion y la localidad son obligatorias"
    };
  }

  if (
    direccion.length > 255 ||
    localidad.length > 100 ||
    descripcion.length > 10000
  ) {
    return {
      error: "Uno de los campos supera la longitud permitida"
    };
  }

  if (!tiposPermitidos.includes(tipo)) {
    return {
      error: "Tipo de hogar no valido"
    };
  }

  return {
    datos: {
      clienteId,
      direccion,
      localidad,
      tipo,
      descripcion
    }
  };
}

const controlador = crearControladorCrud(
  modelo,
  validarHogar,
  "Hogar"
);

async function verificarCambioCliente(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const resultado = validarHogar(req.body || {});

    if (resultado.error) {
      return res.status(400).json({
        message: resultado.error
      });
    }

    const hogar = await modelo.obtenerPorId(id);

    if (!hogar) {
      return res.status(404).json({
        message: "Hogar no encontrado"
      });
    }

    if (
      Number(hogar.clienteId) !== resultado.datos.clienteId
    ) {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM servicios
         WHERE hogarId = ?`,
        [id]
      );

      if (rows[0].total > 0) {
        return res.status(409).json({
          message: "No se puede cambiar el cliente de un hogar con servicios asociados"
        });
      }
    }

    next();

  } catch (error) {
    next(error);
  }
}

router.use(
  autenticar,
  autorizarRoles("admin", "cliente")
);

router.get("/", async (req, res, next) => {
  if (req.usuario.rol === "admin") {
    return controlador.listar(req, res);
  }

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM hogares
       WHERE clienteId = ?
       ORDER BY id DESC`,
      [req.usuario.perfilId]
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  hogarPropio,
  controlador.obtenerPorId
);

router.post(
  "/",
  asignarCliente,
  controlador.crear
);

router.put(
  "/:id",
  hogarPropio,
  asignarCliente,
  verificarCambioCliente,
  controlador.actualizar
);

router.delete(
  "/:id",
  hogarPropio,
  controlador.eliminar
);

module.exports = router;