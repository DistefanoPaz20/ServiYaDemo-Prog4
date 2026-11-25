const pool = require("../config/db");

async function obtenerClientes() {
  const [rows] = await pool.query(
    "SELECT * FROM clientes ORDER BY id DESC"
  );

  return rows;
}

async function obtenerClientePorId(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM clientes WHERE id = ?",
    [id]
  );

  return rows[0];
}

async function crearCliente(datos) {
  const { nombre, apellido, email, telefono } = datos;

  const [result] = await pool.execute(
    `INSERT INTO clientes
    (nombre, apellido, email, telefono)
    VALUES (?, ?, ?, ?)`,
    [nombre, apellido, email, telefono]
  );

  return obtenerClientePorId(result.insertId);
}

async function actualizarCliente(id, datos) {
  const { nombre, apellido, email, telefono } = datos;

  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [rows] = await conexion.execute(
      "SELECT usuarioId FROM clientes WHERE id = ? FOR UPDATE",
      [id]
    );

    if (!rows.length) {
      await conexion.rollback();
      return null;
    }

    await conexion.execute(
      `UPDATE clientes
       SET nombre = ?, apellido = ?, email = ?, telefono = ?
       WHERE id = ?`,
      [nombre, apellido, email, telefono, id]
    );

    if (rows[0].usuarioId) {
      await conexion.execute(
        `UPDATE usuarios
         SET nombre = ?, email = ?
         WHERE id = ?`,
        [`${nombre} ${apellido}`, email, rows[0].usuarioId]
      );
    }

    await conexion.commit();

    return obtenerClientePorId(id);

  } catch (error) {
    await conexion.rollback();
    throw error;

  } finally {
    conexion.release();
  }
}

async function eliminarCliente(id) {
  const [result] = await pool.execute(
    `DELETE FROM clientes
     WHERE id = ? AND usuarioId IS NULL`,
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};