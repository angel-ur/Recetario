# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Sin publicar]
- Sesiones de cocina: «Empezar a cocinar» en cada receta, barra de platos en toda la app y vista «Ahora» que entrelaza los pasos de hasta 3 recetas a la vez. Las sesiones caducan solas (aviso a las 4 h, cierre a las 6 h) y no guardan nada al cerrarse.
- Planificador por dependencias (pasos que necesitan otros, pasos que se hacen a la vez que otro, horno único) con datos para caldo, rabo, cocido y lentejas.
- Pasos en paralelo dentro de una receta: «A la vez que el paso N» y lista de lo que cabe en el hueco.
- Cantidades exactas y porqués en 13 recetas; las cantidades van en negro y negrita.
- Glosario de técnicas (qué es y por qué), historial de precios propio, «En la tienda» en 37 recetas, precios orientativos.
- Corregidos pasos que se perdían cuando el texto llevaba «(25 min, 200 °C)» y cabeceras de ingredientes rotas.
- Quitado «Cocinar a la vez» de la portada: se sustituye por las sesiones.
- Ruta dentro de la app con mapa propio y paradas en orden; ya no abre Google Maps.

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
