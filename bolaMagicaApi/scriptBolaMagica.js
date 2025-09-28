const preguntaInput = document.getElementById('pregunta-magica')
const botonPregunta = document.getElementById('ask-button')
const cartelNegativo = document.getElementById('cartel-negativo').querySelector('p')
const cartelPositivo = document.getElementById('cartel-positivo').querySelector('p')
const cartelNeutral = document.getElementById('cartel-neutral').querySelector('p')

let respuestasPositivas=[]
let respuestasNegativas = []
let respuestasNeutras = []

async function fetchRespuestasPorCategoria(){
    try{
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://www.eightballapi.com/api/categories?locale=es')
        const response = await fetch(url)
        const data = await response.json()

        respuestasNegativas = data.negative
        respuestasPositivas = data.positive
        respuestasNeutras = data.neutral

    }catch(error){
        console.error("No se pudieron cargar las categorías de respuestas.", error)
        cartelNeutral.textContent = "No se pudo conectar con la Bola 8."
    }

}

function resetearContenidoCarteles() {
    cartelNegativo.textContent = ''
    cartelPositivo.textContent = ''
    cartelNeutral.textContent = ''
}

async function obtenerRespuestaDeLaBola() {
    const pregunta = preguntaInput.value;
    if (!pregunta) {
        alert("Por favor, escribe una pregunta.")
        return;
    }
    resetearContenidoCarteles();
    cartelNeutral.textContent = "Pensando..."
            
    try {
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://www.eightballapi.com/api?locale=es')
        const response = await fetch(url);
        const data = await response.json();
        const respuestaDeLaBola = data.reading;

        resetearContenidoCarteles();

        if (respuestasPositivas.includes(respuestaDeLaBola)) {
            cartelPositivo.textContent = respuestaDeLaBola

        }else if(respuestasNegativas.includes(respuestaDeLaBola)) {
            cartelNegativo.textContent = respuestaDeLaBola
        }else{
            cartelNeutral.textContent = respuestaDeLaBola
        }

        } catch (error) {
            resetearContenidoCarteles();
            cartelNeutral.textContent = `Error: ${error.message}`
    }
}

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
  });
}

document.addEventListener("DOMContentLoaded", fetchRespuestasPorCategoria)
botonPregunta.addEventListener("click", obtenerRespuestaDeLaBola)

