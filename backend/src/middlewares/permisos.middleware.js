const pool = require("../config/db");

function soloPerfilPropio(req, res, next) {
  if (req.usuario.rol === "admin") {
    return next();
  }

  if (
    !req.usuario.perfilId ||
    Number(req.params.id) !== Number(req.usuario.perfilId)
  ) {
    return res.status(403).json({
      message: "No tiene permisos sobre este perfil"
    });
  }

  next();
}

async function hogarPropio(req, res, next) {
  if (req.usuario.rol === "admin") {
    return next();
  }

  try {
    const [rows] = await pool.execute(
      `SELECT id FROM hogares
       WHERE id = ? AND clienteId = ?`,
      [req.params.id, req.usuario.perfilId]
    );

    if (!rows.length) {
      return res.status(403).json({
        message: "No tiene permisos sobre este hogar"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
}

function asignarCliente(req, res, next) {
  if (req.usuario.rol === "cliente") {
    req.body = {
      ...req.body,
      clienteId: req.usuario.perfilId
    };
  }

  next();
}

async function servicioPropio(req, res, next) {
  if (req.usuario.rol === "admin") {
    return next();
  }

  try {
    const id = req.params.id;

    const [rows] = await pool.execute(
      `SELECT s.*, h.clienteId
       FROM servicios s
       INNER JOIN hogares h ON h.id = s.hogarId
       WHERE s.id = ?`,
      [id]
    );

    const servicio = rows[0];

    const permitido = servicio && (
      (
        req.usuario.rol === "cliente" &&
        Number(servicio.clienteId) ===
        Number(req.usuario.perfilId)
      ) ||
      (
        req.usuario.rol === "prestador" &&
        Number(servicio.prestadorId) ===
        Number(req.usuario.perfilId)
      )
    );

    if (!permitido) {
      return res.status(403).json({
        message: "No tiene permisos sobre este servicio"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
}

async function validarSolicitudCliente(req, res, next) {
  if (req.usuario.rol === "admin") {
    return next();
  }

  try {
    const [rows] = await pool.execute(
      `SELECT id FROM hogares
       WHERE id = ? AND clienteId = ?`,
      [
        req.body?.hogarId ?? null,
        req.usuario.perfilId
      ]
    );

    if (!rows.length) {
      return res.status(403).json({
        message: "Debe seleccionar un hogar propio"
      });
    }

    req.body = {
      ...req.body,
      precio: 0,
      estado: "Pendiente"
    };

    next();

  } catch (error) {
    next(error);
  }
}

async function presupuestoPropio(req, res, next) {
  if (req.usuario.rol === "admin") {
    return next();
  }

  try {
    const [rows] = await pool.execute(
      `SELECT p.id, s.prestadorId, h.clienteId
       FROM presupuestos p
       INNER JOIN servicios s ON s.id = p.servicioId
       INNER JOIN hogares h ON h.id = s.hogarId
       WHERE p.id = ?`,
      [req.params.id]
    );

    const presupuesto = rows[0];

    const permitido = presupuesto && (
      (
        req.usuario.rol === "cliente" &&
        Number(presupuesto.clienteId) ===
        Number(req.usuario.perfilId)
      ) ||
      (
        req.usuario.rol === "prestador" &&
        Number(presupuesto.prestadorId) ===
        Number(req.usuario.perfilId)
      )
    );

    if (!permitido) {
      return res.status(403).json({
        message: "No tiene permisos sobre este presupuesto"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
}

async function validarCreacionPresupuesto(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id FROM servicios
       WHERE id = ? AND prestadorId = ?`,
      [
        req.body?.servicioId ?? null,
        req.usuario.perfilId
      ]
    );

    if (!rows.length) {
      return res.status(403).json({
        message: "El servicio no esta asignado a este prestador"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
}

module.exports = {
  soloPerfilPropio,
  hogarPropio,
  asignarCliente,
  servicioPropio,
  validarSolicitudCliente,
  presupuestoPropio,
  validarCreacionPresupuesto
};