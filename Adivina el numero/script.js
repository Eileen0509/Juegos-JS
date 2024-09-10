
//declaramos una variable numeroSecreto que es donde va a guardar el numero escogido aleatoriamente por el metodo Math.random y lo multiplicamos por 10 porque nuestro rango es eleigr un numero de 1 a 100 
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
//tenemos un contador inicializado en 0 que contara el numnero de intentos hechos
let intentos = 0;

//funcion la cual nos va a decir si acertamos el numero
function adivinar() {
    //obtenemos el numero de la variable intento puesta en el html. por ello usamos el document.getElemt... y usamos value para indicar que de esa variable solo queremos el valor puesto
    let intento = document.getElementById("numero").value;
    //contador de intentos
    intentos++;

    //condicion que muestre si acerto y si no que diga que siga intentando  y el ponemos inner.text para establecer que el texto sea visible en el html
    if (intento == numeroSecreto ) {
        document.getElementById("resultado").innerText = "!Correcto! Adivinaste en " + intentos + " intentos. ";
    }else if(intento < numeroSecreto){
            document.getElementById("resultado").innerText = "El numero es mayor. Intentalo de nuevo.";
    }else {
        document.getElementById("resultado").innerText = "El numero es menor. Intentalo de nuevo.";
    }
}
