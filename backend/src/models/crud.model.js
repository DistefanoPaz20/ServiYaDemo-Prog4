const pool = require("../config/db");

const tablasPermitidas = {
  hogares: [
    "clienteId",
    "direccion",
    "localidad",
    "tipo",
    "descripcion"
  ],

  oficios: [
    "nombre",
    "descripcion"
  ],

  prestadores: [
    "oficioId",
    "nombre",
    "apellido",
    "email",
    "telefono",
    "experiencia",
    "estado"
  ],

  servicios: [
    "hogarId",
    "prestadorId",
    "descripcion",
    "fecha",
    "precio",
    "estado"
  ]
};

function crearModeloCrud(tabla) {
  const campos = tablasPermitidas[tabla];

  if (!campos) {
    throw new Error("Tabla no permitida");
  }

  async function listar() {
    const [rows] = await pool.query(
      `SELECT * FROM ${tabla} ORDER BY id DESC`
    );

    return rows;
  }

  async function obtenerPorId(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM ${tabla} WHERE id = ?`,
      [id]
    );

    return rows[0];
  }

  async function crear(datos) {
    const columnas = campos.join(", ");
    const placeholders = campos.map(() => "?").join(", ");
    const valores = campos.map(campo => datos[campo]);

    const [result] = await pool.execute(
      `INSERT INTO ${tabla} (${columnas})
       VALUES (${placeholders})`,
      valores
    );

    return obtenerPorId(result.insertId);
  }

  async function actualizar(id, datos) {
    const columnas = campos
      .map(campo => `${campo} = ?`)
      .join(", ");

    const valores = campos.map(campo => datos[campo]);

    await pool.execute(
      `UPDATE ${tabla}
       SET ${columnas}
       WHERE id = ?`,
      [...valores, id]
    );

    return obtenerPorId(id);
  }

  async function eliminar(id) {
    const [result] = await pool.execute(
      `DELETE FROM ${tabla} WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  return {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
  };
}

module.exports = crearModeloCrud;