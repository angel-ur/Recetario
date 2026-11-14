# Especificación de producto — Recetario de la abuela

| | |
|---|---|
| **Versión** | 0.1 |
| **Estado** | Vigente |

## Propuesta
Las recetas de la abuela, guardadas para siempre: cocina de siempre, paso a paso, con los trucos que no salen en los libros. Se usa en el móvil, con las manos manchadas.

## Principios
1. Recetas primero. Todo lo demás (mapa, pasaporte, retos) está a un toque, nunca delante.
2. Una pasada de fácil: pocos filtros visibles, lenguaje de usuario, nada de jerga técnica.
3. Con gestos de abuela: cada receta lleva sus trucos con sus palabras.
4. Compartida: no asume quién eres ni dónde vives.
5. Local-first: sellos, favoritos y compra viven en el navegador (`localStorage`, prefijo `recetario:v2:`); la ubicación nunca sale del móvil salvo hacia Maps/OSM por acción explícita.

## Funcionalidades
| Área | Qué hace | Estado | Doc |
|---|---|---|---|
| Recetas | 37 platos, fases, temporizadores, raciones | Hecho | `recipes/` |
| Mapa | España y Mundo, pasaporte de 17 comunidades | Hecho | |
| Plato del día, favoritos | Sugerencia diaria, corazón, filtro | Hecho | |
| La compra | Por receta o ruta por tiendas, plan B, vuelta a casa | v1 | PRD 001 |
| Portadas | Ilustración propia por plato en SVG | En curso (9 de 37) | PRD 002, ADR 0002 |
| Retos y rachas | Retos semanales, rachas | Pendiente | `docs/IDEAS.md` |

## Fuera de alcance por ahora
Cuentas de usuario, sincronización entre dispositivos, backend propio.
