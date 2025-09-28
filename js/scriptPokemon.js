const contenedor = document.getElementById("poke-container");
const estado = document.getElementById("status");
const detalleView = document.getElementById("detalle");
const detalleContent = document.getElementById("detalle-content");
const btnVolver = document.getElementById("btn-volver");
const btnCargarMas = document.getElementById("btn-cargar-mas");
const buscador = document.getElementById("buscador");

let pokemones = [];
let offset = 0;
const limite = 12;

async function cargarPokemones() {
  try {
    estado.style.display = "block";
    estado.textContent = "Cargando Pokémon...";

    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`);
    if (!respuesta.ok) throw new Error("Error al obtener Pokémon");
    const data = await respuesta.json();

    const fetchDetalles = data.results.map(p =>
      fetch(p.url)
        .then(r => r.json())
        .catch(() => ({ name: p.name, sprites: { front_default: "" }, types: [], abilities: [] }))
    );
    const nuevosPokemones = await Promise.all(fetchDetalles);

    pokemones = [...pokemones, ...nuevosPokemones];
    offset += limite;

    estado.style.display = "none";
    renderizarPokemones();
  } catch (error) {
    estado.textContent = "No se pudieron cargar los Pokémon 😢";
    console.error(error);
  }
}

function renderizarPokemones() {
  const filtro = buscador.value.toLowerCase();
  const listaFiltrada = pokemones.filter(p => p.name.includes(filtro));

  contenedor.innerHTML = listaFiltrada.map((p, index) => {
    const tipoPrincipal = p.types[0]?.type.name || "normal";
    return `
      <div onclick="verDetalle(${pokemones.indexOf(p)})" class="card tipo-${tipoPrincipal}">
        <div class="badge-icon">
          <img src="${p.sprites.front_default || 'https://via.placeholder.com/96'}" alt="${p.name}">
        </div>
        <div class="badge badge-name">${p.name}</div>
        <div class="flex flex-wrap justify-center">
          ${p.types.map(t => `<span class="badge badge-${t.type.name}">${t.type.name}</span>`).join('')}
        </div>
      </div>
    `;
  }).join("");
}

async function verDetalle(index) {
  const p = pokemones[index];

  document.getElementById("lista").classList.add("hidden");
  detalleView.classList.remove("hidden");

  let speciesData = {};
  let evolutionData = {};
  try {
    const respSpecies = await fetch(p.species.url);
    speciesData = await respSpecies.json();

    const respEvolution = await fetch(speciesData.evolution_chain.url);
    evolutionData = await respEvolution.json();
  } catch (err) {
    console.error("Error al obtener datos de especie/evolución", err);
  }

  const statsHTML = p.stats.map(s => `<p>${s.stat.name.toUpperCase()}: ${s.base_stat}</p>`).join("");
  const movesHTML = p.moves.slice(0,5).map(m => `<span class="badge">${m.move.name}</span>`).join(" ");

  let evolutions = [];
  try {
    let chain = evolutionData.chain;
    while(chain) {
      evolutions.push(chain.species.name);
      chain = chain.evolves_to[0];
    }
  } catch {}

  detalleContent.innerHTML = `
    <div class="flex flex-col gap-4">

      <div class="detalle-card flex flex-col items-center">
        <div class="flex gap-4">
          <img src="${p.sprites.front_default || ''}" alt="${p.name}" class="w-24 h-24">
          <img src="${p.sprites.back_default || ''}" alt="${p.name} back" class="w-24 h-24">
          <img src="${p.sprites.front_shiny || ''}" alt="${p.name} shiny" class="w-24 h-24">
        </div>
        <h2 class="text-2xl font-bold capitalize">${p.name}</h2>
        <div class="flex gap-2 flex-wrap justify-center">
          ${p.types.map(t => `<span class="badge badge-${t.type.name}">${t.type.name}</span>`).join('')}
        </div>
        <p>Altura: ${p.height/10} m | Peso: ${p.weight/10} kg</p>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Stats Base</h3>
        <div class="flex flex-wrap gap-2">${statsHTML}</div>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Habilidades</h3>
        <div class="flex flex-wrap gap-2">${p.abilities.map(a => `<span class="badge">${a.ability.name}</span>`).join('')}</div>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Movimientos</h3>
        <div class="flex flex-wrap gap-2">${movesHTML}</div>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Crecimiento y Experiencia</h3>
        <p>Base XP: ${p.base_experience}</p>
        <p>Growth rate: ${speciesData.growth_rate?.name || '-'}</p>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Hábitat y Generación</h3>
        <p>Hábitat: ${speciesData.habitat?.name || '-'}</p>
        <p>Generación: ${speciesData.generation?.name || '-'}</p>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Evoluciones</h3>
        <p>${evolutions.join(' → ')}</p>
      </div>

      <div class="detalle-card">
        <h3 class="font-semibold mb-2">Descripción</h3>
        <p class="italic text-sm">${speciesData.flavor_text_entries?.find(f => f.language.name==='en')?.flavor_text || ''}</p>
      </div>

    </div>
  `;
}

btnVolver.addEventListener("click", () => {
  detalleView.classList.add("hidden");
  document.getElementById("lista").classList.remove("hidden");
});
btnCargarMas.addEventListener("click", cargarPokemones);
buscador.addEventListener("input", renderizarPokemones);

cargarPokemones();
