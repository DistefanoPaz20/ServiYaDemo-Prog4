const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios.model");

async function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Token de autenticacion requerido"
    });
  }

  const token = authorization.slice(7).trim();

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"]
      }
    );

  } catch (error) {
    return res.status(401).json({
      message: "Token invalido o expirado"
    });
  }

  try {
    const usuario = await Usuario.buscarPorId(
      decoded.id
    );

    if (!usuario) {
      return res.status(401).json({
        message: "Usuario no encontrado"
      });
    }

    req.usuario = await Usuario.obtenerPerfil(usuario);

    if (
      req.usuario.rol !== "admin" &&
      !req.usuario.perfilId
    ) {
      return res.status(403).json({
        message: "Perfil de usuario no disponible"
      });
    }

    next();

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Error al verificar la identidad"
    });
  }
}

module.exports = autenticar;