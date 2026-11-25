const pool = require("../config/db");

async function cambiarEstado(id, estado) {
  const conexion = await pool.getConnection();

  function errorNegocio(message, status = 409) {
    const error = new Error(message);
    error.status = status;
    return error;
  }

  try {
    await conexion.beginTransaction();

    const [rows] = await conexion.execute(
      `SELECT * FROM servicios
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    const servicio = rows[0];

    if (!servicio) {
      throw errorNegocio(
        "Servicio no encontrado",
        404
      );
    }

    if (estado === "Cancelado") {
      if (servicio.estado !== "Pendiente") {
        throw errorNegocio(
          "Solo se pueden cancelar servicios pendientes"
        );
      }

      await conexion.execute(
        `UPDATE presupuestos
         SET estado = 'Rechazado'
         WHERE servicioId = ?
         AND estado = 'Pendiente'`,
        [id]
      );

    } else if (estado === "Finalizado") {
      if (servicio.estado !== "En proceso") {
        throw errorNegocio(
          "Solo se pueden finalizar servicios en proceso"
        );
      }

    } else {
      throw errorNegocio("Estado no valido", 400);
    }

    await conexion.execute(
      `UPDATE servicios
       SET estado = ?
       WHERE id = ?`,
      [estado, id]
    );

    const [actualizados] = await conexion.execute(
      "SELECT * FROM servicios WHERE id = ?",
      [id]
    );

    await conexion.commit();

    return actualizados[0];

  } catch (error) {
    await conexion.rollback();
    throw error;

  } finally {
    conexion.release();
  }
}

module.exports = {
  cambiarEstado
};