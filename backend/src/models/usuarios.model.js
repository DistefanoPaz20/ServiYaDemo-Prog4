const pool = require("../config/db");

async function buscarPorEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );

  return rows[0];
}

async function buscarPorId(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM usuarios WHERE id = ?",
    [id]
  );

  return rows[0];
}

async function obtenerPerfil(usuario) {
  let perfilId = null;

  if (usuario.rol === "cliente") {
    const [rows] = await pool.execute(
      "SELECT id FROM clientes WHERE usuarioId = ?",
      [usuario.id]
    );

    perfilId = rows[0]?.id ?? null;
  }

  if (usuario.rol === "prestador") {
    const [rows] = await pool.execute(
      "SELECT id FROM prestadores WHERE usuarioId = ?",
      [usuario.id]
    );

    perfilId = rows[0]?.id ?? null;
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    perfilId
  };
}

async function registrar(datos) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.execute(
      `INSERT INTO usuarios
       (nombre, email, password, rol)
       VALUES (?, ?, ?, ?)`,
      [
        `${datos.nombre} ${datos.apellido}`,
        datos.email,
        datos.password,
        datos.rol
      ]
    );

    const usuarioId = resultado.insertId;

    let perfilId;

    if (datos.rol === "cliente") {
      const [cliente] = await conexion.execute(
        `INSERT INTO clientes
         (usuarioId, nombre, apellido, email, telefono)
         VALUES (?, ?, ?, ?, ?)`,
        [
          usuarioId,
          datos.nombre,
          datos.apellido,
          datos.email,
          datos.telefono
        ]
      );

      perfilId = cliente.insertId;
    }

    if (datos.rol === "prestador") {
      const [prestador] = await conexion.execute(
        `INSERT INTO prestadores
         (usuarioId, oficioId, nombre, apellido,
          email, telefono, experiencia, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Activo')`,
        [
          usuarioId,
          datos.oficioId,
          datos.nombre,
          datos.apellido,
          datos.email,
          datos.telefono,
          datos.experiencia
        ]
      );

      perfilId = prestador.insertId;
    }

    await conexion.commit();

    return {
      id: usuarioId,
      nombre: `${datos.nombre} ${datos.apellido}`,
      email: datos.email,
      rol: datos.rol,
      perfilId
    };

  } catch (error) {
    await conexion.rollback();
    throw error;

  } finally {
    conexion.release();
  }
}

async function actualizarPassword(id, anterior, password) {
  const [resultado] = await pool.execute(
    `UPDATE usuarios
     SET password = ?
     WHERE id = ? AND BINARY password = ?`,
    [password, id, anterior]
  );

  return resultado.affectedRows > 0;
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  obtenerPerfil,
  registrar,
  actualizarPassword
};