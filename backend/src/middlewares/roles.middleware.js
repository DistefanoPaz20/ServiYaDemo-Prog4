function autorizarRoles(...rolesPermitidos) {
  return (req, res, next) => {

    if (!req.usuario) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        message: "No tiene permisos para esta operacion"
      });
    }

    next();
  };
}

module.exports = autorizarRoles;