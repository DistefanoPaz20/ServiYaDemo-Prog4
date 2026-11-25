function crearControladorCrud(modelo, validar, entidad) {

  function idValido(id) {
    return /^\d+$/.test(String(id)) &&
      Number.isSafeInteger(Number(id)) &&
      Number(id) > 0 &&
      Number(id) <= 2147483647;
  }

  function manejarError(error, res) {
    console.error(error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "El registro ya existe"
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "El registro relacionado no existe"
      });
    }

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "No se puede eliminar: tiene registros asociados"
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }

  async function listar(req, res) {
    try {
      const registros = await modelo.listar();

      res.json(registros);

    } catch (error) {
      manejarError(error, res);
    }
  }

  async function obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      if (!idValido(id)) {
        return res.status(400).json({
          message: "ID no valido"
        });
      }

      const registro = await modelo.obtenerPorId(id);

      if (!registro) {
        return res.status(404).json({
          message: `${entidad} no encontrado`
        });
      }

      res.json(registro);

    } catch (error) {
      manejarError(error, res);
    }
  }

  async function crear(req, res) {
    try {
      const resultado = validar(req.body || {});

      if (resultado.error) {
        return res.status(400).json({
          message: resultado.error
        });
      }

      const registro = await modelo.crear(
        resultado.datos
      );

      res.status(201).json(registro);

    } catch (error) {
      manejarError(error, res);
    }
  }

  async function actualizar(req, res) {
    try {
      const { id } = req.params;

      if (!idValido(id)) {
        return res.status(400).json({
          message: "ID no valido"
        });
      }

      const resultado = validar(req.body || {});

      if (resultado.error) {
        return res.status(400).json({
          message: resultado.error
        });
      }

      const registro = await modelo.actualizar(
        id,
        resultado.datos
      );

      if (!registro) {
        return res.status(404).json({
          message: `${entidad} no encontrado`
        });
      }

      res.json(registro);

    } catch (error) {
      manejarError(error, res);
    }
  }

  async function eliminar(req, res) {
    try {
      const { id } = req.params;

      if (!idValido(id)) {
        return res.status(400).json({
          message: "ID no valido"
        });
      }

      const eliminado = await modelo.eliminar(id);

      if (!eliminado) {
        return res.status(404).json({
          message: `${entidad} no encontrado`
        });
      }

      res.json({
        message: `${entidad} eliminado correctamente`
      });

    } catch (error) {
      manejarError(error, res);
    }
  }

  return {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
  };
}

module.exports = crearControladorCrud;