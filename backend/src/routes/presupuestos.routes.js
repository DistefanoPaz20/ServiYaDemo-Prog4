const express = require("express");
const pool = require("../config/db");

const controlador = require(
  "../controllers/presupuestos.controller"
);

const autenticar = require(
  "../middlewares/auth.middleware"
);

const autorizarRoles = require(
  "../middlewares/roles.middleware"
);

const {
  presupuestoPropio,
  validarCreacionPresupuesto
} = require("../middlewares/permisos.middleware");

const router = express.Router();

router.use(autenticar);

router.get("/", async (req, res, next) => {
  try {
    if (req.usuario.rol === "admin") {
      return controlador.listar(req, res);
    }

    if (req.usuario.rol === "cliente") {
      const [rows] = await pool.execute(
        `SELECT p.*
         FROM presupuestos p
         INNER JOIN servicios s ON s.id = p.servicioId
         INNER JOIN hogares h ON h.id = s.hogarId
         WHERE h.clienteId = ?
         ORDER BY p.id DESC`,
        [req.usuario.perfilId]
      );

      return res.json(rows);
    }

    if (req.usuario.rol === "prestador") {
      const [rows] = await pool.execute(
        `SELECT p.*
         FROM presupuestos p
         INNER JOIN servicios s ON s.id = p.servicioId
         WHERE s.prestadorId = ?
         ORDER BY p.id DESC`,
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
  presupuestoPropio,
  controlador.obtenerPorId
);

router.post(
  "/",
  autorizarRoles("prestador"),
  validarCreacionPresupuesto,
  controlador.crear
);

router.patch(
  "/:id/estado",
  autorizarRoles("cliente"),
  presupuestoPropio,
  controlador.cambiarEstado
);

module.exports = router;