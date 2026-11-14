# Ideas y cola de mejoras

Referencias revisadas (patrones, no copia):
- NYT Cooking: recetario personal (guardar), diseno espacioso tipo publicacion, notas de usuarios. https://ixd.prattsi.org/2025/02/design-critique-nyt-cooking-mobile-app/
- Kitchen Stories: recetas como herramienta interactiva (raciones que recalculan, pasos con foto/video, modo cocina). https://screensdesign.com/showcase/kitchen-stories-easy-recipes
- Serious Eats MyRecipes: guardar, ordenar y encontrar rapido. https://www.seriouseats.com/myrecipes-serious-eats-announcement-11760585

Ya tenemos: raciones que recalculan, pasos ilustrados, temporizadores, modo cocina, planificador, mapa por comunidades, pasaporte con sellos, reinicio.

## P1 (siguiente)
1. Recetas nuevas: 2+ platos por comunidad. [14 nov: añadidas empanada gallega, callos, lechazo, caldereta; ronda 3: pil-pil, arroz al horno, ternasco, caldero murciano; ronda 4: sopas mallorquinas, cocido montañés, gachas, ropa vieja, chuletillas. Las 17 comunidades tienen 2+] Gestos de abuela, no relleno.
2. [HECHO 14 nov] Plato del dia: una receta destacada por fecha (determinista, sin servidor) en la cabecera.
3. [HECHO 14 nov] Lista de la compra desde una o varias recetas (ingredientes agregados, tachables, guardada en local).
4. [HECHO 14 nov] Favoritos ("mi recetario"): corazon + filtro.

## P2
5. Retos semanales: "esta semana, cocina de Galicia" con sello extra; progreso visible en la cabecera.
6. Racha de semanas cocinando (no diaria: sin presion), mostrada con calma.
7. Modo cocina: auto-avance cuando acaba el timer, pantalla siempre encendida (ya hay), paso por voz.
8. Compartir receta como imagen bonita (canvas, azulejo + titulo).
9. Notas propias por receta ("a mi abuela le ponia mas ajo").

## P3
10. Ilustraciones mas ricas por plato. [14 nov: las 13 recetas nuevas ya tienen ilustracion de portada (data/heroes_extra.json); faltan ilustraciones por paso]
11. Buscador por ingrediente ("que tengo en la nevera").
12. Impresion limpia / PDF.

## Reglas inamovibles
Puerta (_worker.js) intacta; sin :hover fuera de @media (hover:hover); touch-action: manipulation; SVG interactivo con fill rgba(0,0,0,0) y cursor:pointer; verificar toques tras cada cambio.

## Hecho 14 nov
- Donde comprar: cada ingrediente (receta y lista de la compra) lleva una linea fina 'Super facil / X mejor' segun tipo (carniceria, pescaderia, mercado, herbolario, tienda gourmet...). Clasificacion por palabras clave en app.js (DONDE).
- Por tu barrio (zona): lista con fuente (fuentes locales) + enlace 'mejor' abre Google Maps 'X cerca de mi'. Falta verificar: fruteria, bodega/aceite y arroz D.O. concretos del barrio.

## Por tu barrio (dinamico)
- Hecho: pide ubicacion con boton, Nominatim para el nombre, lista curada solo si la zona tiene datos (ZONAS en js/app.js; anadir zona = anadir objeto con caja, nota, fuentes, lugares). Otra zona o sin permiso: solo botones Maps "cerca de mi".

## Mapa mundial
- Hecho: boton Mundo/España sobre el mapa. Paises de Natural Earth 110m (js/mundo.js, generado con scripts/gen_mundo.py). Una receta de fuera de España lleva region: w-ISO3 (tempeh = w-IDN). Chapa con numero solo en paises con platos.
- Portadas: repartidas entre cazuela, cuenco, fuente, plato llano, sarten, tabla. Sprite tempeh (taquitos).
