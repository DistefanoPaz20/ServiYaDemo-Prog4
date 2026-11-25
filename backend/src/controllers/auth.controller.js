const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuarios.model");

function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN || "8h"
    }
  );
}

function limpiar(valor) {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function passwordValido(password) {
  return typeof password === "string" &&
    password.length >= 8 &&
    Buffer.byteLength(password, "utf8") <= 72;
}

function manejarError(error, res) {
  console.error(error.message);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      message: "El correo electronico ya esta registrado"
    });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      message: "El oficio seleccionado no existe"
    });
  }

  res.status(500).json({
    message: "Error interno del servidor"
  });
}

// REGISTRO

async function registro(req, res) {
  try {
    const body = req.body || {};

    const nombre = limpiar(body.nombre);
    const apellido = limpiar(body.apellido);
    const email = limpiar(body.email).toLowerCase();
    const telefono = limpiar(body.telefono);

    const { password, rol } = body;

    if (!nombre || !apellido || !email || !telefono) {
      return res.status(400).json({
        message: "Complete todos los campos obligatorios"
      });
    }

    if (
      nombre.length > 100 ||
      apellido.length > 100 ||
      `${nombre} ${apellido}`.length > 100 ||
      email.length > 150 ||
      telefono.length > 30
    ) {
      return res.status(400).json({
        message: "Uno de los campos es demasiado largo"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Correo electronico no valido"
      });
    }

    if (!passwordValido(password)) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes"
      });
    }

    if (!["cliente", "prestador"].includes(rol)) {
      return res.status(400).json({
        message: "Rol no permitido"
      });
    }

    const oficioId = Number(body.oficioId);
    const experiencia = Number(body.experiencia ?? 0);

    if (rol === "prestador") {
      if (
        !Number.isSafeInteger(oficioId) ||
        oficioId <= 0 ||
        oficioId > 2147483647
      ) {
        return res.status(400).json({
          message: "Seleccione un oficio valido"
        });
      }

      if (
        !Number.isInteger(experiencia) ||
        experiencia < 0 ||
        experiencia > 100
      ) {
        return res.status(400).json({
          message: "Experiencia no valida"
        });
      }
    }

    const existente = await Usuario.buscarPorEmail(email);

    if (existente) {
      return res.status(409).json({
        message: "El correo electronico ya esta registrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.registrar({
      nombre,
      apellido,
      email,
      telefono,
      password: passwordHash,
      rol,
      oficioId,
      experiencia
    });

    const token = generarToken(usuario);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario,
      token
    });

  } catch (error) {
    manejarError(error, res);
  }
}

// LOGIN

async function login(req, res) {
  try {
    const body = req.body || {};

    const email = limpiar(body.email).toLowerCase();
    const password = body.password;

    if (
      !email ||
      typeof password !== "string" ||
      !password ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Email o contraseña no validos"
      });
    }

    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const coincide = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!coincide) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const perfil = await Usuario.obtenerPerfil(usuario);

    if (perfil.rol !== "admin" && !perfil.perfilId) {
      return res.status(403).json({
        message: "La cuenta no tiene un perfil asociado"
      });
    }

    const token = generarToken(perfil);

    res.json({
      message: "Sesion iniciada correctamente",
      usuario: perfil,
      token
    });

  } catch (error) {
    manejarError(error, res);
  }
}

// USUARIO AUTENTICADO

async function me(req, res) {
  res.json({
    usuario: req.usuario
  });
}

// CAMBIAR CONTRASEÑA

async function cambiarPassword(req, res) {
  try {
    const {
      passwordActual,
      passwordNueva
    } = req.body || {};

    if (
      typeof passwordActual !== "string" ||
      !passwordActual ||
      Buffer.byteLength(passwordActual, "utf8") > 72 ||
      !passwordValido(passwordNueva)
    ) {
      return res.status(400).json({
        message: "Contraseñas no validas"
      });
    }

    if (passwordActual === passwordNueva) {
      return res.status(400).json({
        message: "La nueva contraseña debe ser diferente"
      });
    }

    const usuario = await Usuario.buscarPorId(
      req.usuario.id
    );

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const coincide = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!coincide) {
      return res.status(401).json({
        message: "Contraseña actual incorrecta"
      });
    }

    const passwordHash = await bcrypt.hash(
      passwordNueva,
      10
    );

    const actualizado = await Usuario.actualizarPassword(
      usuario.id,
      usuario.password,
      passwordHash
    );

    if (!actualizado) {
      return res.status(409).json({
        message: "La contraseña fue modificada. Intente nuevamente"
      });
    }

    res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    manejarError(error, res);
  }
}

module.exports = {
  registro,
  login,
  me,
  cambiarPassword
};