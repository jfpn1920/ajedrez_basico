//----------------------------------//
//--|funcionalidad_ajedrez_basico|--//
//----------------------------------//
const tablero_ajedrez = document.getElementById("tablero_ajedrez");
const turno_actual = document.getElementById("turno_actual");
const reiniciar_partida = document.getElementById("reiniciar_partida");
//------------------------------------------//
//--|estado_del_juego_usando_localstorage|--//
//------------------------------------------//
let tablero = JSON.parse(localStorage.getItem("tablero_ajedrez"));
let turno = localStorage.getItem("turno_ajedrez") || "blancas";
let seleccion = null;
//----------------------//
//--|posicion_inicial|--//
//----------------------//
const posicion_inicial = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"]
];
//-------------------//
//--|crear_tablero|--//
//-------------------//
function crear_tablero() {
    tablero_ajedrez.innerHTML = "";
    for (let fila = 0; fila < 8; fila++) {
        for (let columna = 0; columna < 8; columna++) {
            const casilla = document.createElement("button");
            casilla.type = "button";
            casilla.classList.add("casilla");
            if ((fila + columna) % 2 === 0) {
                casilla.classList.add("casilla_clara");
            } else {
                casilla.classList.add("casilla_oscura");
            }
            casilla.dataset.fila = fila;
            casilla.dataset.columna = columna;
            casilla.textContent = tablero[fila][columna];
            colocar_color_pieza(casilla);
            casilla.addEventListener("click", seleccionar_casilla);
            tablero_ajedrez.appendChild(casilla);
        }
    }
    actualizar_turno();
}
//--------------------//
//--|colorear_pieza|--//
//--------------------//
function colocar_color_pieza(casilla) {
    const pieza = casilla.textContent;
    const piezas_blancas = "♔♕♖♗♘♙";
    if (piezas_blancas.includes(pieza)) {
        casilla.classList.add("pieza_blanca");
    }
    if (pieza && !piezas_blancas.includes(pieza)) {
        casilla.classList.add("pieza_negra");
    }
}
//-------------------------//
//--|seleccionar_casilla|--//
//-------------------------//
function seleccionar_casilla(evento) {
    const casilla = evento.currentTarget;
    const fila = Number(casilla.dataset.fila);
    const columna = Number(casilla.dataset.columna);
    const pieza = tablero[fila][columna];
    if (seleccion === null) {
        if (!pieza) {
            return;
        }
        seleccion = {
            fila: fila, columna: columna
        };
        casilla.classList.add("seleccionada");
        return;
    }
    mover_pieza(fila, columna);
}
//-----------------//
//--|mover_pieza|--//
//-----------------//
function mover_pieza(fila_destino, columna_destino) {
    const fila_origen = seleccion.fila;
    const columna_origen = seleccion.columna;
    const pieza = 
        tablero[fila_origen] [columna_origen];
        tablero[fila_destino] [columna_destino] = pieza;
        tablero[fila_origen] [columna_origen] = "";
        seleccion = null;
        cambiar_turno();
        guardar_partida();
        crear_tablero();
}
//------------------------------------------//
//--|cambiar_turno_usando_el_localstorage|--//
//------------------------------------------//
function cambiar_turno() {
    if (turno === "blancas") {
        turno = "negras";
    } else {
        turno = "blancas";
    }
    localStorage.setItem("turno_ajedrez", turno);
}
//----------------------//
//--|actualizar_turno|--//
//----------------------//
function actualizar_turno() {
    if (turno === "blancas") {
        turno_actual.textContent = "Blancas";
    } else {
        turno_actual.textContent = "Negras";
    }
}
//--------------------------------------------------//
//--|guardar_y_reiniciar_partida_con_localstorage|--//
//--------------------------------------------------//
function guardar_partida() {
    localStorage.setItem("tablero_ajedrez", JSON.stringify(tablero));
}
reiniciar_partida.addEventListener(
    "click",
    function() {
        const confirmar = confirm("¿Deseas reiniciar la partida?");
        if (!confirmar) {
            return;
        }
        tablero = posicion_inicial.map(
                function(fila) {
                    return [...fila];
                });
        turno = "blancas";
        seleccion = null;
        localStorage.removeItem("tablero_ajedrez");
        localStorage.removeItem("turno_ajedrez");
        guardar_partida();
        crear_tablero();
    }
);
//--------------------//
//--|cargar_partida|--//
//--------------------//
if (!tablero) {
    tablero = posicion_inicial.map(
            function(fila) {
                return [...fila];
            });
    guardar_partida();
}
crear_tablero();