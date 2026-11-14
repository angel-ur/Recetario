# Ideas y cola de mejoras

Referencias revisadas (patrones, no copia):
- NYT Cooking: recetario personal (guardar), diseno espacioso tipo publicacion, notas de usuarios. https://ixd.prattsi.org/2025/02/design-critique-nyt-cooking-mobile-app/
- Kitchen Stories: recetas como herramienta interactiva (raciones que recalculan, pasos con foto/video, modo cocina). https://screensdesign.com/showcase/kitchen-stories-easy-recipes
- Serious Eats MyRecipes: guardar, ordenar y encontrar rapido. https://www.seriouseats.com/myrecipes-serious-eats-announcement-11760585

Ya tenemos: raciones que recalculan, pasos ilustrados, temporizadores, modo cocina, planificador, mapa por comunidades, pasaporte con sellos, reinicio.

## Hecho (14 nov)
- Sesiones de cocina con entrelazado automático y caducidad (ADR 0005).
- Cantidades y porqués en las 37 recetas.
- Plan anclado a la hora real de inicio.

## P1 (siguiente)
1. Recetas nuevas: 2+ platos por comunidad. [14 nov: añadidas empanada gallega, callos, lechazo, caldereta; ronda 3: pil-pil, arroz al horno, ternasco, caldero murciano; ronda 4: sopas mallorquinas, cocido montañés, gachas, ropa vieja, chuletillas. Las 17 comunidades tienen 2+] Gestos de abuela, no relleno.
2. [HECHO 14 nov] Plato del dia: una receta destacada por fecha (determinista, sin servidor) en la cabecera.
3. [HECHO 14 nov] Lista de la compra desde una o varias recetas (ingredientes agregados, tachables, guardada en local).
4. [HECHO 14 nov] Favoritos ("mi recetario"): corazon + filtro.

## P2
5. [HECHO 15 nov] Retos semanales: "esta semana, cocina de Galicia" con sello extra; progreso visible en la cabecera. Determinista por lunes (retoDe), 2 platos de la comunidad, sello «Al reto» al completar el primero.
6. [HECHO 15 nov] Racha de semanas cocinando (no diaria: sin presion), mostrada con calma: solo se muestra a partir de 2 semanas y la semana en curso no rompe la racha.
7. Modo cocina: auto-avance cuando acaba el timer, pantalla siempre encendida (ya hay), paso por voz.
8. [HECHO 15 nov] Compartir receta como imagen bonita (canvas 1080x1350: cenefa de azulejo, ilustracion del plato, titulo Fraunces, region y tiempo; Web Share API con archivo y descarga PNG de repuesto).
9. [HECHO 15 nov] Notas propias por receta ("a mi abuela le ponia mas ajo"): tarjeta «Mis notas» en la ficha, localStorage recetario:v2:notas, sin servidor.

## P3
10. Ilustraciones mas ricas por plato. [14 nov: las 13 recetas nuevas ya tienen ilustracion de portada (data/heroes_extra.json); faltan ilustraciones por paso]
11. Buscador por ingrediente ("que tengo en la nevera").
12. Impresion limpia / PDF.

## Reglas inamovibles
Puerta (_worker.js) intacta; sin :hover fuera de @media (hover:hover); touch-action: manipulation; SVG interactivo con fill rgba(0,0,0,0) y cursor:pointer; verificar toques tras cada cambio.

## Hecho 14 nov
- Donde comprar: cada ingrediente (receta y lista de la compra) lleva una linea fina 'Super facil / X mejor' segun tipo (carniceria, pescaderia, mercado, herbolario, tienda gourmet...). Clasificacion por palabras clave en app.js (DONDE).
- Por tu barrio: lista con fuente por zona (hoy sin zonas cargadas; se anaden con un objeto en ZONAS).

## Por tu barrio (dinamico)
- Hecho: pide ubicacion con boton, Nominatim para el nombre, lista curada solo si la zona tiene datos (ZONAS en js/app.js; anadir zona = anadir objeto con caja, nota, fuentes, lugares). Otra zona o sin permiso: solo botones Maps "cerca de mi".

## Mapa mundial
- Hecho: boton Mundo/España sobre el mapa. Paises de Natural Earth 110m (js/mundo.js, generado con scripts/gen_mundo.py). Una receta de fuera de España lleva region: w-ISO3 (tempeh = w-IDN). Chapa con numero solo en paises con platos.
- Portadas: repartidas entre cazuela, cuenco, fuente, plato llano, sarten, tabla. Sprite tempeh (taquitos).

## Portadas ilustradas (estilo casa)
- Cada receta puede tener una ilustracion propia en `data/ilustraciones/<id>.svg` (viewBox 0 0 320 180, sin etiqueta svg exterior). `scripts/build.py` la usa si existe; si no, cae al sprite simple de `js/escenas.js`.
- Se generan con `scripts/ilu_*.py` (+ `scripts/ilu_lib.py`). En el SVG los ids de degradado empiezan por `ID`; el build los prefija por receta.
- Estilo acordado: fondo crema, plato ovalado con aro azul (var(--anil)), composicion simple, un plato reconocible y poco mas. Referencia de nivel: gazpacho. El tempeh es la excepcion (escena con tabla de madera, aprobada).
- Hechas: tempeh, paella, tortilla (entera, cupula dorada), cocido, gazpacho, caldo, fabada, lentejas, croquetas, crema catalana (cazuelita, costra y pala), pulpo (tabla de madera), marmitako, migas (sarten y uvas), pisto (sarten y huevo), arroz con leche, xato, papas (arrugadas con mojos), tumbet (capas y tomate), chilindron, pil-pil (bacalao en su gelatina), caldereta, callos, empanada gallega (redonda con su cuña), lechazo (paletilla en barro), ropa vieja, sopa castellana, zarangollo, chuletillas, arroz al horno, caldero, riojana, cocido montanes, gachas, sopas mallorquinas, ternasco, sobaos (36/37). Solo falta: rabo (Angel la esta dictando).

## La compra por tienda (v1)
- En «La compra» hay un selector Por receta / Por tienda (localStorage `cvista`).
- Por tienda: cada ingrediente va a una parada segun su tipo (tabla DONDE). Por tipo se elige Súper o la tienda «mejor» (`tprefs`, por defecto mejor en fresco y Súper en seco). Orden de la ruta: ORDEN_TOUR (seco primero, pescado al final).
- Marcar comprado marca tambien el mismo ingrediente en otras recetas. «No lo tienen» (plan B, campo `x`) pasa el ingrediente a la otra opcion (Súper <-> tienda mejor).
- Vuelta a casa: «Guardar mi casa aquí» guarda lat/lon redondeados solo en el movil (`casa`); el boton abre Google Maps (a pie) con destino casa y, en zonas con lista verificada (zona con lista), las tiendas concretas como paradas.
- Siguientes ideas: unir ingredientes repetidos en una sola linea, cantidades sumadas, horarios por tienda, ruta con mas zonas verificadas.
- Ruta dinamica (v1.1): «Calcular ruta desde mi ubicación» busca en OpenStreetMap (Overpass, sin clave) la tienda con nombre mas cercana de cada tipo de parada pendiente (tabla OSM en app.js, radio 3 km, distancia en linea recta) y arma una ruta a pie en Google Maps: origen tu ubicacion, paradas en orden de tour, destino casa (si esta guardada). Si Overpass no responde o no hay tienda de ese tipo, esa parada va como busqueda de texto y Maps elige. Maximo 9 paradas (limite de Maps). La lista verificada de la zona ya no se usa para la ruta, solo en la tarjeta «Por tu barrio».
- Más datos de dependencias (`tras`/`durante`/`enlaza`) en recetas fuera de caldo, rabo, cocido, lentejas y paella. [15 nov: +crema catalana, tumbet, xato, marmitako]

## Hecho 15 nov
- Auditoria de dependencias: Leaflet 1.9.4 (ultima estable) ahora se sirve desde el propio sitio en `js/vendor/leaflet/`, sin CDN ni integridad rota posible (ADR 0006). Antes se cargaba de unpkg al usar la ruta.
- Portada ilustrada de crema catalana.
