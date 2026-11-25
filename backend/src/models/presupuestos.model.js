const pool = require("../config/db");

function errorNegocio(message, status = 409) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function listar() {
  const [rows] = await pool.query(
    "SELECT * FROM presupuestos ORDER BY id DESC"
  );

  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM presupuestos WHERE id = ?",
    [id]
  );

  return rows[0];
}

async function crear(datos) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [servicios] = await conexion.execute(
      `SELECT * FROM servicios
       WHERE id = ?
       FOR UPDATE`,
      [datos.servicioId]
    );

    const servicio = servicios[0];

    if (!servicio) {
      throw errorNegocio("Servicio no encontrado", 404);
    }

    if (servicio.estado !== "Pendiente") {
      throw errorNegocio(
        "El servicio debe estar pendiente"
      );
    }

    const [existentes] = await conexion.execute(
      `SELECT id FROM presupuestos
       WHERE servicioId = ?
       AND estado IN ('Pendiente', 'Aceptado')`,
      [datos.servicioId]
    );

    if (existentes.length > 0) {
      throw errorNegocio(
        "El servicio ya tiene un presupuesto vigente"
      );
    }

    const [resultado] = await conexion.execute(
      `INSERT INTO presupuestos
       (servicioId, descripcion, monto, fecha, estado)
       VALUES (?, ?, ?, CURDATE(), 'Pendiente')`,
      [
        datos.servicioId,
        datos.descripcion,
        datos.monto
      ]
    );

    const [rows] = await conexion.execute(
      "SELECT * FROM presupuestos WHERE id = ?",
      [resultado.insertId]
    );

    await conexion.commit();

    return rows[0];

  } catch (error) {
    await conexion.rollback();
    throw error;

  } finally {
    conexion.release();
  }
}

async function cambiarEstado(id, estado) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [referencias] = await conexion.execute(
      `SELECT servicioId
       FROM presupuestos
       WHERE id = ?`,
      [id]
    );

    if (!referencias.length) {
      throw errorNegocio(
        "Presupuesto no encontrado",
        404
      );
    }

    const servicioId = referencias[0].servicioId;

    const [servicios] = await conexion.execute(
      `SELECT * FROM servicios
       WHERE id = ?
       FOR UPDATE`,
      [servicioId]
    );

    const servicio = servicios[0];

    const [presupuestos] = await conexion.execute(
      `SELECT * FROM presupuestos
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    const presupuesto = presupuestos[0];

    if (!presupuesto || !servicio) {
      throw errorNegocio("Registro no encontrado", 404);
    }

    if (presupuesto.estado !== "Pendiente") {
      throw errorNegocio(
        "El presupuesto ya fue respondido"
      );
    }

    if (servicio.estado !== "Pendiente") {
      throw errorNegocio(
        "El servicio ya no se encuentra pendiente"
      );
    }

    await conexion.execute(
      `UPDATE presupuestos
       SET estado = ?
       WHERE id = ?`,
      [estado, id]
    );

    if (estado === "Aceptado") {
      await conexion.execute(
        `UPDATE servicios
         SET precio = ?,
             estado = 'En proceso'
         WHERE id = ?`,
        [
          presupuesto.monto,
          presupuesto.servicioId
        ]
      );
    }

    const [rows] = await conexion.execute(
      "SELECT * FROM presupuestos WHERE id = ?",
      [id]
    );

    await conexion.commit();

    return rows[0];

  } catch (error) {
    await conexion.rollback();
    throw error;

  } finally {
    conexion.release();
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  cambiarEstado
};