// =============================================================
// REFERENCIAS PRINCIPALES
// =============================================================

// Elemento HTML principal.
const root =
    document.documentElement;


// Botón de cambio de tema.
const themeToggle =
    document.getElementById(
        "themeToggle"
    );


// Icono del tema.
const themeIcon =
    document.getElementById(
        "themeIcon"
    );


// Botón del menú responsive.
const menuToggle =
    document.getElementById(
        "menuToggle"
    );


// Menú para celular.
const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


// Botón volver arriba.
const backToTop =
    document.getElementById(
        "backToTop"
    );


// =============================================================
// MODO CLARO / OSCURO
// =============================================================

// Consultamos si existe un tema guardado.
const savedTheme =
    localStorage.getItem(
        "restApiTheme"
    );


// Si el usuario guardó tema claro,
// lo aplicamos al cargar.
if (savedTheme === "light") {

    root.setAttribute(
        "data-theme",
        "light"
    );

    themeIcon.textContent =
        "☀";

}


// =============================================================
// CAMBIAR TEMA
// =============================================================

themeToggle.addEventListener(
    "click",
    () => {

        const currentTheme =
            root.getAttribute(
                "data-theme"
            );


        // Si estamos en modo claro,
        // cambiamos a oscuro.
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

        // Caso contrario cambiamos
        // a modo claro.
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

        mobileMenu
            .classList
            .toggle(
                "open"
            );

    }
);


// =============================================================
// CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
// =============================================================

mobileMenu
    .querySelectorAll("a")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu
                        .classList
                        .remove(
                            "open"
                        );

                }
            );

        }
    );


// =============================================================
// CERRAR MENÚ AL HACER CLIC FUERA
// =============================================================

document.addEventListener(
    "click",
    event => {

        const clickedInsideMenu =
            mobileMenu.contains(
                event.target
            );


        const clickedButton =
            menuToggle.contains(
                event.target
            );


        if (
            !clickedInsideMenu
            &&
            !clickedButton
        ) {

            mobileMenu
                .classList
                .remove(
                    "open"
                );

        }

    }
);


// =============================================================
// BOTÓN VOLVER ARRIBA
// =============================================================

window.addEventListener(
    "scroll",
    () => {

        // Mostramos el botón después
        // de 500 píxeles.
        if (window.scrollY > 500) {

            backToTop
                .classList
                .add(
                    "visible"
                );

        }

        else {

            backToTop
                .classList
                .remove(
                    "visible"
                );

        }

    }
);


// Al pulsar regresamos al inicio.
backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior:
                "smooth"

        });

    }
);


// =============================================================
// ANIMACIONES AL HACER SCROLL
// =============================================================

// IntersectionObserver detecta cuando
// los elementos aparecen en pantalla.
const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        // Mostramos el elemento.
                        entry
                            .target
                            .classList
                            .add(
                                "visible"
                            );


                        // Dejamos de observarlo
                        // para no repetir la animación.
                        observer
                            .unobserve(
                                entry.target
                            );

                    }

                }
            );

        },

        {

            threshold:
                0.10

        }

    );


// Aplicamos la animación
// a todos los elementos reveal.
document
    .querySelectorAll(
        ".reveal"
    )
    .forEach(
        element => {

            observer.observe(
                element
            );

        }
    );


// =============================================================
// ATAJO OPCIONAL PARA CAMBIAR EL TEMA
// =============================================================
//
// Durante la exposición puedes presionar:
//
// T
//
// para cambiar rápidamente
// entre modo claro y oscuro.

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key.toLowerCase()
            ===
            "t"
        ) {

            themeToggle.click();

        }

    }
);