var contador = 1;
var temporizador;

function iniciar(){
    if (!temporizador) {
    temporizador = setInterval(rotarImagenes, 3000);
    }
}


function parar(){
    clearInterval(temporizador);
    temporizador = null;
}

function rotarImagenes(){
    if (contador >= 10){
        contador = 0;
    }
    var img = document.getElementById("imgSlide");
    img.src = '/images/img' + ++contador + '.jpg'
}
