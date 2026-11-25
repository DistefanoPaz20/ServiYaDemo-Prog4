const pool = require("../config/db");
const crearModeloCrud = require("./crud.model");

const modeloBase = crearModeloCrud("prestadores");

async function actualizar(id, datos) {
  const conexion = await pool.getConnection();

  const {
    oficioId,
    nombre,
    apellido,
    email,
    telefono,
    experiencia,
    estado
  } = datos;

  try {
    await conexion.beginTransaction();

    const [rows] = await conexion.execute(
      `SELECT usuarioId
       FROM prestadores
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (!rows.length) {
      await conexion.rollback();
      return null;
    }

    await conexion.execute(
      `UPDATE prestadores
       SET oficioId = ?,
           nombre = ?,
           apellido = ?,
           email = ?,
           telefono = ?,
           experiencia = ?,
           estado = ?
       WHERE id = ?`,
      [
        oficioId,
        nombre,
        apellido,
        email,
        telefono,
        experiencia,
        estado,
        id
      ]
    );

    if (rows[0].usuarioId) {
      await conexion.execute(
        `UPDATE usuarios
         SET nombre = ?, email = ?
         WHERE id = ?`,
        [
          `${nombre} ${apellido}`,
          email,
          rows[0].usuarioId
        ]
      );
    }

    const [actualizados] = await conexion.execute(
      "SELECT * FROM prestadores WHERE id = ?",
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

async function eliminar(id) {
  const [result] = await pool.execute(
    `DELETE FROM prestadores
     WHERE id = ? AND usuarioId IS NULL`,
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  ...modeloBase,
  actualizar,
  eliminar
};