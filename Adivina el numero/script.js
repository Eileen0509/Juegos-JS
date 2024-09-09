let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

function adivinar() {
    let intento = document.getElementById("numero").value;
    intentos++;

   

    if (intento == numeroSecreto ) {
        document.getElementById("resultado").innerText = "!Correcto! Adivinaste en " + intentos + " intentos. ";
    }else{
        let pista = "";
    }

        if (numeroSecreto % 2 === 0) {
            pista += "El número secreto es par. ";
        } else {
            pista += "El número secreto es impar. ";
        }
    
        /*
        if(intento < numeroSecreto){
            document.getElementById("resultado").innerText = "El numero es mayor. Intentalo de nuevo.";
        }else {
            document.getElementById("resultado").innerText = "El numero es menor. Intentalo de nuevo.";
        }*/
}
