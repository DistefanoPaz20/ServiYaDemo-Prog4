# ServiYa — Plataforma de servicios para el hogar

**Proyecto Final de Programación 4 · 2026**  
**Tecnicatura Universitaria en Programación (TUP) · Comisión 5**  
**Integrantes:** Paz Distefano y Elías Pérez.

## ¿Qué es ServiYa?

ServiYa es una aplicación web full stack que conecta clientes que necesitan trabajos en sus hogares con profesionales de distintos oficios. Permite registrar domicilios, buscar prestadores, solicitar servicios, enviar presupuestos, aceptarlos o rechazarlos y consultar el estado de los trabajos.

El frontend está desarrollado con React, el backend con Node.js y Express, y los datos se almacenan en una base relacional MySQL/MariaDB.

## Funcionalidades según el rol

| Rol | Funciones principales |
| --- | --- |
| **Administrador** | Panel general; CRUD de clientes, hogares, oficios, prestadores y servicios. |
| **Cliente** | Registro e inicio de sesión; perfil y hogares; búsqueda de profesionales; solicitudes; consulta y respuesta de presupuestos; cancelación de solicitudes pendientes. |
| **Prestador** | Registro e inicio de sesión; perfil; consulta de solicitudes y trabajos asignados; creación de presupuestos; finalización de trabajos. |

### Circuito principal

1. Un cliente registra su hogar y solicita un servicio a un prestador activo.
2. El prestador recibe la solicitud y envía un presupuesto.
3. El cliente acepta o rechaza el presupuesto.
4. Al aceptarlo, el sistema registra el monto y pasa el servicio a **En proceso**.
5. El prestador finaliza el trabajo y el servicio pasa a **Finalizado**.

Los cambios se realizan a través de la API y persisten en la base de datos.

## Tecnologías

| Capa | Herramientas |
| --- | --- |
| Frontend | React 19, Vite 8, JavaScript, React Router DOM, Zustand, Tailwind CSS, Recharts, Lucide React |
| Backend | Node.js, Express 5, API REST |
| Autenticación | JWT, bcrypt |
| Base de datos | MySQL/MariaDB, mysql2 |
| Desarrollo | npm workspaces, Visual Studio Code, Git, GitHub |

## Organización del repositorio

```text
ServiYaDemo-Prog4/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   └── diagrama-er.md
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

El proyecto utiliza **npm workspaces** para administrar los dos paquetes desde la raíz.

## Base de datos

La base se denomina `serviya_app` y tiene **siete tablas relacionadas**:

| Tabla | Descripción |
| --- | --- |
| `usuarios` | Credenciales, nombre, correo y rol. |
| `clientes` | Datos de clientes; opcionalmente vinculados a un usuario. |
| `hogares` | Domicilios asociados a clientes. |
| `oficios` | Especialidades profesionales. |
| `prestadores` | Profesionales asociados a un oficio; opcionalmente a un usuario. |
| `servicios` | Trabajos vinculados con un hogar y un prestador. |
| `presupuestos` | Propuestas económicas asociadas a un servicio. |

Las relaciones usan claves primarias y foráneas. Consultar el [diagrama entidad-relación](documents/diagrama-er.md) y el script [`schema.sql`](database/schema.sql).

## Requisitos para ejecutar el proyecto

- Node.js compatible con Vite 8 (recomendado **Node.js 22.12 o superior**, o una versión LTS más reciente compatible).
- npm (incluido con Node.js).
- Git.
- Servidor MySQL o MariaDB (por ejemplo, MariaDB de XAMPP).
- Editor de texto como Visual Studio Code.
- MySQL Workbench es **opcional** para administrar los datos; no es necesario para ejecutar la aplicación. El proyecto se probó con MariaDB 10.4.32 y Workbench 8.0.47.

## Instalación paso a paso

### 1. Clonar

```bash
git clone https://github.com/DistefanoPaz20/ServiYaDemo-Prog4.git
cd ServiYaDemo-Prog4
```

### 2. Instalar dependencias

Desde la **raíz** del repositorio:

```bash
npm install
```

### 3. Crear y poblar la base de datos

Iniciar el servidor MySQL/MariaDB y ejecutar **en este orden y sobre una base de datos limpia**:

1. `database/schema.sql` — crea `serviya_app`, sus tablas y sus relaciones.
2. `database/seed.sql` — carga registros iniciales de demostración.

Pueden ejecutarse desde Workbench o desde el cliente MySQL/MariaDB usando rutas absolutas:

```sql
SOURCE C:/ruta/ServiYaDemo-Prog4/database/schema.sql;
SOURCE C:/ruta/ServiYaDemo-Prog4/database/seed.sql;
```

Sustituir `C:/ruta` por la ubicación real del repositorio. **No volver a ejecutar seed.sql sobre una base ya poblada:** incluye IDs fijos y podría producir errores de duplicados.

Verificar:

```sql
USE serviya_app;
SHOW TABLES;
SELECT id, nombre, email, rol FROM usuarios;
```

### 4. Configurar el backend

Crear `backend/.env` a partir de `backend/.env.example`. Desde CMD en Windows:

```cmd
copy backend\.env.example backend\.env
```

Ejemplo para una instalación local predeterminada de XAMPP:

```dotenv
PORT=3000
FRONTEND_URL=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=serviya_app

JWT_SECRET=REEMPLAZAR_CON_SECRETO_SEGURO
```

Generar una clave privada aleatoria y reemplazar el valor de `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

El backend exige una clave JWT de **al menos 32 caracteres** que no sea el marcador del archivo de ejemplo. Ajustar el puerto y credenciales de la base de datos si la instalación local es distinta.

**Nunca subir `backend/.env` al repositorio.** Está excluido mediante `.gitignore`.

### 5. Iniciar backend y frontend

Abrir **dos terminales en la raíz del proyecto**:

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Abrir estas direcciones:

- Aplicación: http://localhost:5173
- API activa: http://localhost:3000/api/health
- Conexión a MySQL/MariaDB: http://localhost:3000/api/db-test

**Nota para Windows PowerShell:** si la política de ejecución bloquea `npm.ps1`, utilizar `npm.cmd run dev:backend` y `npm.cmd run dev:frontend`, o una terminal CMD. No es necesario desactivar la protección.

## Cuentas de prueba

Cuentas de **demostración académica** cargadas por `database/seed.sql`:

| Rol | Correo |
| --- | --- |
| Administrador | `admin@serviya.com` |
| Cliente | `cliente@serviya.com` |
| Prestador | `prestador@serviya.com` |

**Contraseña de prueba de las tres cuentas:** `ServiYa2026!`.

Las contraseñas se almacenan en la tabla `usuarios` como **hashes bcrypt**, no en texto plano. Estas credenciales son solo para el entorno académico local y no deben utilizarse en producción.

## API REST

URL base local: `http://localhost:3000/api`.

| Recurso | Métodos y rutas principales |
| --- | --- |
| `/auth` | `POST /registro`, `POST /login`, `GET /me`, `PATCH /password` |
| `/clientes` | `GET`, `POST`, `PUT`, `DELETE` |
| `/hogares` | `GET`, `POST`, `PUT`, `DELETE` |
| `/oficios` | `GET`, `POST`, `PUT`, `DELETE` |
| `/prestadores` | `GET`, `POST`, `PUT`, `DELETE` |
| `/servicios` | `GET`, `POST`, `PUT`, `DELETE`, `PATCH /:id/estado` |
| `/presupuestos` | `GET`, `POST`, `PATCH /:id/estado` |

Las rutas de consulta, modificación y eliminación por identificador utilizan `/:id` cuando corresponde. Los endpoints protegidos requieren `Authorization: Bearer <token>` y verifican los permisos del usuario en el backend.

## Seguridad y validaciones

- Contraseñas hasheadas con bcrypt.
- Inicio de sesión y verificación de tokens JWT.
- Middlewares de autenticación, autorización y permisos sobre registros.
- Validación de entradas y respuestas HTTP de error.
- Consultas SQL parametrizadas con `mysql2`.
- Secretos y variables locales excluidos del repositorio mediante `.gitignore`.

## Vistas CRUD

Se incluyen **tres vistas para cada una de cinco entidades principales** — listado, creación y edición —, para un total de **15 vistas CRUD mínimas**: clientes, hogares, oficios, prestadores y servicios. La eliminación se ejecuta desde los listados respetando restricciones de integridad.

## Prueba funcional recomendada

1. Entrar como cliente, registrar un hogar y solicitar un servicio.
2. Entrar como prestador, revisar la solicitud y generar un presupuesto.
3. Entrar como cliente y aceptar la propuesta.
4. Comprobar que el servicio pasa a **En proceso** y toma el monto aceptado.
5. Entrar como prestador y finalizar el servicio.
6. Revisar la persistencia en MySQL/MariaDB, especialmente las tablas `servicios` y `presupuestos`.

## Alcance

Este repositorio corresponde a un **proyecto académico**, no a una plataforma preparada para producción. Los cambios locales posteriores a la importación inicial no se sincronizan por Git: cada instalación dispone de su propia base de datos.

## Repositorio y autores

**Repositorio:** https://github.com/DistefanoPaz20/ServiYaDemo-Prog4

**Paz Distefano — Elías Pérez**  
Tecnicatura Universitaria en Programación · Comisión 5 · Programación 4 · 2026.
