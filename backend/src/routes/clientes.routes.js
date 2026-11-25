const express = require("express");

const router = express.Router();

const clientesController = require(
  "../controllers/cliente.controller"
);

router.get("/", clientesController.listar);

router.get("/:id", clientesController.obtenerPorId);

router.post("/", clientesController.crear);

router.put("/:id", clientesController.actualizar);

router.delete("/:id", clientesController.eliminar);

module.exports = router;