const express = require("express");

const controlador = require(
  "../controllers/presupuestos.controller"
);

const router = express.Router();

router.get("/", controlador.listar);

router.get("/:id", controlador.obtenerPorId);

router.post("/", controlador.crear);

router.patch("/:id/estado", controlador.cambiarEstado);

module.exports = router;