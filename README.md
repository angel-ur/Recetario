# Recetario de la abuela

Las recetas de la abuela, guardadas para siempre y servidas como web:
**cocina de siempre, paso a paso**, con los trucos que no salen en los libros.

🍳 **Web:** https://recetario-abuela.pages.dev/

## Cómo está montado

- `recipes/` — las recetas, un archivo Markdown por plato. **Esta es la fuente de verdad.**
- `scripts/build.py` — convierte los Markdown en `data/recipes.json` (sin dependencias).
- `index.html`, `styles.css`, `app.js` — la web estática (buscador, filtros y vista por receta).
- `.github/workflows/pages.yml` — en cada push a `main` regenera el JSON y publica la web en GitHub Pages.

## Añadir una receta

1. Copia `recipes/_plantilla.md` a `recipes/nombre-del-plato.md`.
2. Rellena el front matter (nombre, categoría, región, tiempos…) y el cuerpo:
   ingredientes, elaboración por fases y secretos de la abuela.
3. Haz push a `main`. La web se actualiza sola en un par de minutos.

Las líneas que empiezan por `>` dentro de un paso se muestran como
**«Dice la abuela»**: ahí van sus trucos, con sus palabras.

### Categorías y regiones

- Categorías: `picar`, `cuchara`, `huerta`, `carne`, `postre`, `mar`, `arroz`.
- Regiones: `es`, `and`, `mad`, `ast`, `pv`, `val`, `ara`, `bal`, `cnr`, `can`,
  `clm`, `cyl`, `cat`, `ext`, `gal`, `mur`, `rio`.

## Probar en local

```bash
python3 scripts/build.py
python3 -m http.server 8000
# abre http://localhost:8000
```
