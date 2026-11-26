# Diagrama entidad-relación — ServiYa

El diagrama representa las siete tablas definidas en `database/schema.sql`, con claves primarias, foráneas y relaciones.

```mermaid
erDiagram
    USUARIOS ||--o| CLIENTES : "cuenta opcional"
    USUARIOS ||--o| PRESTADORES : "cuenta opcional"
    CLIENTES ||--o{ HOGARES : "registra"
    OFICIOS ||--o{ PRESTADORES : "clasifica"
    HOGARES ||--o{ SERVICIOS : "solicita"
    PRESTADORES ||--o{ SERVICIOS : "atiende"
    SERVICIOS ||--o{ PRESUPUESTOS : "recibe"

    USUARIOS {
        int id PK
        varchar nombre
        varchar email UK
        varchar password
        enum rol
        timestamp createdAt
    }
    CLIENTES {
        int id PK
        int usuarioId FK,UK
        varchar nombre
        varchar apellido
        varchar email UK
        varchar telefono
    }
    HOGARES {
        int id PK
        int clienteId FK
        varchar direccion
        varchar localidad
        enum tipo
        text descripcion
    }
    OFICIOS {
        int id PK
        varchar nombre UK
        text descripcion
    }
    PRESTADORES {
        int id PK
        int usuarioId FK,UK
        int oficioId FK
        varchar nombre
        varchar apellido
        varchar email UK
        varchar telefono
        int experiencia
        enum estado
    }
    SERVICIOS {
        int id PK
        int hogarId FK
        int prestadorId FK
        text descripcion
        date fecha
        decimal precio
        enum estado
        timestamp createdAt
    }
    PRESUPUESTOS {
        int id PK
        int servicioId FK
        text descripcion
        decimal monto
        date fecha
        enum estado
    }
```

**Referencias:** PK = clave primaria; FK = clave foránea; UK = índice único.

Los campos `usuarioId` de `clientes` y `prestadores` son opcionales y únicos; permiten asociar cuentas de acceso sin exigir usuario para todos los perfiles de demostración. Los demás vínculos se realizan con claves foráneas obligatorias. El esquema aplica restricciones de integridad referencial que impiden eliminar registros cuando otros dependen de ellos.
