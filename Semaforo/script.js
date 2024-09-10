//funcion para cambiar el color de los div y damos su style en el mismo script
function cambiarColor(color) {
    document.getElementById("rojo").style.backgroundColor = color === 'rojo' ? 'red' : 'grey';
    document.getElementById("amarillo").style.backgroundColor = color === 'amarillo' ? 'yellow' : 'grey';
    document.getElementById("verde").style.backgroundColor = color === 'verde' ? 'green' : 'grey';
}

//funcion para iniciar nuevamente el semaforo una vez acabado el verde y damos cuanto tiempo quiere que dure en cada color en volver a iniciar
function iniciarSemaforo() {
    setTimeout(() => cambiarColor('rojo'), 0);
    setTimeout(() => cambiarColor('amarillo'), 1000);
    setTimeout(() => cambiarColor('verde'), 2000);
    setTimeout(iniciarSemaforo, 3000);
}