const express = require("express");

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

const router = express.Router();

const modelo = crearModeloCrud("oficios");

function validarOficio(datos) {
  const nombre = typeof datos.nombre === "string"
    ? datos.nombre.trim()
    : "";

  const descripcion = typeof datos.descripcion === "string"
    ? datos.descripcion.trim()
    : "";

  if (!nombre) {
    return {
      error: "El nombre del oficio es obligatorio"
    };
  }

  if (
    nombre.length > 100 ||
    descripcion.length > 10000
  ) {
    return {
      error: "Uno de los campos supera la longitud permitida"
    };
  }

  return {
    datos: {
      nombre,
      descripcion
    }
  };
}

const controlador = crearControladorCrud(
  modelo,
  validarOficio,
  "Oficio"
);

// CONSULTAS PUBLICAS

router.get("/", controlador.listar);

router.get("/:id", controlador.obtenerPorId);

// OPERACIONES EXCLUSIVAS DEL ADMINISTRADOR

router.post(
  "/",
  autenticar,
  autorizarRoles("admin"),
  controlador.crear
);

router.put(
  "/:id",
  autenticar,
  autorizarRoles("admin"),
  controlador.actualizar
);

router.delete(
  "/:id",
  autenticar,
  autorizarRoles("admin"),
  controlador.eliminar
);

module.exports = router;