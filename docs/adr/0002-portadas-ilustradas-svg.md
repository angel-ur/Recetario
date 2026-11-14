# ADR 0002 — Portadas ilustradas en SVG propio

## Estado
Aceptada

## Contexto
Los sprites sueltos sobre un plato genérico se leían pobres. El usuario pidió ilustraciones reconocibles y apetecibles, pero sencillas, sin sobrecargar.

## Decisión
- Cada receta puede tener `data/ilustraciones/<id>.svg` (viewBox 320x180). Si no existe, se usa el sprite simple de `js/escenas.js`.
- Se generan con `scripts/ilu_*.py` y `scripts/ilu_lib.py`: degradados, sombras y textura, composición simple.
- Estilo de la casa: fondo crema, plato ovalado con aro azul, un plato reconocible y poco más. Referencia de nivel: gazpacho. Excepción aprobada: tempeh (escena con tabla de madera).
- Antes de dibujar un plato se mira una foto real de referencia; se prueba la ilustración en la tarjeta del iPhone.

## Consecuencias
- Más peso por receta (decenas de KB de SVG) pero sin imágenes externas.
- Hay que crear las ilustraciones una a una (9 de 37 hechas).
