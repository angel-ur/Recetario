# ADR 0001 — Web estática sin frameworks y local-first

## Estado
Aceptada

## Contexto
Es un recetario personal y familiar, que se usa en el móvil en la cocina. Debe cargar al instante, funcionar sin cuenta y ser fácil de mantener por una sola persona.

## Decisión
- HTML, CSS y JS sin build de JS ni dependencias. Un único script Python (`scripts/build.py`) une `recipes/*.md` con los datos estructurados y deja `_site/`.
- Estado del usuario en `localStorage` con prefijo `recetario:v2:`.
- Despliegue en Cloudflare Pages con una puerta de contraseña (worker).

## Consecuencias
- Cero coste de servidores y privacidad sencilla.
- Sin sincronización entre dispositivos hasta que exista exportar/importar.
- Hay que probar a mano en iPhone: Safari tiene reglas propias (`:hover`, toques, SVG).
