
//Funcion para hacer la operaciones pero primero empezamos obteniendo los valores de los nuemros puestos en el html y su tipo de operacion con el getElement...
function calcular() {
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    let operacion = document.getElementById("operacion").value;
    let resultado;

    //el switch deduce que tipo de operacion es la escogido y ejecuta mas rapido la operacion
    switch (operacion) {
        case "+":
            resultado = num1 + num2;
            break;
        case "-":
            resultado = num1 - num2;
            break;
        case "*":
            resultado = num1 * num2;
            break;
        case "/":
            resultado = num1 / num2;
            break;
        default:
            resultado = "Operacion no valida";
    }
    //imprimos resultado 
    document.getElementById("resultado").innerText = "Resultado " + resultado;
}