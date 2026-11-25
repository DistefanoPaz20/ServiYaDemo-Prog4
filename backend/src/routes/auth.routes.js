const express = require("express");

const controlador = require(
  "../controllers/auth.controller"
);

const autenticar = require(
  "../middlewares/auth.middleware"
);

const router = express.Router();

router.post("/registro", controlador.registro);

router.post("/login", controlador.login);

router.get(
  "/me",
  autenticar,
  controlador.me
);

router.patch(
  "/password",
  autenticar,
  controlador.cambiarPassword
);

module.exports = router;