//aqui tenemos nuestra funcion inicializada

function viajarConSuerte(){
    //tendremos una variable X con un metodo math.random el cual nos dara un valor aleatorio entre 0 a 9 ya que le multiplicamos por 10
    var x = Math.random() * 10;
    var URL;

    //ponemos nuestra condicion del nuemro aleatorio a que url debe dirigirse
        if (x <= 3){
            x = 0;
            URL = "https://www.outlook.com";
        }else if (x <= 6){
            x = 1;
            URL = "https://www.gmail.com";
        }else {
            x = 2;
            URL = "https://www.yahoo.com";
        }
        //location.assign ayuda a redireccionar a otra pagina dentro de la misma pagina del navegador 
    location.assign(URL);
}