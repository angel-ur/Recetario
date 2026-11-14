# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]

### Añadido
- La compra por tienda: ruta de paradas en orden de tour, marcar comprado (también en otras recetas), plan B por ingrediente, elegir por tipo súper o tienda buena, vuelta a casa guardada solo en el móvil (PRD 001).
- Ruta dinámica: tienda más cercana de cada tipo desde la ubicación actual (OpenStreetMap) y ruta a pie completa en Google Maps.
- Portadas ilustradas propias en SVG: tempeh, paella, tortilla, cocido, gazpacho, caldo, fabada, lentejas y croquetas (PRD 002).
- Mapa del mundo con selector España/Mundo; recetas de fuera de España (tempeh, Indonesia).
- Plato del día, favoritos, lista de la compra y «dónde comprar» con enlaces a Maps.
- «Por tu barrio»: tiendas verificadas solo si la ubicación cae en una zona con lista.
- Botón «volver arriba», menú de acceso rápido y pasaporte dentro del menú.

### Cambiado
- Portada: recetas primero; filtros reducidos a una fila de tipos, «Más filtros» y favoritos.
- Receta: sin portada grande, método en su propia tarjeta, «Organiza el día» plegable, menú que se esconde al bajar.

### Corregido
- La ruta de la compra: enlace a Maps inmediato (sin esperar a Overpass), mensajes de error visibles y servidores en paralelo con tope de 8 s.
- iOS: doble toque en mapa y fichas (causa: `:hover` en elementos tocables).
- Desbordamiento horizontal en las recetas en iPhone.
