# Recetario de la abuela

Las recetas de la abuela, guardadas para siempre y servidas como web:
**cocina de siempre, paso a paso**, con los trucos que no salen en los libros.

## Qué tiene

- **Mapa de España interactivo**: toca una comunidad y salen sus platos; las que
  cocinas se sellan en color vino (pasaporte con logros incluido).
- **37 recetas**, cada paso con su dibujo y portadas ilustradas propias (ilustraciones propias, generadas con código).
- **Organiza el día**: di a qué hora quieres comer y te dice a qué hora empezar,
  con la cronología por fases (incluidos los remojos de la víspera).
- **Modo cocina** paso a paso, con temporizadores que suenan y cantidades que se
  ajustan a tus raciones.
- Buscador y filtros por tipo de plato y por tiempo.

Todo funciona en local en el navegador (localStorage): sellos, «tengo esto»,
raciones y temporizadores.

## Cómo está montado

- `recipes/` — las recetas, un archivo Markdown por plato. **Fuente de verdad del texto.**
- `data/enriquecido.json` — datos estructurados del recetario original (cantidades por
  ración, temporizadores, escenas ilustradas, métodos alternativos), indexado por id.
- `scripts/build.py` — combina ambos en `data/recipes.json` y deja el sitio estático
  listo en `_site/` (sin dependencias, solo Python 3).
- `index.html`, `styles.css`, `js/` — la web estática (sin build de JS ni frameworks).

## Despliegue

El sitio es 100% estático. Para publicarlo (p. ej. Cloudflare Pages):

- **Comando de build:** `python3 scripts/build.py`
- **Directorio de salida:** `_site`

## Añadir una receta

1. Copia `recipes/_plantilla.md` a `recipes/nombre-del-plato.md`.
2. Rellena el front matter (nombre, categoría, región, tiempos…) y el cuerpo:
   ingredientes, elaboración por fases y secretos de la abuela.
3. `python3 scripts/build.py` y sube los cambios.

Las líneas que empiezan por `>` dentro de un paso se muestran como
**«Así lo hace la abuela»**: ahí van sus trucos, con sus palabras.

### Categorías y regiones

- Categorías: `picar`, `cuchara`, `huerta`, `carne`, `postre`, `mar`, `arroz`.
- Regiones: `es`, `and`, `mad`, `ast`, `pv`, `val`, `ara`, `bal`, `cnr`, `can`,
  `clm`, `cyl`, `cat`, `ext`, `gal`, `mur`, `rio`, `nav`.

## Probar en local

```bash
python3 scripts/build.py
cd _site && python3 -m http.server 8000
# abre http://localhost:8000
```

## Documentación del proyecto
- `AGENTS.md`: flujo, estándar de commits (Conventional Commits) y puerta de calidad.
- `docs/product-spec.md`, `docs/prd/`, `docs/adr/`, `docs/IDEAS.md`, `CHANGELOG.md`.
