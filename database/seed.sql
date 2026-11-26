USE serviya_app;

START TRANSACTION;

-- 1. USUARIOS (3 registros)
SET @passwordHash = '$2b$10$dpYBFQum4jBSHQUHF3cpx.riYgUD0avvtFp0M0QJQN1.cqhVuNplm';

INSERT INTO usuarios (id, nombre, email, password, rol)
VALUES
(1, 'Administrador', 'admin@serviya.com', @passwordHash, 'admin'),
(2, 'Juan Perez', 'cliente@serviya.com', @passwordHash, 'cliente'),
(3, 'Roberto Garcia', 'prestador@serviya.com', @passwordHash, 'prestador');

-- 2. CLIENTES (10 registros)

INSERT INTO clientes
(id, usuarioId, nombre, apellido, email, telefono)
VALUES
(1, 2, 'Juan', 'Perez', 'cliente@serviya.com', '3815550101'),
(2, NULL, 'Maria', 'Lopez', 'maria@example.com', '3815550102'),
(3, NULL, 'Carlos', 'Gomez', 'carlos@example.com', '3815550103'),
(4, NULL, 'Laura', 'Diaz', 'laura@example.com', '3815550104'),
(5, NULL, 'Diego', 'Alonso', 'diego@example.com', '3815550105'),
(6, NULL, 'Ana', 'Martinez', 'ana@example.com', '3815550106'),
(7, NULL, 'Pedro', 'Sosa', 'pedro@example.com', '3815550107'),
(8, NULL, 'Lucia', 'Ramirez', 'lucia@example.com', '3815550108'),
(9, NULL, 'Jorge', 'Fernandez', 'jorge@example.com', '3815550109'),
(10, NULL, 'Elena', 'Torres', 'elena@example.com', '3815550110');

-- 3. HOGARES (15 registros)

INSERT INTO hogares
(id, clienteId, direccion, localidad, tipo, descripcion)
VALUES
(1, 1, 'Av. Aconquija 1500', 'Yerba Buena', 'Casa', 'Vivienda familiar'),
(2, 2, 'San Martin 850', 'San Miguel de Tucuman', 'Departamento', 'Departamento residencial'),
(3, 1, 'Av. Peron 1200', 'Yerba Buena', 'Casa', 'Segunda propiedad'),
(4, 3, 'Salta 450', 'San Miguel de Tucuman', 'Casa', 'Vivienda particular'),
(5, 4, 'Jujuy 500', 'San Miguel de Tucuman', 'Departamento', 'Segundo piso'),
(6, 5, 'Rondeau 120', 'San Miguel de Tucuman', 'Casa', 'Casa familiar'),
(7, 6, 'Las Heras 400', 'San Miguel de Tucuman', 'Casa', 'Vivienda principal'),
(8, 7, 'Congreso 600', 'San Miguel de Tucuman', 'Duplex', 'Complejo residencial'),
(9, 8, 'Av. Mate de Luna 2200', 'San Miguel de Tucuman', 'Departamento', 'Tercer piso'),
(10, 9, 'Av. Solano Vera 800', 'Yerba Buena', 'Casa', 'Casa con jardin'),
(11, 10, 'Catamarca 800', 'San Miguel de Tucuman', 'Casa', 'Vivienda familiar'),
(12, 2, 'Muñecas 350', 'San Miguel de Tucuman', 'Otro', 'Local comercial'),
(13, 3, 'Av. Roca 1500', 'San Miguel de Tucuman', 'Casa', 'Segunda vivienda'),
(14, 4, 'Av. Alem 950', 'San Miguel de Tucuman', 'Departamento', 'Primer piso'),
(15, 1, 'Av. Belgrano 1800', 'San Miguel de Tucuman', 'Otro', 'Oficina particular');

-- 4. OFICIOS (6 registros)

INSERT INTO oficios (id, nombre, descripcion)
VALUES
(1, 'Plomería', 'Instalacion y reparacion de cañerias'),
(2, 'Electricidad', 'Instalaciones y reparaciones electricas'),
(3, 'Cerrajería', 'Reparacion y cambio de cerraduras'),
(4, 'Pintura', 'Pintura de interiores y exteriores'),
(5, 'Climatización', 'Instalacion y mantenimiento de aires acondicionados'),
(6, 'Carpintería', 'Fabricacion y reparacion de muebles');

-- 5. PRESTADORES (10 registros)

INSERT INTO prestadores
(id, usuarioId, oficioId, nombre, apellido, email, telefono, experiencia, estado)
VALUES
(1, 3, 1, 'Roberto', 'Garcia', 'prestador@serviya.com', '3815550201', 8, 'Activo'),
(2, NULL, 2, 'Miguel', 'Fernandez', 'miguel@example.com', '3815550202', 5, 'Activo'),
(3, NULL, 6, 'Diego', 'Martinez', 'diegom@example.com', '3815550203', 10, 'Inactivo'),
(4, NULL, 3, 'Antonio', 'Gimenez', 'antonio@example.com', '3815550204', 7, 'Activo'),
(5, NULL, 4, 'Hector', 'Ruiz', 'hector@example.com', '3815550205', 12, 'Activo'),
(6, NULL, 5, 'Pablo', 'Sanchez', 'pablo@example.com', '3815550206', 6, 'Activo'),
(7, NULL, 1, 'Martin', 'Acosta', 'martin@example.com', '3815550207', 4, 'Activo'),
(8, NULL, 2, 'Nicolas', 'Vega', 'nicolas@example.com', '3815550208', 9, 'Activo'),
(9, NULL, 6, 'Luis', 'Herrera', 'luis@example.com', '3815550209', 15, 'Activo'),
(10, NULL, 5, 'Daniel', 'Castro', 'daniel@example.com', '3815550210', 3, 'Activo');

-- 6. SERVICIOS (15 registros)

INSERT INTO servicios
(id, hogarId, prestadorId, descripcion, fecha, precio, estado)
VALUES
(1, 1, 1, 'Reparacion de perdida de agua', '2026-11-19', 45000, 'Finalizado'),
(2, 2, 2, 'Instalacion de tomacorrientes', '2026-11-20', 35000, 'Finalizado'),
(3, 3, 1, 'Reparacion de cañeria del baño', '2026-11-25', 0, 'Pendiente'),
(4, 4, 4, 'Cambio de cerradura principal', '2026-11-21', 28000, 'Finalizado'),
(5, 5, 5, 'Pintura de dormitorio', '2026-11-23', 85000, 'En proceso'),
(6, 6, 6, 'Mantenimiento de aire acondicionado', '2026-11-22', 40000, 'Finalizado'),
(7, 7, 7, 'Instalacion de griferia', '2026-11-24', 0, 'Pendiente'),
(8, 8, 8, 'Revision de tablero electrico', '2026-11-25', 0, 'Pendiente'),
(9, 9, 9, 'Reparacion de puerta de madera', '2026-11-24', 55000, 'En proceso'),
(10, 10, 10, 'Instalacion de aire acondicionado', '2026-11-25', 0, 'Pendiente'),
(11, 11, 5, 'Pintura de fachada', '2026-11-23', 0, 'Cancelado'),
(12, 12, 2, 'Instalacion de luminarias', '2026-11-24', 0, 'Pendiente'),
(13, 13, 4, 'Reparacion de cerradura', '2026-11-25', 0, 'Pendiente'),
(14, 14, 6, 'Limpieza de aire acondicionado', '2026-11-24', 0, 'Pendiente'),
(15, 15, 1, 'Reparacion de canilla', '2026-11-25', 0, 'Pendiente');

-- 7. PRESUPUESTOS (7 registros)

INSERT INTO presupuestos
(id, servicioId, descripcion, monto, fecha, estado)
VALUES
(1, 1, 'Reparacion de perdida y materiales', 45000, '2026-11-19', 'Aceptado'),
(2, 2, 'Instalacion electrica y mano de obra', 35000, '2026-11-20', 'Aceptado'),
(3, 3, 'Reparacion completa de cañeria', 65000, '2026-11-25', 'Pendiente'),
(4, 5, 'Pintura y preparacion de paredes', 85000, '2026-11-23', 'Aceptado'),
(5, 7, 'Instalacion de griferia nueva', 32000, '2026-11-24', 'Pendiente'),
(6, 9, 'Reparacion y ajuste de puerta', 55000, '2026-11-24', 'Aceptado'),
(7, 11, 'Pintura exterior completa', 120000, '2026-11-23', 'Rechazado');

COMMIT;