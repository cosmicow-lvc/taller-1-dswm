const preguntaInput = document.getElementById('pregunta-magica')
const botonPregunta = document.getElementById('ask-button')

// divs
const cartelNegativo = document.getElementById('cartel-negativo')
const cartelPositivo = document.getElementById('cartel-positivo')
const cartelNeutral = document.getElementById('cartel-neutral')

// p
const cartelNegativoP = document.getElementById('cartel-negativo').querySelector('p')
const cartelPositivoP = document.getElementById('cartel-positivo').querySelector('p')
const cartelNeutralP = document.getElementById('cartel-neutral').querySelector('p')

let respuestasPositivas = []
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
        cartelNeutralP.textContent = "No se pudo conectar con la Bola 8."
        cartelNeutral.classList.remove('hidden')
    }
}

function resetearContenidoCarteles(){
    cartelNegativo.classList.add('hidden')
    cartelPositivo.classList.add('hidden')
    cartelNeutral.classList.add('hidden')

    cartelNegativoP.textContent = ''
    cartelPositivoP.textContent = ''
    cartelNeutralP.textContent = ''
}

async function obtenerRespuestaDeLaBola() {
    const pregunta = preguntaInput.value;
    if (!pregunta) {
        alert("Por favor, escribe una pregunta.")
        return;
    }
    resetearContenidoCarteles();
    
    cartelNeutralP.textContent = "Pensando..."
    cartelNeutral.classList.remove('hidden')

    try{
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://www.eightballapi.com/api?locale=es');
        const response = await fetch(url);
        const data = await response.json();
        const respuestaDeLaBola = data.reading;

        resetearContenidoCarteles();

        if (respuestasPositivas.includes(respuestaDeLaBola)) {
            cartelPositivoP.textContent = respuestaDeLaBola
            cartelPositivo.classList.remove('hidden')

        } else if (respuestasNegativas.includes(respuestaDeLaBola)) {
            cartelNegativoP.textContent = respuestaDeLaBola
            cartelNegativo.classList.remove('hidden')

        } else {
            cartelNeutralP.textContent = respuestaDeLaBola
            cartelNeutral.classList.remove('hidden')
        }

    }catch(error){
        resetearContenidoCarteles()
        cartelNeutralP.textContent = `Error: ${error.message}`
        cartelNeutral.classList.remove('hidden')
    }
}

document.addEventListener("DOMContentLoaded", fetchRespuestasPorCategoria)
botonPregunta.addEventListener("click", obtenerRespuestaDeLaBola)