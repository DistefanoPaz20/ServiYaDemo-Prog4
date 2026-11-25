

CREATE DATABASE IF NOT EXISTS serviya_app
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE serviya_app;

-- 1. USUARIOS

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cliente', 'prestador') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. CLIENTES

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,

    FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. HOGARES

CREATE TABLE hogares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    tipo ENUM(
        'Casa',
        'Departamento',
        'Duplex',
        'Otro'
    ) NOT NULL,
    descripcion TEXT,

    FOREIGN KEY (clienteId)
        REFERENCES clientes(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. OFICIOS

CREATE TABLE oficios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB;

-- 5. PRESTADORES

CREATE TABLE prestadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT UNIQUE,
    oficioId INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    experiencia INT UNSIGNED NOT NULL DEFAULT 0,
    estado ENUM('Activo', 'Inactivo')
        NOT NULL DEFAULT 'Activo',

    FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (oficioId)
        REFERENCES oficios(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. SERVICIOS

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hogarId INT NOT NULL,
    prestadorId INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    precio DECIMAL(12, 2) UNSIGNED NOT NULL DEFAULT 0,
    estado ENUM(
        'Pendiente',
        'En proceso',
        'Finalizado',
        'Cancelado'
    ) NOT NULL DEFAULT 'Pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hogarId)
        REFERENCES hogares(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (prestadorId)
        REFERENCES prestadores(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. PRESUPUESTOS

CREATE TABLE presupuestos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicioId INT NOT NULL,
    descripcion TEXT NOT NULL,
    monto DECIMAL(12, 2) UNSIGNED NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM(
        'Pendiente',
        'Aceptado',
        'Rechazado'
    ) NOT NULL DEFAULT 'Pendiente',

    FOREIGN KEY (servicioId)
        REFERENCES servicios(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;