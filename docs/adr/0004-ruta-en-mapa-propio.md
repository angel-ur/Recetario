# ADR 0004: La ruta se dibuja dentro de la app (sustituye la parte de Google Maps del ADR 0003)

Estado: aceptada, 14-11-2026

## Contexto
Los enlaces a Google Maps abrian una busqueda de texto, no una ruta. Overpass no sirve desde el navegador (406 / sin CORS / mirrors caidos). Se probo con servicios reales.

## Decision
- Tiendas: Nominatim con frases especiales `[shop=butcher]` dentro de una caja de ~2,5 km; se elige la mas cercana de cada tipo.
- Camino a pie: OSRM publico (la duracion se calcula a 80 m/min porque el demo da tiempos de coche).
- Mapa: Leaflet + teselas OpenStreetMap, paradas numeradas, "Tu" y casa, y lista simple "Ve a X, luego Y, vuelve a casa".
- Google Maps queda solo como enlace secundario por tienda ("Mapa"), nunca como resultado principal.

## Consecuencias
Depende de tres servicios publicos sin garantia; ante fallo hay mensaje claro y linea recta punteada si falla OSRM.
