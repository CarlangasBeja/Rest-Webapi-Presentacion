# REST y Web API - Grupo D

Proyecto desarrollado para la exposición grupal de la **Unidad 3: Microservicios y Web API orientados a SOA**.

El objetivo del proyecto es explicar de forma teórica y práctica los principales conceptos relacionados con **REST y Web API**, además de demostrar el consumo de una API mediante peticiones HTTP.

---

## Tema de la exposición

**Grupo D - REST y Web API**

Durante la exposición se explican los siguientes conceptos:

- API
- Web API
- REST
- Recurso
- Endpoint
- URI
- Arquitectura cliente-servidor
- Métodos HTTP
- Códigos de estado HTTP
- Formato JSON

Además, se implementa una Web API sencilla para administrar productos.

---

## Tecnologías utilizadas

El proyecto utiliza:

- HTML5
- CSS3
- JavaScript
- Node.js
- HTTP
- JSON
- Git
- GitHub

No se utilizan librerías externas para el servidor, ya que la API fue desarrollada utilizando el módulo HTTP nativo de Node.js.

---

## Estructura del proyecto

```text
exposicion-rest-webapi/
│
├── index.html
├── package.json
├── README.md
│
├── css/
│   └── styles.css
│
├── js/
│   └── app.js
│
└── api/
    └── server.js
```

### Descripción de los archivos

**index.html**

Contiene la interfaz principal de la exposición y las diferentes secciones utilizadas para explicar los conceptos de REST y Web API.

**css/styles.css**

Contiene todos los estilos visuales del proyecto, incluyendo:

- Diseño tecnológico
- Modo claro y oscuro
- Animaciones
- Diseño responsive para computadora, tablet y celular

**js/app.js**

Contiene la lógica del lado del cliente.

Se encarga de:

- Cambiar entre modo claro y oscuro
- Controlar el menú responsive
- Ejecutar animaciones
- Consumir la Web API mediante `fetch`
- Mostrar las respuestas HTTP

**api/server.js**

Contiene la Web API REST desarrollada con Node.js.

Implementa operaciones para:

- Listar productos
- Buscar productos
- Crear productos
- Actualizar productos
- Eliminar productos

---

# Web API REST

La API utiliza como recurso principal:

```text
Producto
```

Los productos se almacenan temporalmente en memoria para facilitar la demostración de la exposición.

Ejemplo de producto:

```json
{
  "id": 1,
  "nombre": "Laptop",
  "precio": 899.99
}
```

---

## Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Comprobar funcionamiento de la API |
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Buscar producto por ID |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |

---

# Ejemplos de peticiones

## Listar productos

```http
GET /api/productos
```

Respuesta:

```json
[
  {
    "id": 1,
    "nombre": "Laptop",
    "precio": 899.99
  },
  {
    "id": 2,
    "nombre": "Mouse inalámbrico",
    "precio": 24.5
  }
]
```

Código HTTP:

```text
200 OK
```

---

## Buscar un producto

```http
GET /api/productos/1
```

Respuesta:

```json
{
  "id": 1,
  "nombre": "Laptop",
  "precio": 899.99
}
```

---

## Crear producto

```http
POST /api/productos
```

Body:

```json
{
  "nombre": "Teclado mecánico",
  "precio": 75.5
}
```

Respuesta:

```json
{
  "mensaje": "Producto creado correctamente.",
  "producto": {
    "id": 4,
    "nombre": "Teclado mecánico",
    "precio": 75.5
  }
}
```

Código HTTP:

```text
201 Created
```

---

## Actualizar producto

```http
PUT /api/productos/1
```

Body:

```json
{
  "nombre": "Laptop actualizada",
  "precio": 949.99
}
```

Respuesta:

```json
{
  "mensaje": "Producto actualizado correctamente.",
  "producto": {
    "id": 1,
    "nombre": "Laptop actualizada",
    "precio": 949.99
  }
}
```

---

## Eliminar producto

```http
DELETE /api/productos/3
```

Respuesta:

```json
{
  "mensaje": "Producto eliminado correctamente."
}
```

---

# Códigos HTTP utilizados

Durante la práctica se utilizan diferentes códigos de estado HTTP.

| Código | Significado |
|---|---|
| 200 | Solicitud realizada correctamente |
| 201 | Recurso creado correctamente |
| 400 | Datos enviados incorrectos |
| 404 | Recurso o endpoint no encontrado |
| 500 | Error interno del servidor |

---

# Arquitectura cliente-servidor

El proyecto utiliza una arquitectura cliente-servidor.

```text
CLIENTE
   │
   │ Petición HTTP
   ▼
WEB API REST
   │
   │ Procesamiento
   ▼
SERVIDOR
   │
   │ Respuesta HTTP + JSON
   ▼
CLIENTE
```

El cliente puede ser:

- La página web desarrollada en este proyecto
- Postman
- Insomnia
- curl
- Otra aplicación

---

# Cómo ejecutar el proyecto

## Requisitos

Tener instalado Node.js.

Para comprobarlo:

```bash
node -v
```

También se puede comprobar npm:

```bash
npm -v
```

---

## Ejecutar

Abrir una terminal dentro de la carpeta del proyecto.

Ejecutar:

```bash
npm start
```

El servidor mostrará algo similar a:

```text
==============================================
       REST & WEB API - GRUPO D
==============================================

Presentación: http://localhost:3000
Web API: http://localhost:3000/api/productos

Servidor ejecutándose correctamente.
Presiona Ctrl + C para detenerlo.
```

Abrir en el navegador:

```text
http://localhost:3000
```

---

# Probar la API desde el navegador

Para consultar los productos:

```text
http://localhost:3000/api/productos
```

Para consultar el producto con ID 1:

```text
http://localhost:3000/api/productos/1
```

Para comprobar el estado del servidor:

```text
http://localhost:3000/api/health
```

---

# Probar con Postman

Ejemplo:

```text
GET http://localhost:3000/api/productos
```

Presionar **Send**.

El servidor responderá con los productos disponibles en formato JSON.

Para crear un producto:

```text
POST http://localhost:3000/api/productos
```

Seleccionar:

```text
Body
→ raw
→ JSON
```

Ingresar:

```json
{
  "nombre": "Audifonos",
  "precio": 45.99
}
```

Presionar **Send**.

La API responderá con:

```text
201 Created
```

---

# Funcionalidades de la interfaz

La página web incorpora:

- Navegación entre secciones
- Diseño tecnológico
- Animaciones
- Modo claro
- Modo oscuro
- Diseño responsive
- Cliente HTTP integrado
- Peticiones GET
- Peticiones POST
- Peticiones PUT
- Peticiones DELETE
- Visualización de códigos HTTP
- Visualización de respuestas JSON

---

# Objetivo académico

Este proyecto demuestra cómo una aplicación cliente puede comunicarse con un servicio mediante HTTP utilizando una arquitectura REST.

Permite identificar de forma práctica los conceptos de:

- Recurso
- URI
- Endpoint
- Método HTTP
- Petición
- Respuesta
- Código de estado
- JSON
- Cliente
- Servidor

---

## Asignatura

**Unidad 3 - Microservicios y Web API orientados a SOA**

**Tema:** REST y Web API

**Grupo:** D
