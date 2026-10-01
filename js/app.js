// =============================================================
// REFERENCIAS PRINCIPALES DEL DOCUMENTO
// =============================================================

// Elemento raíz <html>.
const root = document.documentElement;

// Botón para cambiar entre modo claro y oscuro.
const themeToggle =
    document.getElementById("themeToggle");

// Icono del tema.
const themeIcon =
    document.getElementById("themeIcon");

// Botón hamburguesa para celulares.
const menuToggle =
    document.getElementById("menuToggle");

// Menú móvil.
const mobileMenu =
    document.getElementById("mobileMenu");

// Botón para regresar al inicio.
const backToTop =
    document.getElementById("backToTop");


// =============================================================
// MODO CLARO / OSCURO
// =============================================================

// Recuperamos el tema guardado anteriormente.
const savedTheme =
    localStorage.getItem("restApiTheme");


// Si el usuario había seleccionado modo claro,
// lo activamos automáticamente.
if (savedTheme === "light") {

    root.setAttribute(
        "data-theme",
        "light"
    );

    themeIcon.textContent =
        "☀";
}


// Evento para cambiar el tema.
themeToggle.addEventListener(
    "click",
    () => {

        // Consultamos el tema actual.
        const currentTheme =
            root.getAttribute(
                "data-theme"
            );


        // Si está claro, cambiamos a oscuro.
        if (currentTheme === "light") {

            root.removeAttribute(
                "data-theme"
            );

            themeIcon.textContent =
                "☾";

            localStorage.setItem(
                "restApiTheme",
                "dark"
            );

        }

        // Caso contrario activamos modo claro.
        else {

            root.setAttribute(
                "data-theme",
                "light"
            );

            themeIcon.textContent =
                "☀";

            localStorage.setItem(
                "restApiTheme",
                "light"
            );

        }

    }
);


// =============================================================
// MENÚ RESPONSIVE
// =============================================================

menuToggle.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle(
            "open"
        );

    }
);


// Cerramos el menú al seleccionar una opción.
mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "open"
                );

            }
        );

    });


// =============================================================
// BOTÓN VOLVER ARRIBA
// =============================================================

// Detectamos el scroll de la página.
window.addEventListener(
    "scroll",
    () => {

        // Mostramos el botón después de 500 píxeles.
        if (window.scrollY > 500) {

            backToTop.classList.add(
                "visible"
            );

        }
        else {

            backToTop.classList.remove(
                "visible"
            );

        }

    }
);


// Al hacer clic regresamos al inicio.
backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


// =============================================================
// ANIMACIONES DE APARICIÓN AL HACER SCROLL
// =============================================================

// IntersectionObserver permite detectar cuándo un elemento
// aparece dentro de la pantalla.
const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("visible");

                    }

                }
            );

        },

        {
            threshold: 0.12
        }

    );


// Aplicamos el observador a todos los elementos
// con la clase "reveal".
document
    .querySelectorAll(".reveal")
    .forEach(
        element => {

            observer.observe(
                element
            );

        }
    );


// =============================================================
// CLIENTE HTTP PARA CONSUMIR LA WEB API
// =============================================================

// Selector del método HTTP.
const methodSelect =
    document.getElementById(
        "methodSelect"
    );

// Campo del endpoint.
const endpointInput =
    document.getElementById(
        "endpointInput"
    );

// Campo del JSON.
const bodyInput =
    document.getElementById(
        "bodyInput"
    );

// Botón para enviar petición.
const sendRequest =
    document.getElementById(
        "sendRequest"
    );

// Lugar donde mostramos la respuesta.
const responseOutput =
    document.getElementById(
        "responseOutput"
    );

// Código HTTP mostrado visualmente.
const responseBadge =
    document.getElementById(
        "responseBadge"
    );

// Indicador API ONLINE/OFFLINE.
const apiStatus =
    document.getElementById(
        "apiStatus"
    );


// =============================================================
// EJEMPLOS DE PETICIONES
// =============================================================

const examples = {

    // ---------------------------------------------------------
    // GET - LISTAR TODOS
    // ---------------------------------------------------------

    list: {

        method:
            "GET",

        endpoint:
            "/api/productos",

        body:
            ""

    },


    // ---------------------------------------------------------
    // GET - BUSCAR UNO
    // ---------------------------------------------------------

    one: {

        method:
            "GET",

        endpoint:
            "/api/productos/1",

        body:
            ""

    },


    // ---------------------------------------------------------
    // POST - CREAR
    // ---------------------------------------------------------

    create: {

        method:
            "POST",

        endpoint:
            "/api/productos",

        body:
            JSON.stringify(
                {
                    nombre:
                        "Teclado mecánico",

                    precio:
                        75.50
                },

                null,

                2
            )

    },


    // ---------------------------------------------------------
    // PUT - ACTUALIZAR
    // ---------------------------------------------------------

    update: {

        method:
            "PUT",

        endpoint:
            "/api/productos/1",

        body:
            JSON.stringify(
                {
                    nombre:
                        "Laptop actualizada",

                    precio:
                        949.99
                },

                null,

                2
            )

    },


    // ---------------------------------------------------------
    // DELETE - ELIMINAR
    // ---------------------------------------------------------

    delete: {

        method:
            "DELETE",

        endpoint:
            "/api/productos/3",

        body:
            ""

    }

};


// =============================================================
// BOTONES RÁPIDOS DE LA DEMOSTRACIÓN
// =============================================================

document
    .querySelectorAll(
        "[data-example]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    // Obtenemos el nombre del ejemplo.
                    const exampleName =
                        button.dataset.example;


                    // Recuperamos la configuración.
                    const example =
                        examples[
                            exampleName
                        ];


                    // Colocamos automáticamente
                    // los datos en el formulario.
                    methodSelect.value =
                        example.method;

                    endpointInput.value =
                        example.endpoint;

                    bodyInput.value =
                        example.body;

                }
            );

        }
    );


// =============================================================
// COMPROBAR SI LA API ESTÁ FUNCIONANDO
// =============================================================

async function checkApi() {

    try {

        // Endpoint especial utilizado únicamente
        // para comprobar que el servidor está activo.
        const response =
            await fetch(
                "/api/health"
            );


        // Si el servidor respondió con error.
        if (!response.ok) {

            throw new Error(
                "API no disponible"
            );

        }


        // Mostramos que la API está disponible.
        apiStatus.textContent =
            "API ONLINE";

        apiStatus.classList.add(
            "online"
        );

    }

    catch (error) {

        apiStatus.textContent =
            "API OFFLINE";

        apiStatus.classList.remove(
            "online"
        );

    }

}


// =============================================================
// EJECUTAR PETICIÓN HTTP
// =============================================================

async function executeRequest() {

    // Recuperamos método seleccionado.
    const method =
        methodSelect.value;


    // Recuperamos endpoint.
    const endpoint =
        endpointInput
            .value
            .trim();


    // Recuperamos body.
    const rawBody =
        bodyInput
            .value
            .trim();


    // =========================================================
    // VALIDAR ENDPOINT
    // =========================================================

    if (!endpoint.startsWith("/")) {

        showClientError(
            "El endpoint debe comenzar con /. Ejemplo: /api/productos"
        );

        return;

    }


    // =========================================================
    // CONFIGURAR FETCH
    // =========================================================

    const options = {

        method:

            method,

        headers: {

            "Accept":
                "application/json"

        }

    };


    // POST y PUT normalmente envían información.
    if (
        method === "POST" ||
        method === "PUT"
    ) {

        // El body no puede estar vacío.
        if (!rawBody) {

            showClientError(
                "Debes ingresar un body JSON."
            );

            return;

        }


        // Comprobamos que sea JSON válido.
        try {

            JSON.parse(
                rawBody
            );

        }

        catch (error) {

            showClientError(
                "El body ingresado no contiene un JSON válido."
            );

            return;

        }


        // Indicamos que estamos enviando JSON.
        options.headers[
            "Content-Type"
        ] =
            "application/json";


        // Asignamos el cuerpo.
        options.body =
            rawBody;

    }


    // =========================================================
    // CAMBIAR INTERFAZ DURANTE LA PETICIÓN
    // =========================================================

    sendRequest.disabled =
        true;

    sendRequest.textContent =
        "Enviando...";

    responseBadge.textContent =
        "Procesando";

    responseBadge.className =
        "response-badge";


    // Guardamos el tiempo inicial.
    const startedAt =
        performance.now();


    try {

        // =====================================================
        // PETICIÓN HTTP REAL
        // =====================================================

        const response =
            await fetch(
                endpoint,
                options
            );


        // Calculamos tiempo de respuesta.
        const elapsed =
            Math.round(
                performance.now()
                -
                startedAt
            );


        // Revisamos tipo de contenido.
        const contentType =
            response
                .headers
                .get(
                    "content-type"
                )
                ||
                "";


        let data;


        // Si recibimos JSON lo convertimos.
        if (
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        }

        // Caso contrario recibimos texto.
        else {

            data =
                await response.text();

        }


        // =====================================================
        // MOSTRAR CÓDIGO HTTP
        // =====================================================

        responseBadge.textContent =
            `${response.status} ${response.statusText} · ${elapsed} ms`;


        // Si el código está entre 200 y 299.
        if (response.ok) {

            responseBadge.className =
                "response-badge ok";

        }

        else {

            responseBadge.className =
                "response-badge error";

        }


        // =====================================================
        // MOSTRAR PETICIÓN Y RESPUESTA
        // =====================================================

        const result = {

            request: {

                method:
                    method,

                uri:
                    endpoint

            },

            response: {

                status:
                    response.status,

                statusText:
                    response.statusText,

                data:
                    data

            }

        };


        responseOutput.textContent =
            JSON.stringify(
                result,
                null,
                2
            );

    }

    catch (error) {

        // Error de comunicación.
        responseBadge.textContent =
            "Error de conexión";

        responseBadge.className =
            "response-badge error";


        responseOutput.textContent =
            JSON.stringify(
                {

                    error:
                        "No se pudo conectar con la Web API.",

                    detalle:
                        error.message

                },

                null,

                2
            );

    }

    finally {

        // Reactivamos el botón.
        sendRequest.disabled =
            false;

        sendRequest.textContent =
            "Enviar petición HTTP";

    }

}


// =============================================================
// MOSTRAR ERROR DE VALIDACIÓN
// =============================================================

function showClientError(message) {

    responseBadge.textContent =
        "Solicitud inválida";

    responseBadge.className =
        "response-badge error";


    responseOutput.textContent =
        JSON.stringify(
            {
                error:
                    message
            },

            null,

            2
        );

}


// =============================================================
// EVENTO DEL BOTÓN ENVIAR
// =============================================================

sendRequest.addEventListener(
    "click",
    executeRequest
);


// =============================================================
// COMPROBAR SERVIDOR AL INICIAR
// =============================================================

checkApi();