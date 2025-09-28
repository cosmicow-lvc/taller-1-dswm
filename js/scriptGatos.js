const frasesMotivacionales = [
    "Cree en ti y en lo que puedes lograr",
    "Cada paso pequeño cuenta",
    "La disciplina supera al talento",
    "Nunca es tarde para empezar",
    "Tu esfuerzo marcará la diferencia",
    "El progreso se construye día a día",
    "La constancia abre todas las puertas",
    "Haz de tus metas tu motivación diaria",
    "La acción vence a la duda",
    "Eres más fuerte de lo que piensas",
    "El fracaso es parte del camino al éxito",
    "El esfuerzo de hoy es el triunfo de mañana",
    "No esperes a tener todo, empieza con lo que tienes",
    "El cambio comienza con una decisión",
    "Cada día es una nueva oportunidad"
];

async function cambiarFoto() {
    const frase = obtenerFraseAleatoria()
    console.log(frase)
    const url = 'https://cataas.com/cat/cute/says/'+frase;
    const imgElement = document.getElementById('mainImage');
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        imgElement.src = objectURL;
    } catch (error) {
        console.error('Error consiguiendo la imagen:', error);
    }
}

function obtenerFraseAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * frasesMotivacionales.length);
    return frasesMotivacionales[indiceAleatorio];
}

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
  });
}