/* Recetario de la abuela - logica de la web (lista, buscador, detalle) */

const REGIONES = {
  es: "Toda España", and: "Andalucía", mad: "Madrid", ast: "Asturias",
  pv: "País Vasco", val: "Comunidad Valenciana", ara: "Aragón",
  bal: "Illes Balears", cnr: "Canarias", can: "Cantabria",
  clm: "Castilla-La Mancha", cyl: "Castilla y León", cat: "Cataluña",
  ext: "Extremadura", gal: "Galicia", mur: "Murcia", rio: "La Rioja",
};
const CATEGORIAS = {
  picar: "Para picar", cuchara: "De cuchara", huerta: "De la huerta",
  carne: "Carnes y guisos", postre: "Postres", mar: "Del mar", arroz: "Arroces",
};
const DIFICULTAD = { 1: "Fácil", 2: "Media", 3: "De las de verdad" };

let RECETAS = [];
let filtroCat = null;
let filtroTexto = "";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function fmtTiempo(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function pintaStats() {
  const regiones = new Set(RECETAS.map((r) => r.region));
  const pasos = RECETAS.reduce((a, r) => a + r.fases.reduce((b, f) => b + f.pasos.length, 0), 0);
  $("#stats").innerHTML =
    `<b>${RECETAS.length}</b> platos &nbsp;·&nbsp; <b>${regiones.size}</b> comunidades &nbsp;·&nbsp; <b>${pasos}</b> pasos con sus trucos`;
}

function pintaChips() {
  const cats = [...new Set(RECETAS.map((r) => r.categoria))];
  $("#chips").innerHTML =
    `<button class="chip ${filtroCat === null ? "activa" : ""}" data-cat="">Todas</button>` +
    cats.map((c) =>
      `<button class="chip ${filtroCat === c ? "activa" : ""}" data-cat="${c}">${CATEGORIAS[c] || c}</button>`
    ).join("");
  document.querySelectorAll(".chip").forEach((el) =>
    el.addEventListener("click", () => {
      filtroCat = el.dataset.cat || null;
      pintaChips();
      pintaGrid();
    })
  );
}

function coincide(r, q) {
  const texto = [r.nombre, r.subtitulo, r.lugar, REGIONES[r.region], CATEGORIAS[r.categoria],
    r.intro, r.ingredientes.join(" "), (r.tags || []).join(" ")].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((p) => texto.includes(p));
}

function pintaGrid() {
  const lista = RECETAS.filter((r) =>
    (!filtroCat || r.categoria === filtroCat) && (!filtroTexto || coincide(r, filtroTexto))
  );
  $("#vacio").hidden = lista.length > 0;
  $("#grid").innerHTML = lista.map((r) => `
    <a class="card" href="#/receta/${esc(r.id)}">
      <span class="cat">${esc(CATEGORIAS[r.categoria] || r.categoria)}</span>
      <h2>${esc(r.nombre)}</h2>
      <p class="sub">${esc(r.subtitulo)}</p>
      <div class="meta">
        <span>📍 ${esc(r.lugar || REGIONES[r.region] || "")}</span>
        <span>⏱ ${fmtTiempo(r.tiempo_min)}</span>
        <span>🍽 ${r.raciones} raciones</span>
        <span>${"●".repeat(r.dificultad)}${"○".repeat(3 - r.dificultad)} ${DIFICULTAD[r.dificultad] || ""}</span>
      </div>
    </a>`).join("");
}

function pintaDetalle(id) {
  const r = RECETAS.find((x) => x.id === id);
  if (!r) { location.hash = "#/"; return; }
  document.title = `${r.nombre} - Recetario de la abuela`;
  let n = 0;
  const fases = r.fases.map((f) => `
    <div class="fase">
      <h3>${esc(f.n)}</h3>
      ${f.pasos.map((p) => { n++; return `
        <div class="paso">
          <span class="num">${n}</span>
          <div class="cuerpo">
            <span class="t">${esc(p.t)}</span>
            ${p.m ? `<span class="min"> · ${p.m} min</span>` : ""}
            <div>${esc(p.x)}</div>
            ${p.ab ? `<div class="truco">${esc(p.ab)}</div>` : ""}
          </div>
        </div>`; }).join("")}
    </div>`).join("");

  $("#detalle").innerHTML = `
    <header class="det-cab">
      <span class="cat">${esc(CATEGORIAS[r.categoria] || r.categoria)}</span>
      <h1>${esc(r.nombre)}</h1>
      <p class="sub">${esc(r.subtitulo)}</p>
      <div class="det-meta">
        <span>📍 ${esc(r.lugar || REGIONES[r.region] || "")}</span>
        <span>⏱ ${fmtTiempo(r.tiempo_min)}</span>
        <span>🍽 ${r.raciones} raciones</span>
        <span>${"●".repeat(r.dificultad)}${"○".repeat(3 - r.dificultad)} ${DIFICULTAD[r.dificultad] || ""}</span>
      </div>
    </header>
    <p class="det-intro">${esc(r.intro)}</p>
    <section class="seccion">
      <h2>Ingredientes</h2>
      <ul class="ingredientes">${r.ingredientes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </section>
    <section class="seccion">
      <h2>Elaboración</h2>
      ${fases}
    </section>
    ${r.secretos.length ? `
    <section class="seccion">
      <h2>Secretos de la abuela</h2>
      <ul class="secretos">${r.secretos.map((s) => `<li><b>${esc(s.titulo)}.</b> ${esc(s.texto)}</li>`).join("")}</ul>
    </section>` : ""}`;
  window.scrollTo(0, 0);
}

function enruta() {
  const m = location.hash.match(/^#\/receta\/([\w-]+)/);
  if (m) {
    $("#vista-lista").hidden = true;
    $("#vista-receta").hidden = false;
    pintaDetalle(m[1]);
  } else {
    document.title = "Recetario de la abuela";
    $("#vista-receta").hidden = true;
    $("#vista-lista").hidden = false;
  }
}

async function arranca() {
  const res = await fetch("data/recipes.json");
  RECETAS = await res.json();
  pintaStats();
  pintaChips();
  pintaGrid();
  enruta();
}

$("#q").addEventListener("input", (e) => { filtroTexto = e.target.value.trim(); pintaGrid(); });
window.addEventListener("hashchange", enruta);
arranca().catch((e) => {
  $("#grid").innerHTML = `<p class="vacio">No se pudieron cargar las recetas (${esc(e.message)}).</p>`;
});
