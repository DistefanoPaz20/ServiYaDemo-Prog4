require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// IMPORTACION DE RUTAS

const clientesRoutes = require("./routes/clientes.routes");
const hogaresRoutes = require("./routes/hogares.routes");
const oficiosRoutes = require("./routes/oficios.routes");
const prestadoresRoutes = require("./routes/prestadores.routes");
const serviciosRoutes = require("./routes/servicios.routes");
const presupuestosRoutes = require("./routes/presupuestos.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// MIDDLEWARES

app.use(
  cors({
    origin: process.env.FRONTEND_URL ||
      "http://localhost:5173"
  })
);

app.use(express.json());

// VERIFICACION DE API

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "API de ServiYa funcionando"
  });
});

// VERIFICACION DE BASE DE DATOS

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM clientes"
    );

    res.json({
      ok: true,
      message: "Conexion con MySQL exitosa",
      totalClientes: rows[0].total
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      ok: false,
      message: "Error al conectar con la base de datos"
    });
  }
});

// RUTAS DE LA API

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/hogares", hogaresRoutes);
app.use("/api/oficios", oficiosRoutes);
app.use("/api/prestadores", prestadoresRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/presupuestos", presupuestosRoutes);

// RUTAS INEXISTENTES

app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada"
  });
});

// MANEJO GENERAL DE ERRORES

app.use((error, req, res, next) => {
  console.error(error.message);

  const status = error.type === "entity.parse.failed"
    ? 400
    : 500;

  res.status(status).json({
    message: status === 400
      ? "JSON no valido"
      : "Error interno del servidor"
  });
});

// INICIAR SERVIDOR

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 32 ||
      process.env.JWT_SECRET === "REEMPLAZAR_CON_SECRETO_SEGURO"
    ) {
      throw new Error(
        "Configure una clave JWT_SECRET segura en el archivo .env"
      );
    }

    await pool.query("SELECT 1");

    console.log("Conexion con MySQL exitosa");

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor:",
      error.message
    );

    process.exit(1);
  }
}

iniciarServidor();

