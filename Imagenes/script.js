//declaranos una variable contador inicializada en uno y una variable temporizador, esto nos ayudara a reproducir las imagenes 
var contador = 1;
var temporizador;

//inicializamos una funcion que sera para iniciar la rotacion de imagenes
function iniciar(){
    if (!temporizador) {
        //set interval lo usamos para ejecutar un fragmento de código repetidamente a intervalos de tiempo específicos en este caso en 3000 
    temporizador = setInterval(rotarImagenes, 3000);
    }
}

//para parar la repeticion de imagenes creamos otrafuncion llamada parar que lleva un clearinterval que tiene funcion parar el setInterval
function parar(){
    clearInterval(temporizador);
    temporizador = null;
}

function rotarImagenes(){
    if (contador >= 10){
        contador = 0;
    }
    //con la variable var le decimos que tome la imagen puesta en el html y apartir de ella reproduzca las demas imagenes guardas en la carpeta img y que lo haga de una en una 
    var img = document.getElementById("imgSlide");
    img.src = '/images/img' + ++contador + '.jpg'
}
