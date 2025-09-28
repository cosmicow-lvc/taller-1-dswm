let dataActual = [];
let elementoVisible = null;
let tipoActual = "personajes"; // por defecto

// Cargar datos desde la API según tipo
async function cargarDatos(tipo) {
  try {
    const response = await fetch('https://harry-potter-api.onrender.com/db');
    const data = await response.json();

    tipoActual = tipo;
    dataActual = data[tipo] || [];
    mostrarLista(dataActual);

    // Ocultar info anterior
    document.getElementById("infoPersonaje").classList.add("hidden");
    elementoVisible = null;

    // Cambiar placeholder del buscador

    //const placeholder = tipo === "personajes" ? "Buscar personaje..." : "Buscar hechizo..." 
    let placeholder;

    if (tipo === "libros") {
        placeholder = "Buscar libro...";
    }
    else if (tipo === "hechizos") {
        placeholder = "Buscar hechizo...";
    } else{
        placeholder = "Buscar personaje...";
    }

    document.getElementById("searchInput").placeholder = placeholder;

    // Actualizar nav activo
    setNavActivo(tipo);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Mostrar lista clickeable
function mostrarLista(lista) {
  const demo = document.getElementById("demo");
  demo.innerHTML = "";

  lista.forEach(item => {
    const pElem = document.createElement("p");
    pElem.className = "border-b py-1 cursor-pointer hover:bg-[#5B0000] text-white";
    //pElem.textContent = tipoActual === "personajes" ? item.personaje : item.hechizo;
    if (tipoActual === "libros") {
        pElem.textContent = item.libro;
    }
    else if (tipoActual === "hechizos") {
        pElem.textContent = item.hechizo;
    } else{
        pElem.textContent = item.personaje;
    }
    pElem.addEventListener("click", () => mostrarInfoInline(item, pElem));
    demo.appendChild(pElem);
  });
}


// Mostrar info del elemento seleccionado (toggle)
function mostrarInfoInline(item, pElem) {
  // Si ya hay un div de info debajo, lo eliminamos
  const siguiente = pElem.nextElementSibling;
  if (siguiente && siguiente.classList.contains("info-inline")) {
    siguiente.remove();
    return;
  }

  // Crear el div con la info
  const infoDiv = document.createElement("div");
  infoDiv.className = "info-inline p-2 border rounded my-1 bg-white bg-opacity-90";

  let contenido = "";

 if (tipoActual === "personajes") {
    contenido = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-4 p-4 border rounded shadow">
      <div class="flex-1 md:w-1/2">    
        <h2 class="text-xl font-bold mb-2">${item.personaje}</h2>
        <p><strong>Casa:</strong> ${item.casaDeHogwarts || "Desconocida"}</p>
        <p><strong>Alias:</strong> ${item.apodo || "Desconocido"}</p>
        <p><strong>Actor:</strong> ${item.interpretado_por || "Desconocido"}</p>
        <p><strong>Hijos:</strong></p>
        <div class="ml-4">${item.hijos && item.hijos.length > 0 ? item.hijos.map(h => h).join("<br>") : "Sin hijos"}</div>
    </div>
      <div class="flex justify-center flex-1 md:w-1/2 mt-4 md:mt-0">
        <img src="${item.imagen}" alt="${item.personaje}" class="rounded">
      </div>
    </div>
    `;
  } else if (tipoActual === "hechizos") {
    contenido = `
    <div class="p-4 border rounded shadow">
      <h2 class="text-xl font-bold mb-2">${item.hechizo}</h2>
      <p><strong>Efecto:</strong> ${item.uso || "Desconocido"}</p>
    </div>
     
    `;
  } else if( tipoActual === "libros") {
    contenido = `
    <div class="p-4 border rounded shadow text-black">
        <h2 class="text-xl font-bold mb-2 ">${item.id} ${ item.libro} </h2>
      <p><strong>Título en inglés:</strong> ${item.titulo_original || "Desconocido"}</p>
      <p><strong>Fecha de lanzamiento:</strong> ${item.fecha_de_lanzamiento || "Desconocido"}</p>
      <p><strong>Autor(a):</strong> ${item.autora || "Desconocido"}</p>
      <p><strong>Reseña:</strong> ${item.descripcion || "Desconocido"}</p>
    </div>
    `;
  }

  infoDiv.innerHTML = contenido;

  // Insertar el div **después del <p> clickeado**
  pElem.insertAdjacentElement("afterend", infoDiv);
}

// Filtrado en tiempo real
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtrados = dataActual.filter(item => {
    //const nombre = tipoActual === "personajes" ? item.personaje : item.hechizo;
    let nombre;
    if(tipoActual === "libros") {
        nombre = item.titulo;
    } else if (tipoActual === "hechizos") {
        nombre = item.hechizo;
    } else{
        nombre = item.personaje;
    }
    return nombre.toLowerCase().includes(query);
  });
  mostrarLista(filtrados);
});

// Manejo de nav activo
function setNavActivo(tipo) {
  const navPersonajes = document.getElementById("nav-personajes");
  const navHechizos = document.getElementById("nav-hechizos");
  const navLibros = document.getElementById("nav-libros");
  if (tipo === "personajes") {
    navPersonajes.classList.add("bg-[#5B0000]", "text-white");
    navHechizos.classList.remove("bg-[#5B0000]", "text-white");
    navLibros.classList.remove("bg-[#5B0000]", "text-white");
  } else if (tipo === "hechizos") {
    navHechizos.classList.add("bg-[#5B0000]", "text-white");
    navPersonajes.classList.remove("bg-[#5B0000]", "text-white");
    navLibros.classList.remove("bg-[#5B0000]", "text-white");
  } else{
    navHechizos.classList.remove("bg-[#5B0000]", "text-white");
    navPersonajes.classList.remove("bg-[#5B0000]", "text-white");
    navLibros.classList.add("bg-[#5B0000]", "text-white");
  }

}

// Eventos de nav
document.getElementById("nav-personajes").addEventListener("click", (e) => {
  e.preventDefault();
  cargarDatos("personajes");
});

document.getElementById("nav-hechizos").addEventListener("click", (e) => {
  e.preventDefault();
  cargarDatos("hechizos");
});
document.getElementById("nav-libros").addEventListener("click", (e) => {
  e.preventDefault();
  cargarDatos("libros");
});
// Toggle menú responsive
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) { 
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
});
}
const navToggle2 = document.getElementById('nav-toggle2');
const navMenu2 = document.getElementById('nav-menu2');
if (navToggle2 && navMenu2) { 
    navToggle2.addEventListener('click', () => {
        navMenu2.classList.toggle('hidden');
});
}
// Carga inicial de personajes
cargarDatos("personajes");


