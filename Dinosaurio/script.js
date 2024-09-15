//Aca ejecutaremos todo el bucle del juego

var time = new Date();// Guarda la fecha y hora actual
var deltaTime = 0;// Diferencia de tiempo entre cada frame

// Verifica si el documento está cargado completamente
if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);// Inicia el juego inmediatamente
}else{
    document.addEventListener("DOMContentLoaded", Init); // Espera a que el DOM esté listo
}

// Función de inicialización
function Init() {
    time = new Date();// Inicializa el tiempo
    Start();// Llama a la función para configurar el juego
    Loop(); // Inicia el bucle del juego
}

// Bucle principal del juego
function Loop() {
    deltaTime = (new Date() - time) / 1000;// Calcula el tiempo transcurrido en segundos
    time = new Date(); // Actualiza el tiempo
    Update();// Llama a la función para actualizar los elementos del juego
    requestAnimationFrame(Loop);// Llama a Loop de nuevo en el siguiente frame
}

//Parte logica del juego

// Variables relacionadas con el escenario y el dinosaurio
var sueloY = 22;
var sueloA = -10;
var velY = 0;
var impulso = 760;
var gravedad = 2500;

// Posición del dinosaurio
var dinoPosX = 42;
var dinoPosY = sueloY; 

// Variables relacionadas con el escenario
var sueloX = 0;
var velEscenario = 1280/4;
var gameVel = 1;
var score = 0;

// Estados del juego
var parado = false;
var saltando = false;
var agachao = false;

// Variables para la creación de obstáculos
var tiempoHastaObstaculo = 3;
var tiempoObstaculoMin = 1.8;
var tiempoObstaculoMax = 1;
var obstaculoPosY = 16;
var obstaculos = [];

// Variables para la creación de nubes
var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var pajaros = [];
var velNube = 0.5;


var maxPajaroY = 270;
var minPajaroY = 16;
var tiempoHastaPajaro = 8; // Tiempo inicial antes de que aparezca el primer pájaro
var tiempoPajaroMin = 5; // Tiempo mínimo entre la aparición de dos pájaros
var tiempoPajaroMax = 8; // Tiempo máximo entre la aparición de dos pájaros

// Elementos del DOM que serán manipulados
var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

// Inicializa las variables del juego y selecciona los elementos del DOM
//el document es el html (la app)
function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);// Detecta cuando se presiona una tecla
}

// Actualiza el estado del juego en cada frame

function Update() {
    if(parado) return; // Si el juego está detenido, no hace nada

    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    DecidirCrearPajaros();
    MoverObstaculos();
    MoverNubes();
    MoverPajaros();
    DetectarColision(); // Detecta colisiones con obstáculos
    DetectarColisionPajaros(); // Detecta colisiones con pájaros

    velY -= gravedad * deltaTime; // Aplica la gravedad al dinosaurio
}

// Maneja el evento de presionar la tecla de espacio para saltar
function HandleKeyDown(ev){
    console.log(ev.keyCode)
    if(ev.keyCode == 32 || ev.keyCode == 38){ // Si se presiona la barra espaciadora o flecha arriba
        Saltar();// Llama a la función de salto
    }
    if(ev.keyCode == 40 ){ // Si se presiona flecha abajo
        console.log('Se agacho');// Llama a la función de agacharse
        Agacharse();
    }
    
}

// Hace que el dinosaurio salte
function Saltar(){
    if(dinoPosY === sueloY){// Solo puede saltar si está en el suelo
        saltando = true;// Cambia el estado a "saltando"
        velY = impulso;// Aplica la velocidad del salto
        dino.classList.remove("dino-corriendo");// Quita la animación de correr
    }
}

function Agacharse(){
    if(dinoPosY === sueloY){// Solo puede saltar si está en el suelo
        agachao = true;// Cambia el estado a "saltando"
        dino.classList.add("dino-agachandose");
        setTimeout(() => {
            console.log("medio Segundo esperado")
            dino.classList.remove("dino-agachandose");
            }, 500);
    }
}

// Mueve al dinosaurio según su velocidad vertical
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;// Actualiza la posición Y del dinosaurio
    if(dinoPosY < sueloY){
        
        TocarSuelo();// Si el dinosaurio cae por debajo del suelo, ajusta su posición
    }
    dino.style.bottom = dinoPosY+"px";// Actualiza la posición en pantalla
}

// Restablece el dinosaurio al tocar el suelo
function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false; // Deja de estar en el estado de "saltando"
}

// Mueve el suelo para dar la ilusión de desplazamiento
function MoverSuelo() {
    sueloX += CalcularDesplazamiento();// Calcula cuánto se debe mover el suelo
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";// Actualiza la posición del suelo
}

// Calcula cuánto debe desplazarse cada elemento en función de la velocidad del escenario
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;// Devuelve el desplazamiento calculado
}

// Detiene el juego cuando el dinosaurio choca con un obstáculo
function Estrellarse() {
    dino.classList.remove("dino-corriendo");// Quita la animación de correr
    dino.classList.add("dino-estrellado");// Añade la animación de estrellarse
    parado = true;// Detiene el juego
}

// Decide si se debe crear un obstáculo en función del tiempo transcurrido
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;// Disminuye el tiempo hasta el próximo obstáculo
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();// Crea un obstáculo
    }
}

// Decide si se debe crear una nube en función del tiempo transcurrido
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

// Decide si se debe crear pajaros en función del tiempo transcurrido
function DecidirCrearPajaros() {
    tiempoHastaPajaro -= deltaTime;
    if (tiempoHastaPajaro <= 0) {
        CrearPajaro();
    }
}

// Crea un nuevo obstáculo y lo añade al escenario
function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}
// Crea una nueva nube y la añade al escenario
function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";// Establece una posición aleatoria en el eje Y
    
    nubes.push(nube);// La añade al arreglo de nubes
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel; // Calcula el tiempo para la próxima nube
}

function CrearPajaro() {
    var pajaro = document.createElement("div");
    contenedor.appendChild(pajaro);
    pajaro.classList.add("pajaro");
    pajaro.posX = contenedor.clientWidth;
    pajaro.style.left = contenedor.clientWidth + "px";
    pajaro.style.bottom = minPajaroY + Math.random() * (maxPajaroY - minPajaroY) + "px"; // Establece una posición aleatoria en el eje Y

    pajaros.push(pajaro); // Añade el pájaro al arreglo de pájaros
    tiempoHastaPajaro = tiempoPajaroMin + Math.random() * (tiempoPajaroMax - tiempoPajaroMin) / gameVel; // Calcula el tiempo para el próximo pájaro
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function MoverPajaros() {
    for (var i = pajaros.length - 1; i >= 0; i--) {
        if(pajaros[i].posX < -pajaros[i].clientWidth) {
            pajaros[i].parentNode.removeChild(pajaros[i]);
            pajaros.splice(i, 1);
        }else{
            pajaros[i].posX -= CalcularDesplazamiento() * velNube;
            pajaros[i].style.left = pajaros[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    }else if(score == 10) {
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if(score == 20) {
        gameVel = 3;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

// Detiene el juego y muestra la pantalla de Game Over
function GameOver() {
    Estrellarse();// Llama a la función para detener el juego
    gameOver.style.display = "block";// Muestra la pantalla de Game Over
}

// Detecta colisiones entre el dinosaurio y los obstáculos
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            // El obstáculo está demasiado lejos, no puede colisionar
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();// Si hay una colisión, termina el juego
            }
        }
    }
}


function DetectarColisionPajaros() {
    for (var i = 0; i < pajaros.length; i++) {
        if(pajaros[i].posX > dinoPosX + dino.clientWidth) {
            // El pájaro está demasiado lejos, no puede colisionar
            break; //al estar en orden, no puede chocar con más
        }else{
            // Cambia `obstaculos[i]` por `pajaros[i]`
            if(IsCollision(dino, pajaros[i], 10, 30, 15, 20)) {
                GameOver();// Si hay una colisión con un pájaro, termina el juego
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();// Obtiene el área del dinosaurio
    var bRect = b.getBoundingClientRect();// Obtiene el área del obstáculo

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) || // Verifica si no colisiona por la parte inferior
        (aRect.top + paddingTop > (bRect.top + bRect.height)) || // Verifica si no colisiona por la parte superior
        ((aRect.left + aRect.width - paddingRight) < bRect.left) || // Verifica si no colisiona por la parte derecha
        (aRect.left + paddingLeft > (bRect.left + bRect.width)) // Verifica si no colisiona por la parte izquierda
    );
}