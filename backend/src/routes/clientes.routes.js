const express = require("express");
const pool = require("../config/db");

const clientesController = require(
  "../controllers/cliente.controller"
);

const autenticar = require(
  "../middlewares/auth.middleware"
);

const autorizarRoles = require(
  "../middlewares/roles.middleware"
);

const { soloPerfilPropio } = require(
  "../middlewares/permisos.middleware"
);

const router = express.Router();

router.use(autenticar);

router.get(
  "/",
  autorizarRoles("admin", "cliente"),
  async (req, res, next) => {
    if (req.usuario.rol === "admin") {
      return clientesController.listar(req, res);
    }

    try {
      const [rows] = await pool.execute(
        "SELECT * FROM clientes WHERE id = ?",
        [req.usuario.perfilId]
      );

      res.json(rows);

    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  autorizarRoles("admin", "cliente"),
  soloPerfilPropio,
  clientesController.obtenerPorId
);

router.post(
  "/",
  autorizarRoles("admin"),
  clientesController.crear
);

router.put(
  "/:id",
  autorizarRoles("admin", "cliente"),
  soloPerfilPropio,
  clientesController.actualizar
);

router.delete(
  "/:id",
  autorizarRoles("admin"),
  clientesController.eliminar
);

module.exports = router;