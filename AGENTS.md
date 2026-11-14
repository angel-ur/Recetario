# AGENTS.md — Recetario de la abuela

Web estática de recetas de la abuela, cocina de siempre paso a paso. Sin frameworks ni build de JS.

## Estructura
- `recipes/*.md`: fuente de verdad del texto de cada receta. `recipes/_plantilla.md` es la plantilla.
- `data/enriquecido.json`: estructura (cantidades por ración, pasos, temporizadores, escenas). `data/heroes_extra.json`: portadas simples. `data/ilustraciones/<id>.svg`: portadas ilustradas.
- `scripts/build.py` genera `data/recipes.json` y `_site/`. `scripts/ilu_*.py` generan las ilustraciones. `scripts/gen_mundo.py` genera `js/mundo.js` (mapa mundial, Natural Earth).
- `index.html`, `styles.css`, `js/app.js`, `js/escenas.js`, `js/mundo.js`: la web.
- `docs/`: `product-spec.md`, `prd/`, `adr/`, `IDEAS.md`.

## Flujo
1. `git pull --rebase` antes de tocar nada. Si hay commits nuevos de otra persona o herramienta, se respetan: nunca se revierte su trabajo; si choca, se para y se pregunta.
2. Cambio pequeño, build (`python3 scripts/build.py`), prueba en iPhone emulado, commit, push, deploy.
3. Nunca `git push --force` ni reescribir historia.
4. Cada decisión de arquitectura o producto con consecuencias va a un ADR; cada funcionalidad con varias tareas, a un PRD.

## Mensajes de commit (Conventional Commits)
`tipo(ámbito): descripción en minúscula, en imperativo, sin punto final`

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`.
Ámbitos habituales: `home`, `receta`, `compra`, `mapa`, `pasaporte`, `portadas`, `build`, `docs`.
Cuerpo opcional: el porqué, no el qué. Ejemplos:
- `feat(compra): ruta por tiendas con plan B y vuelta a casa`
- `fix(receta): evita el desbordamiento horizontal en iPhone`
- `docs(adr): registra la decisión de portadas ilustradas en SVG`

Cada commit visible para el usuario añade una línea a `CHANGELOG.md` (sección «Sin publicar»).

## Reglas de producto
- La app es compartida: nada de nombres propios ni zonas por defecto en textos visibles. Las listas locales verificadas solo aparecen si la ubicación coincide.
- Lenguaje de usuario, nunca de desarrollador, en la interfaz.
- Solo se citan lugares y fuentes verificados. Una receta escrita de memoria no lleva fuente externa.
- La puerta de contraseña (`_worker.js` en el despliegue) no se toca.

## Reglas de iOS (innegociables)
- Nada de `:hover` fuera de `@media (hover: hover) and (pointer: fine)`.
- `touch-action: manipulation` en todo lo tocable.
- SVG interactivo: `fill: rgba(0,0,0,0)` y `cursor: pointer` en el área de toque.
- Tras cada cambio de interfaz se comprueba con toques reales en emulación iPhone (390 px) y sin desbordamiento horizontal.

## Puerta de calidad antes de desplegar
1. `python3 scripts/build.py` sin errores.
2. 0 errores de JS en consola en las pruebas.
3. Mapa y ficha: un solo toque basta.
4. Ancho de página = 390 px en recetas y portada.
