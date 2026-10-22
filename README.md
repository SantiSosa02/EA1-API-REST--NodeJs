# Cine IUDigital

API para publicar películas y series de la Institución Universitaria Digital de Antioquia. No incluye registro de usuarios ni módulos de seguridad, tal como lo pide el caso.

## Arquitectura

La base es PostgreSQL y la conexión está en `backend/src/conexion.js`. Cada módulo pasa por tres capas: `backend/src/rutas` publica GET, POST, PUT y DELETE; `backend/src/servicios` aplica las reglas; `backend/src/funciones` lee y guarda en la base.

## Módulos

| Módulo | Qué gestiona | Regla |
| --- | --- | --- |
| Género | Nombre, estado, descripción y fechas | Una producción tiene un solo género. Al publicar solo se listan los activos. Inicia con Acción, Aventura, Ciencia ficción, Drama y Terror. |
| Director | Nombres, estado y fechas | Se guarda el director principal. Al publicar solo se listan los activos. |
| Productora | Nombre, estado, slogan, descripción y fechas | Se guarda la productora principal. Al publicar solo se listan las activas. |
| Tipo | Nombre, descripción y fechas | Inicia con Película y Serie. Se pueden crear otros. |
| Media | Serial, título, sinopsis, URL, portada, año, género, director, productora y tipo | Alta, edición, consulta y borrado. El serial y la URL son únicos. |

Las fechas de creación y actualización las asigna el sistema.

## Cómo ejecutarlo

Requiere Node.js 22 o superior y PostgreSQL con las tablas ya creadas.

```bash
npm install
npm run dev
```

En Windows también puedes ejecutar `iniciar.bat`.

- API: http://localhost:4000

## API

- `GET /api/resumen`
- `GET|POST /api/generos` y `GET|PUT|DELETE /api/generos/:id`
- `GET|POST /api/directores` y `GET|PUT|DELETE /api/directores/:id`
- `GET|POST /api/productoras` y `GET|PUT|DELETE /api/productoras/:id`
- `GET|POST /api/tipos` y `GET|PUT|DELETE /api/tipos/:id`
- `GET|POST /api/medias` y `GET|PUT|DELETE /api/medias/:id`

`GET /api/generos?estado=Activo` (igual para directores y productoras) devuelve solo los registros que se pueden asignar a una producción nueva.

La portada de una producción se envía como URL http o https en el campo `imagen`.
