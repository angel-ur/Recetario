# Ideas y cola de mejoras

Referencias revisadas (patrones, no copia):
- NYT Cooking: recetario personal (guardar), diseno espacioso tipo publicacion, notas de usuarios. https://ixd.prattsi.org/2025/02/design-critique-nyt-cooking-mobile-app/
- Kitchen Stories: recetas como herramienta interactiva (raciones que recalculan, pasos con foto/video, modo cocina). https://screensdesign.com/showcase/kitchen-stories-easy-recipes
- Serious Eats MyRecipes: guardar, ordenar y encontrar rapido. https://www.seriouseats.com/myrecipes-serious-eats-announcement-11760585

Ya tenemos: raciones que recalculan, pasos ilustrados, temporizadores, modo cocina, planificador, mapa por comunidades, pasaporte con sellos, reinicio.

## P1 (siguiente)
1. Recetas nuevas: 2+ platos por comunidad. [14 nov: añadidas empanada gallega, callos, lechazo, caldereta; faltan 1 plato en ara, bal, can, clm, cnr, mur, pv, rio, val] Gestos de abuela, no relleno.
2. [HECHO 14 nov] Plato del dia: una receta destacada por fecha (determinista, sin servidor) en la cabecera.
3. Lista de la compra desde una o varias recetas (ingredientes agregados, tachables, guardada en local).
4. Favoritos ("mi recetario"): corazon + filtro.

## P2
5. Retos semanales: "esta semana, cocina de Galicia" con sello extra; progreso visible en la cabecera.
6. Racha de semanas cocinando (no diaria: sin presion), mostrada con calma.
7. Modo cocina: auto-avance cuando acaba el timer, pantalla siempre encendida (ya hay), paso por voz.
8. Compartir receta como imagen bonita (canvas, azulejo + titulo).
9. Notas propias por receta ("a mi abuela le ponia mas ajo").

## P3
10. Ilustraciones mas ricas por plato.
11. Buscador por ingrediente ("que tengo en la nevera").
12. Impresion limpia / PDF.

## Reglas inamovibles
Puerta (_worker.js) intacta; sin :hover fuera de @media (hover:hover); touch-action: manipulation; SVG interactivo con fill rgba(0,0,0,0) y cursor:pointer; verificar toques tras cada cambio.
