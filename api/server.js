// =============================================================
// IMPORTACIONES
// =============================================================

// Módulo HTTP nativo de Node.js.
// Nos permite crear el servidor.
const http =
    require("http");


// Módulo para trabajar con archivos.
const fs =
    require("fs");


// Módulo para trabajar con rutas.
const path =
    require("path");


// Clase URL de Node.js.
const { URL } =
    require("url");


// =============================================================
// CONFIGURACIÓN DEL SERVIDOR
// =============================================================

// Puerto donde funcionará la aplicación.
//
// Si existe la variable PORT se utiliza,
// caso contrario se usa el puerto 3000.
const PORT =
    process.env.PORT
    ||
    3000;


// Carpeta raíz del proyecto.
//
// __dirname actualmente apunta a:
//
// /api
//
// ".." significa regresar a la carpeta principal.
const ROOT =
    path.join(
        __dirname,
        ".."
    );


// =============================================================
// BASE DE DATOS SIMULADA
// =============================================================

// Para que la práctica sea sencilla,
// utilizamos un arreglo en memoria.
//
// Cuando el servidor se reinicie,
// estos productos volverán a su estado original.
let productos = [

    {
        id: 1,
        nombre: "Laptop",
        precio: 899.99
    },

    {
        id: 2,
        nombre: "Mouse inalámbrico",
        precio: 24.50
    },

    {
        id: 3,
        nombre: "Monitor 24 pulgadas",
        precio: 179.90
    }

];


// ID que utilizaremos para crear nuevos productos.
let siguienteId =
    4;


// =============================================================
// FUNCIÓN PARA ENVIAR RESPUESTAS JSON
// =============================================================

function enviarJson(
    res,
    statusCode,
    data
) {

    // Convertimos el objeto JavaScript en JSON.
    const body =
        JSON.stringify(
            data,
            null,
            2
        );


    // Configuramos encabezados HTTP.
    res.writeHead(
        statusCode,
        {

            "Content-Type":
                "application/json; charset=utf-8",

            "Content-Length":
                Buffer.byteLength(
                    body
                )

        }
    );


    // Terminamos la respuesta.
    res.end(
        body
    );

}


// =============================================================
// LEER BODY JSON DE UNA PETICIÓN
// =============================================================

function leerBodyJson(req) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            // Aquí almacenaremos el contenido recibido.
            let body =
                "";


            // Cada vez que llegan datos,
            // los acumulamos.
            req.on(
                "data",
                chunk => {

                    body +=
                        chunk;


                    // Protección para no aceptar
                    // peticiones excesivamente grandes.
                    if (
                        body.length
                        >
                        1_000_000
                    ) {

                        reject(
                            new Error(
                                "El cuerpo de la petición es demasiado grande."
                            )
                        );

                        req.destroy();

                    }

                }
            );


            // Cuando terminamos de recibir información.
            req.on(
                "end",
                () => {

                    // Si no existe body,
                    // retornamos un objeto vacío.
                    if (!body.trim()) {

                        resolve({});

                        return;

                    }


                    try {

                        // Intentamos convertir a JSON.
                        const data =
                            JSON.parse(
                                body
                            );

                        resolve(
                            data
                        );

                    }

                    catch (error) {

                        reject(
                            new Error(
                                "El cuerpo enviado no contiene un JSON válido."
                            )
                        );

                    }

                }
            );


            // Error de comunicación.
            req.on(
                "error",
                reject
            );

        }
    );

}


// =============================================================
// VALIDAR PRODUCTO
// =============================================================

function validarProducto(data) {

    // Comprobamos que exista.
    if (!data) {

        return false;

    }


    // Nombre debe ser texto.
    if (
        typeof data.nombre
        !==
        "string"
    ) {

        return false;

    }


    // Nombre no debe estar vacío.
    if (
        data.nombre.trim()
        ===
        ""
    ) {

        return false;

    }


    // Precio debe ser número.
    if (
        typeof data.precio
        !==
        "number"
    ) {

        return false;

    }


    // Debe ser número válido.
    if (
        !Number.isFinite(
            data.precio
        )
    ) {

        return false;

    }


    // Precio no puede ser negativo.
    if (
        data.precio < 0
    ) {

        return false;

    }


    return true;

}


// =============================================================
// MANEJADOR DE LA WEB API
// =============================================================

async function manejarApi(
    req,
    res,
    pathname
) {


    // =========================================================
    // GET /api/health
    // =========================================================
    //
    // Endpoint utilizado para comprobar
    // si la API se encuentra funcionando.

    if (
        req.method === "GET"
        &&
        pathname === "/api/health"
    ) {

        return enviarJson(
            res,
            200,
            {

                estado:
                    "ok",

                servicio:
                    "API REST de productos"

            }
        );

    }


    // =========================================================
    // GET /api/productos
    // =========================================================
    //
    // Retorna todos los productos.

    if (
        req.method === "GET"
        &&
        pathname === "/api/productos"
    ) {

        return enviarJson(
            res,
            200,
            productos
        );

    }


    // =========================================================
    // POST /api/productos
    // =========================================================
    //
    // Crea un nuevo producto.

    if (
        req.method === "POST"
        &&
        pathname === "/api/productos"
    ) {

        try {

            // Leemos el JSON enviado.
            const data =
                await leerBodyJson(
                    req
                );


            // Validamos los datos.
            if (
                !validarProducto(
                    data
                )
            ) {

                return enviarJson(
                    res,
                    400,
                    {

                        mensaje:
                            "Datos inválidos. Debes enviar nombre y precio."

                    }
                );

            }


            // Creamos el nuevo objeto.
            const nuevoProducto = {

                id:
                    siguienteId++,

                nombre:
                    data
                        .nombre
                        .trim(),

                precio:
                    data.precio

            };


            // Agregamos a nuestro arreglo.
            productos.push(
                nuevoProducto
            );


            // 201 significa Created.
            return enviarJson(
                res,
                201,
                {

                    mensaje:
                        "Producto creado correctamente.",

                    producto:
                        nuevoProducto

                }
            );

        }

        catch (error) {

            return enviarJson(
                res,
                400,
                {

                    mensaje:
                        error.message

                }
            );

        }

    }


    // =========================================================
    // DETECTAR ENDPOINT CON ID
    // =========================================================
    //
    // Ejemplo:
    //
    // /api/productos/1
    // /api/productos/25

    const matchProducto =
        pathname.match(
            /^\/api\/productos\/(\d+)$/
        );


    // Si la URI contiene un ID de producto.
    if (matchProducto) {

        // Convertimos ID a número.
        const id =
            Number(
                matchProducto[1]
            );


        // Buscamos la posición del producto.
        const indice =
            productos.findIndex(
                producto =>
                    producto.id === id
            );


        // =====================================================
        // GET /api/productos/:id
        // =====================================================
        //
        // Buscar un producto específico.

        if (
            req.method === "GET"
        ) {

            // Producto inexistente.
            if (
                indice === -1
            ) {

                return enviarJson(
                    res,
                    404,
                    {

                        mensaje:
                            "Producto no encontrado."

                    }
                );

            }


            // Producto encontrado.
            return enviarJson(
                res,
                200,
                productos[indice]
            );

        }


        // =====================================================
        // PUT /api/productos/:id
        // =====================================================
        //
        // Actualizar producto.

        if (
            req.method === "PUT"
        ) {

            // Primero comprobamos si existe.
            if (
                indice === -1
            ) {

                return enviarJson(
                    res,
                    404,
                    {

                        mensaje:
                            "Producto no encontrado."

                    }
                );

            }


            try {

                // Leemos el body.
                const data =
                    await leerBodyJson(
                        req
                    );


                // Validamos.
                if (
                    !validarProducto(
                        data
                    )
                ) {

                    return enviarJson(
                        res,
                        400,
                        {

                            mensaje:
                                "Datos inválidos. Debes enviar nombre y precio."

                        }
                    );

                }


                // Actualizamos el producto.
                productos[indice] = {

                    id:
                        id,

                    nombre:
                        data
                            .nombre
                            .trim(),

                    precio:
                        data.precio

                };


                // Retornamos producto actualizado.
                return enviarJson(
                    res,
                    200,
                    {

                        mensaje:
                            "Producto actualizado correctamente.",

                        producto:
                            productos[indice]

                    }
                );

            }

            catch (error) {

                return enviarJson(
                    res,
                    400,
                    {

                        mensaje:
                            error.message

                    }
                );

            }

        }


        // =====================================================
        // DELETE /api/productos/:id
        // =====================================================
        //
        // Elimina un producto.

        if (
            req.method === "DELETE"
        ) {

            // Validamos si existe.
            if (
                indice === -1
            ) {

                return enviarJson(
                    res,
                    404,
                    {

                        mensaje:
                            "Producto no encontrado."

                    }
                );

            }


            // Eliminamos 1 elemento del arreglo.
            const [
                productoEliminado
            ] =
                productos.splice(
                    indice,
                    1
                );


            // Respondemos.
            return enviarJson(
                res,
                200,
                {

                    mensaje:
                        "Producto eliminado correctamente.",

                    producto:
                        productoEliminado

                }
            );

        }

    }


    // =========================================================
    // ENDPOINT NO EXISTENTE
    // =========================================================

    return enviarJson(
        res,
        404,
        {

            mensaje:
                "Endpoint no encontrado."

        }
    );

}


// =============================================================
// SERVIDOR DE ARCHIVOS ESTÁTICOS
// =============================================================
//
// Esta función permite mostrar:
//
// index.html
// styles.css
// app.js

function servirArchivoEstatico(
    req,
    res,
    pathname
) {

    // Si entramos a "/",
    // mostramos index.html.
    const rutaSolicitada =

        pathname === "/"

        ?

        "/index.html"

        :

        pathname;


    // Normalizamos la ruta.
    const rutaSegura =

        path
            .normalize(
                rutaSolicitada
            )
            .replace(
                /^(\.\.[/\\])+/,
                ""
            );


    // Construimos ruta completa.
    const filePath =

        path.join(
            ROOT,
            rutaSegura
        );


    // Protección básica.
    if (
        !filePath.startsWith(
            ROOT
        )
    ) {

        res.writeHead(
            403,
            {
                "Content-Type":
                    "text/plain; charset=utf-8"
            }
        );

        return res.end(
            "Acceso denegado."
        );

    }


    // Obtenemos extensión.
    const extension =

        path
            .extname(
                filePath
            )
            .toLowerCase();


    // Tipos MIME.
    const tipos = {

        ".html":
            "text/html; charset=utf-8",

        ".css":
            "text/css; charset=utf-8",

        ".js":
            "text/javascript; charset=utf-8",

        ".json":
            "application/json; charset=utf-8",

        ".png":
            "image/png",

        ".jpg":
            "image/jpeg",

        ".jpeg":
            "image/jpeg",

        ".svg":
            "image/svg+xml"

    };


    // Leemos archivo.
    fs.readFile(
        filePath,
        (
            error,
            data
        ) => {

            // Archivo inexistente.
            if (error) {

                res.writeHead(
                    404,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );

                return res.end(
                    "Archivo no encontrado."
                );

            }


            // Archivo encontrado.
            res.writeHead(
                200,
                {

                    "Content-Type":

                        tipos[extension]

                        ||

                        "application/octet-stream"

                }
            );


            // Enviamos contenido.
            res.end(
                data
            );

        }
    );

}


// =============================================================
// CREACIÓN DEL SERVIDOR HTTP
// =============================================================

const server =
    http.createServer(

        async (
            req,
            res
        ) => {

            // Construimos la URL.
            const url =
                new URL(

                    req.url,

                    `http://${req.headers.host || "localhost"}`

                );


            // Obtenemos solamente la ruta.
            const pathname =
                decodeURIComponent(
                    url.pathname
                );


            // =================================================
            // SI COMIENZA CON /api/
            // ES UNA PETICIÓN DE LA WEB API
            // =================================================

            if (
                pathname.startsWith(
                    "/api/"
                )
            ) {

                return manejarApi(
                    req,
                    res,
                    pathname
                );

            }


            // =================================================
            // CASO CONTRARIO SERVIMOS HTML/CSS/JS
            // =================================================

            servirArchivoEstatico(
                req,
                res,
                pathname
            );

        }

    );


// =============================================================
// INICIAR SERVIDOR
// =============================================================

server.listen(
    PORT,
    () => {

        console.log(
            "=============================================="
        );

        console.log(
            "       REST & WEB API - GRUPO D"
        );

        console.log(
            "=============================================="
        );


        console.log(
            `Presentación: http://localhost:${PORT}`
        );


        console.log(
            `Web API: http://localhost:${PORT}/api/productos`
        );


        console.log(
            ""
        );


        console.log(
            "Servidor ejecutándose correctamente."
        );


        console.log(
            "Presiona Ctrl + C para detenerlo."
        );

    }
);