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
var impulso = 900;
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
var pajaroActivo = false;

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
var velNube = 0.5;

var pajaros = [];
var maxPajaroY = 100;
var minPajaroY = 25;
var tiempoHastaPajaro = 3; // Tiempo inicial antes de que aparezca el primer pájaro
var tiempoPajaroMin = 0.9; // Tiempo mínimo entre la aparición de dos pájaros
var tiempoPajaroMax = 2.1; // Tiempo máximo entre la aparición de dos pájaros
var velPajaro = 0.7;

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
    document.addEventListener("keyup", HandleKeyUp);
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
    if(ev.keyCode === 32 || ev.keyCode === 38){ // Si se presiona la barra espaciadora o flecha arriba
        Saltar();// Llama a la función de salto
    }
    if(ev.keyCode === 40 ){ // Si se presiona flecha abajo
        console.log('Se agacho');// Llama a la función de agacharse
        Agacharse();
    }
    
}

function HandleKeyUp(ev){
    if(ev.keyCode === 40){ // Si se presiona la barra espaciadora o flecha arriba
        levantarse();
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
    if(!saltando && dinoPosY === sueloY){// Solo puede saltar si está en el suelo
        dino.classList.remove("dino-corriendo");
        dino.classList.add("dino-agachandose");
    }
}

function levantarse(){
    dino.classList.add("dino-corriendo");
    dino.classList.remove("dino-agachandose");
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
    dino.classList.remove("dino-agachandose");
    dino.classList.add("dino-estrellado");// Añade la animación de estrellarse
    dino.classList.remove("dino-corriendo");// Quita la animación de correr
    

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
    if(!pajaroActivo)return;
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

function MoverObstaculos() {//mueve los obstaculos y elimina los que se han salido de la pantalla
    for (var i = obstaculos.length - 1; i >= 0; i--) {//recorre los obstaculos en orden inverso
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {//comprueba si el obstaculo ha salido de la pantalla
            obstaculos[i].parentNode.removeChild(obstaculos[i]);//elimina el obstaculo del DOM
            obstaculos.splice(i, 1);//elimina el obstaculo del array
            GanarPuntos();//aumenta la puntuacion
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();//actualiza la posicion x del obstaculo
            obstaculos[i].style.left = obstaculos[i].posX+"px";//ajusta la posicion del DOM
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
    if(score == 10){
        gameVel = 2;
    }else if(score == 18) {
        gameVel = 3;
        contenedor.classList.add("tarde");
    } else if(score == 28) {
        gameVel = 4;
        pajaroActivo = true;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

// Detiene el juego y muestra la pantalla de Game Over
function GameOver() {
    Estrellarse();// Llama a la función para detener el juego
    gameOver.style.display = "block";// Muestra la pantalla de Game Over
    document.removeEventListener("keydown", HandleKeyDown);
    document.removeEventListener("keyup", HandleKeyUp);
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