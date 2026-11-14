# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Sin publicar]

### Añadido
- Sesiones de cocina: «Empezar a cocinar» en cada receta, barra de platos en toda la app y vista «Ahora» que entrelaza los pasos de hasta 3 recetas a la vez. Las sesiones caducan solas (aviso a las 4 h, cierre a las 6 h) y no guardan nada al cerrarse.
- Planificador por dependencias (pasos que necesitan otros, pasos que se hacen a la vez que otro, horno único) con datos para caldo, rabo, cocido y lentejas.
- Pasos en paralelo dentro de una receta: «A la vez que el paso N» y lista de lo que cabe en el hueco.
- Cantidades exactas y porqués en las 37 recetas; las cantidades van en negro y negrita.
- Con una sesión activa, las horas del plan salen de la hora real de inicio, y se puede corregir en «Ahora > Tus platos».
- Caldo de huesos: nueva versión de la casa (huesos tostados, verdura cruda, 5 cdas de vinagre, cacerola con verdura la última hora).
- Portadas de sobaos, tumbet y xató más llenas.
- «Recetas» del menú quita el filtro de favoritos.
- Glosario de técnicas (qué es y por qué), historial de precios propio, «En la tienda» en 37 recetas, precios orientativos.
- Corregidos pasos que se perdían cuando el texto llevaba «(25 min, 200 °C)» y cabeceras de ingredientes rotas.
- Quitado «Cocinar a la vez» de la portada: se sustituye por las sesiones.
- Ruta dentro de la app con mapa propio y paradas en orden; ya no abre Google Maps.
- La compra por tienda: ruta de paradas en orden de tour, marcar comprado (también en otras recetas), plan B por ingrediente, elegir por tipo súper o tienda buena, vuelta a casa guardada solo en el móvil (PRD 001).
- Ruta dinámica: tienda más cercana de cada tipo desde la ubicación actual (OpenStreetMap) y ruta a pie completa en Google Maps.
- Portadas ilustradas propias en SVG: tempeh, paella, tortilla, cocido, gazpacho, caldo, fabada, lentejas y croquetas (PRD 002).
- Mapa del mundo con selector España/Mundo; recetas de fuera de España (tempeh, Indonesia).
- Plato del día, favoritos, lista de la compra y «dónde comprar» con enlaces a Maps.
- «Por tu barrio»: tiendas verificadas solo si la ubicación cae en una zona con lista.
- Botón «volver arriba», menú de acceso rápido y pasaporte dentro del menú.

### Cambiado
- Dónde comprar: patas, oreja, almortas, fabes y ñoras salen «por encargo» en vez de «fácil en el súper»; el vinagre de manzana ya no va a la bodega.
- Las 14 recetas sin ajuste de cantidades lo dicen en su ficha («Versión sencilla») y tienen temporizador en todo paso de 5 minutos o más.
- El sitio publicado solo lleva los datos que la web usa; quitado el campo `tiempo_min`, que nadie leía.
- README: las ilustraciones se describen como propias y generadas con código.
- Portada: recetas primero; filtros reducidos a una fila de tipos, «Más filtros» y favoritos.
- Receta: sin portada grande, método en su propia tarjeta, «Organiza el día» plegable, menú que se esconde al bajar.

### Corregido
- Caldo de huesos: vuelve el paso de espumar (en olla lenta: subir el hervor y quitar la espuma los primeros 10-15 min, antes de bajar a LOW).
- Rabo de toro: la patata entra en el guiso (cascada, 35-40 min antes del final, también al horno y en olla exprés) y espesa la salsa; la cocción lenta pasa a 2 h 20 min más 40 min de patata.
- Glosario: «Tostar» vale para huesos, harina y pan; «Levar» ya no sale con la levadura química; «Blanquear» ya no sale con yemas que «blanquean»; blanquear dice 2-5 min según la pieza.
- Textos: jengibre molido ya no va «en rodajas» (caldo), frase suelta en el truco del caldo, «patata para freír fritas» (rabo), frase repetida (chilindrón), «repulgua» (empanada gallega) y «se sella» en el cocido, que ahora dice lo que pasa de verdad.
- La ruta de la compra: enlace a Maps inmediato (sin esperar a Overpass), mensajes de error visibles y servidores en paralelo con tope de 8 s.
- iOS: doble toque en mapa y fichas (causa: `:hover` en elementos tocables).
- Desbordamiento horizontal en las recetas en iPhone.
