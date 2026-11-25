const express = require("express");

const modelo = require("../models/prestadores.model");

const crearControladorCrud = require(
  "../controllers/crud.controller"
);

const router = express.Router();

const pool = require("../config/db");

const autenticar = require(
  "../middlewares/auth.middleware"
);

const autorizarRoles = require(
  "../middlewares/roles.middleware"
);

const { soloPerfilPropio } = require(
  "../middlewares/permisos.middleware"
);

function validarPrestador(datos) {
  const oficioId = Number(datos.oficioId);

  const experiencia = Number(datos.experiencia);

  const nombre = typeof datos.nombre === "string"
    ? datos.nombre.trim()
    : "";

  const apellido = typeof datos.apellido === "string"
    ? datos.apellido.trim()
    : "";

  const email = typeof datos.email === "string"
    ? datos.email.trim().toLowerCase()
    : "";

  const telefono = typeof datos.telefono === "string"
    ? datos.telefono.trim()
    : "";

  const estado = datos.estado;

  if (
    !Number.isSafeInteger(oficioId) ||
    oficioId <= 0 ||
    oficioId > 2147483647
  ) {
    return {
      error: "Debe seleccionar un oficio valido"
    };
  }

  if (!nombre || !apellido || !email || !telefono) {
    return {
      error: "Todos los campos son obligatorios"
    };
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(email)) {
    return {
      error: "Correo electronico no valido"
    };
  }

  if (
    nombre.length > 100 ||
    apellido.length > 100 ||
    email.length > 150 ||
    telefono.length > 30
  ) {
    return {
      error: "Uno de los campos supera la longitud permitida"
    };
  }

  if (
    datos.experiencia === "" ||
    datos.experiencia == null ||
    !Number.isInteger(experiencia) ||
    experiencia < 0 ||
    experiencia > 100
  ) {
    return {
      error: "La experiencia debe ser un numero entre 0 y 100"
    };
  }

  if (!["Activo", "Inactivo"].includes(estado)) {
    return {
      error: "Estado no valido"
    };
  }

  return {
    datos: {
      oficioId,
      nombre,
      apellido,
      email,
      telefono,
      experiencia,
      estado
    }
  };
}

const controlador = crearControladorCrud(
  modelo,
  validarPrestador,
  "Prestador"
);

async function verificarEliminacion(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      id > 2147483647
    ) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const prestador = await modelo.obtenerPorId(id);

    if (!prestador) {
      return res.status(404).json({
        message: "Prestador no encontrado"
      });
    }

    if (prestador.usuarioId) {
      return res.status(409).json({
        message: "El prestador tiene una cuenta de usuario asociada"
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

router.use(autenticar);

router.get("/", async (req, res, next) => {
  try {
    if (req.usuario.rol === "admin") {
      return controlador.listar(req, res);
    }

    if (req.usuario.rol === "prestador") {
      const [rows] = await pool.execute(
        "SELECT * FROM prestadores WHERE id = ?",
        [req.usuario.perfilId]
      );

      return res.json(rows);
    }

    const [rows] = await pool.execute(
      `SELECT id, oficioId, nombre, apellido,
              experiencia, estado
       FROM prestadores
       WHERE estado = 'Activo'`
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  autorizarRoles("admin", "prestador"),
  soloPerfilPropio,
  controlador.obtenerPorId
);

router.post(
  "/",
  autorizarRoles("admin"),
  controlador.crear
);

router.put(
  "/:id",
  autorizarRoles("admin", "prestador"),
  soloPerfilPropio,
  async (req, res, next) => {
    try {
      if (req.usuario.rol === "prestador") {
        const prestador = await modelo.obtenerPorId(
          req.usuario.perfilId
        );

        if (!prestador) {
          return res.status(404).json({
            message: "Prestador no encontrado"
          });
        }

        req.body = {
          ...req.body,
          estado: prestador.estado
        };
      }

      next();

    } catch (error) {
      next(error);
    }
  },
  controlador.actualizar
);

router.delete(
  "/:id",
  autorizarRoles("admin"),
  verificarEliminacion,
  controlador.eliminar
);

module.exports = router;