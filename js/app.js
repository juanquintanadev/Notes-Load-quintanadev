// VARIABLES
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets')
// tambien creamos una variable que vamos a ir cargando los tweets
let tweets = [];


// EVENTLISTENERS
eventListeners();
function eventListeners() {
    formulario.reset();

    // cunado el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    // cuando la pagina se recarga y el documento listo vamos a leer del local storage que se almaceno antes y lo vamos a cargar en la pag
    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || []; // si el local esta vacio, entonces no inserta nada y da error porque cuando llamamos a insertar el html nos da null y ni forEach ni .length son validos para un elemento null
        insertarHtml();
    });
}


// FUNCIONES
function agregarTweet(e) { // como es un formulario se pasa el evento automaticamente
    e.preventDefault(); // SIEMPRE SIEMPRE VA EL PREVENT DEFAULT
    const tweet = document.querySelector('#tweet').value; // el .VALUE al final suuuupero importanteeeee IMPORTANTEEEEEEE

    // validacion del tweet
    if(tweet === '') {
        mostrarError('Un mensaje no puede ir vacio');
        return; // este return funciona en un if siempre y cuando este en una funcion
    }
    
    // le damos al tweet un id y el texto en un objeto
    const tweetObj = {
        id: Date.now(),
        tweet, // cuando la key y el value tienen los mismos nombres solamente va la key y automaticamente se le asigna el valor
    };

    // añadimos al arreglo de tweets
    tweets = [...tweets, tweetObj];

    console.log(tweets);
    // agregamos al html
    insertarHtml();

    // reiniciar el formulario
    formulario.reset();
};

function insertarHtml() {

    // limpiamos el html
    limpiarHtml();

    if(tweets.length > 0) { // COMPROBAMOS QUE HAYA AL MENOS UN TWEET PORQUE VAMOS A REUTILIZAR EL CODIGO
        // recorremos el arreglo de tweets cargados
        tweets.forEach(tweet => {
            // agregamos un boton eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.textContent = 'X';
            
            // agregamos la funcion de eliminar al boton
            btnEliminar.onclick = () => { // quedaria arrow porque cuando hay que pasarle parametros a la funcion que vamos a llamar si o si es con arrow
                borrarTweet(tweet.id);
            };

            // creamos la etiqueta de lista
            const li = document.createElement('li');

            // cargamos el texto que contiene el tweet en la etiqueta de lista
            li.textContent = tweet.tweet;

            // asignamos el boton al elemento de la lista
            li.appendChild(btnEliminar);

            // agregamos el elemento de la lista al html
            listaTweets.appendChild(li);
        });
    };

    // una vez creados e insertados los tweets en el html llamamos a una funcion para el storage
    sicronizarStorage();
};

// agregamos en forma de string al local storage con la key tweets
function sicronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));

}

function mostrarError(error) {
    const mensaje = document.createElement('p');
    mensaje.textContent = error;
    mensaje.classList.add('error');

    // insertamos el mensaje al final del todo
    formulario.appendChild(mensaje);

    // eliminamos la alerta luego de 3 segundos
    setTimeout(() => {
        mensaje.remove();
    }, 3000);
};

function borrarTweet(id) {
    // aca traemos todos los resultados menos el del id, osea actualizamos el arreglo de tweets
    tweets = tweets.filter(tweet => tweet.id !== id);

    // una vez obtenido el nuevo arreglo lo insertamos en el HTML actualizado, y ahi mismo se sincroniza en el local storage
    insertarHtml();

// limpiamos el hmtl
function limpiarHtml() {
    while(listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    };
};


