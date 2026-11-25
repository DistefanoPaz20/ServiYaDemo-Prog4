const Cliente = require("../models/clientes.model");

function validarCliente(datos) {
  const campos = ["nombre", "apellido", "email", "telefono"];

  for (const campo of campos) {
    if (
      typeof datos[campo] !== "string" ||
      !datos[campo].trim()
    ) {
      return "Todos los campos son obligatorios";
    }
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(datos.email.trim())) {
    return "El correo electronico no es valido";
  }

  if (
    datos.nombre.trim().length > 100 ||
    datos.apellido.trim().length > 100 ||
    datos.email.trim().length > 150 ||
    datos.telefono.trim().length > 30
  ) {
    return "Uno de los campos supera la longitud permitida";
  }

  return null;
}

function limpiarDatos(datos) {
  return {
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    email: datos.email.trim().toLowerCase(),
    telefono: datos.telefono.trim()
  };
}

function idValido(id) {
  return /^\d+$/.test(id) &&
    Number.isSafeInteger(Number(id)) &&
    Number(id) > 0;
}

function manejarError(error, res) {
  console.error(error.message);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      message: "El correo electronico ya esta registrado"
    });
  }

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({
      message: "El cliente tiene registros asociados"
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor"
  });
}

// GET,obtener todos los clientes

async function listar(req, res) {
  try {
    const clientes = await Cliente.obtenerClientes();

    res.json(clientes);

  } catch (error) {
    manejarError(error, res);
  }
}

// GET,obtener por id

async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const cliente = await Cliente.obtenerClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente no encontrado"
      });
    }

    res.json(cliente);

  } catch (error) {
    manejarError(error, res);
  }
}

// POST

async function crear(req, res) {
  try {
    const datos = req.body || {};
    const errorValidacion = validarCliente(datos);

    if (errorValidacion) {
      return res.status(400).json({
        message: errorValidacion
      });
    }

    const cliente = await Cliente.crearCliente(
      limpiarDatos(datos)
    );

    res.status(201).json(cliente);

  } catch (error) {
    manejarError(error, res);
  }
}

// PUT

async function actualizar(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const datos = req.body || {};
    const errorValidacion = validarCliente(datos);

    if (errorValidacion) {
      return res.status(400).json({
        message: errorValidacion
      });
    }

    const cliente = await Cliente.actualizarCliente(
      id,
      limpiarDatos(datos)
    );

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente no encontrado"
      });
    }

    res.json(cliente);

  } catch (error) {
    manejarError(error, res);
  }
}

// DELETE

async function eliminar(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        message: "ID no valido"
      });
    }

    const cliente = await Cliente.obtenerClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente no encontrado"
      });
    }

    if (cliente.usuarioId) {
      return res.status(409).json({
        message: "El cliente tiene una cuenta de usuario asociada"
      });
    }

    const eliminado = await Cliente.eliminarCliente(id);

    if (!eliminado) {
      return res.status(409).json({
        message: "No se pudo eliminar el cliente"
      });
    }

    res.json({
      message: "Cliente eliminado correctamente"
    });

  } catch (error) {
    manejarError(error, res);
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};